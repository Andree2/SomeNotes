function Day()
{
    // =============================================================================================
    // ================================= Private ===================================================
    // =============================================================================================
    function BuildEditTable(fromDate, toDate, category)
    {
        var output = ""
            +"  <tr>"
            +"    <td>From</td>"
            +"    <td><input id='input_day_from_date' name='input_day_from_date' type='date' value='"+ fromDate +"' maxLength='12' size='7'/></td>"
            +"    <td>To</td>"
            +"    <td colspan='2'><input id='input_day_to_date' name='input_day_to_date' type='date' value='"+ toDate +"' maxLength='12' size='7'/></td>"
            +"    <td>"
            +"      <select id='input_day_category' name='input_day_category' size='18'>";
            var categories = Categories.GetCategories('day');
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
        return BuildEditTable(item.getAttribute("from_date"),
                              item.getAttribute("to_date"),
                              item.getAttribute("category"));
    };
    // ---------------------------------------------------------------------------------------------    
    this.BuildNew = function(date, time)
    {
        return BuildEditTable(date, date, 700);
    };
    // ---------------------------------------------------------------------------------------------
    this.CheckEditNewInput = function()
    {
        return true;
    };
    // ---------------------------------------------------------------------------------------------
    this.GetRow = function(id)
    {
        xml = '<row table="day"' + (id == '' ? '' : ' id="'+ id +'"') + '>';        
        xml +=  '  <from_date>'+       document.getElementById('input_day_from_date').value +'</from_date>'
               +'  <to_date>'+       document.getElementById('input_day_to_date').value +'</to_date>'
               +'  <category>'+   document.getElementById('input_day_category').value +'</category>'
               +'</row>';
        
        return xml;
    };
    // ---------------------------------------------------------------------------------------------
}