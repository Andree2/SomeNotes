function Place()
{
    // =============================================================================================
    // ================================= Private ===================================================
    // =============================================================================================
    function BuildEditTable(title, address, latitude, longitude, importance, category)
    {
        var lat_long = (latitude == "" && longitude == "") ? "" : latitude +", "+ longitude;
        var output = ""
            +"  <tr>"
            +"    <td>Title</td>"
            +"    <td colspan='5' class='fillTable'><input id='input_place_title' name='input_place_title' type='text' maxLength='255' value='"+ My.HtmlSpecialChars(title) +"' class='fillCell'/></td>"
            +"  </tr>"
            +"  <tr>"
            +"    <td>Address</td>"
            +"    <td colspan='5' class='fillTable'><textarea id='input_place_address' name='input_place_address' type='text' class='fillCell' rows='10'>"+ My.HtmlSpecialChars(address) +"</textarea></td>"
            +"  </tr>"
            +"  <tr>"
            +"    <td>Lat/Long</td>"
            +"    <td colspan='5' class='fillTable'><input id='input_place_latitude_longitude' name='input_place_latitude_longitude' type='text' value='"+ lat_long +"' class='fillCell'/></td>"
            +"  <tr>"
            +"  <tr>"
            +"    <td>Importance</td>"
            +"    <td colspan='4'>"
            +       Slider.BuildHTML('input_place_importance', importance)
            +"    </td>"
            +"    <td>"
            +"      <span style='border:1px solid #888888; padding:2px;'>" + category + "</span>"
            +"    </td>"
            +"  </tr>";
            return output;
    };
    // ---------------------------------------------------------------------------------------------   
    function ParseInputLatitudeLongitude()
    {
        return My.HtmlSpecialChars(document.getElementById('input_place_latitude_longitude').value).split(',');
    }
    
    // =============================================================================================
    // ================================= Privileged ================================================
    // =============================================================================================
    // ---------------------------------------------------------------------------------------------    
    this.BuildEditFromXML = function(item)
    {
        return BuildEditTable(My.FirstChildNodeValuesToString(item.getElementsByTagName("title")),
                              My.FirstChildNodeValuesToString(item.getElementsByTagName("address")),
                              item.getAttribute("latitude"),
                              item.getAttribute("longitude"),
                              item.getAttribute("importance"),
                              My.FirstChildNodeValuesToString(item.getElementsByTagName("category")));
    };
    // ---------------------------------------------------------------------------------------------    
    this.BuildNew = function(date, time)
    {
        return BuildEditTable("", "", "", "", 1, "");
    };
    // ---------------------------------------------------------------------------------------------
    this.CheckEditNewInput = function()
    {
        if(document.getElementById('input_place_title').value == '') {
            alert('Please enter a title.');
            return false;
        }
        if (ParseInputLatitudeLongitude().length != 2) {
            alert('Latitude/longitude must have the format "<latitude>, <longitude>".');
            return false;
        }
        return true;
    };
    // ---------------------------------------------------------------------------------------------
    this.GetRow = function(id)
    {
        var latitude_longitude = ParseInputLatitudeLongitude();        
        xml =   '<row table="place"' + (id == '' ? '' : ' id="'+ id +'"') + '>'       
               +'  <title>'+      My.HtmlSpecialChars(document.getElementById('input_place_title').value) +'</title>'
               +'  <address>'+       My.HtmlSpecialChars(document.getElementById('input_place_address').value) +'</address>'
               +'  <latitude>'+       latitude_longitude[0] +'</latitude>'
               +'  <longitude>'+       latitude_longitude[1] +'</longitude>'
               +'  <importance>'+ document.getElementById('input_place_importance').value +'</importance>'
               +'</row>';
        
        return xml;
    };
    // ---------------------------------------------------------------------------------------------
}