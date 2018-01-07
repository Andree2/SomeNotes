function Place()
{
    // =============================================================================================
    // ================================= Private ===================================================
    // =============================================================================================
    function BuildEditTable(title, address, latitude, longitude, importance, category)
    {
        var output = ""
            +"  <tr>"
            +"    <td>Title</td>"
            +"    <td colspan='5'><input id='input_place_title' name='input_place_title' type='text' maxLength='255' value='"+ My.HtmlSpecialChars(title) +"' size='79'/></td>"
            +"  </tr>"
            +"  <tr>"
            +"    <td>Address</td>"
            +"    <td colspan='5'><textarea id='input_place_address' name='input_place_address' type='text' cols='80' rows='20'>"+ My.HtmlSpecialChars(address) +"</textarea></td>"
            +"  </tr>"
            +"  <tr>"
            +"    <td>Latitude</td>"
            +"    <td><input id='input_place_latitude' name='input_place_latitude' type='number' value="+ latitude +" size='10'/></td>"
            +"    <td>Longitude</td>"
            +"    <td><input id='input_place_longitude' name='input_place_longitude' type='number' value="+ longitude +" size='10'/></td>"
            +"    <td></td>"
            +"    <td></td>"
            +"  <tr>"
            +"  <tr>"
            +"    <td>Importance</td>"
            +"    <td colspan='4'>"
            +       Slider.BuildHTML('input_place_importance', importance)
            +"    </td>"
            +"    <td>"
            +"      <select id='input_place_category' name='input_place_category' size='1'>"
            var categories = Categories.GetCategories('place');
            categories.forEach(function(c) {
                output += "        <option value='"+ c.mCategory +"' " + (category == c.mCategory ? "selected='selected'" : "") + ">" + c.mDisplayText + "</option>"
            });
            return output
            +"      </select>"
            +"    </td>"
            +"  </tr>";
    };
    
    // =============================================================================================
    // ================================= Privileged ================================================
    // =============================================================================================
    // ---------------------------------------------------------------------------------------------    
    this.BuildEditFromXML = function(item)
    {
        return BuildEditTable(item.getElementsByTagName("title")[0].childNodes[0].nodeValue,
                              My.NodeValuesToString(item.getElementsByTagName("address")[0].childNodes),
                              item.getAttribute("latitude"),
                              item.getAttribute("longitude"),
                              item.getAttribute("importance"),
                              item.getAttribute("category"));
    };
    // ---------------------------------------------------------------------------------------------    
    this.BuildNew = function(date, time)
    {
        return BuildEditTable("", "", 0, 0, 1, 800);
    };
    // ---------------------------------------------------------------------------------------------
    this.CheckEditNewInput = function()
    {
        if(document.getElementById('input_place_title').value == '') {
            alert('Please enter a title.');
            return false;
        }
        return true;
    };
    // ---------------------------------------------------------------------------------------------
    this.GetRow = function(id)
    {
        xml = '<row table="place"' + (id == '' ? '' : ' id="'+ id +'"') + '>';
        
        xml +=  '  <title>'+      My.HtmlSpecialChars(document.getElementById('input_place_title').value) +'</title>'
               +'  <address>'+       My.HtmlSpecialChars(document.getElementById('input_place_address').value) +'</address>'
               +'  <latitude>'+       document.getElementById('input_place_latitude').value +'</latitude>'
               +'  <longitude>'+       document.getElementById('input_place_longitude').value +'</longitude>'
               +'  <importance>'+ document.getElementById('input_place_importance').value +'</importance>'
               +'  <category>'+   document.getElementById('input_place_category').value +'</category>'
               +'</row>';
        
        return xml;
    };
    // ---------------------------------------------------------------------------------------------
}