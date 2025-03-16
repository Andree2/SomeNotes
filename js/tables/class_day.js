function Day()
{
    // =============================================================================================
    // ================================= Private ===================================================
    // =============================================================================================
    function BuildEditTable(fromDate, toDate, category)
    {
        var output = ""
            + "  <tr>"
            + "    <td>From</td>"
            + "    <td><input id='input_day_from_date' name='input_day_from_date' type='date' value='" + fromDate + "' maxLength='12'/></td>"
            + "    <td>To</td>"
            + "    <td colspan='2'><input id='input_day_to_date' name='input_day_to_date' type='date' value='" + toDate + "' maxLength='12'/></td>"
            + "    <td class='fillTable'>"
            + "      <select id='input_day_category' name='input_day_category' size='20' class='fillCell'>";
        var categories = My.GetDayCategoriesDisplayText();
        for (key in categories)
        {
            output += "        <option value='" + key + "' " + (category == key ? "selected='selected'" : "") + ">" + categories[key] + "</option>"
        };
        return output
            + "      </select>"
            + "    </td>"
            + "  </tr>";
    };

    // =============================================================================================
    // ================================= Privileged ================================================
    // =============================================================================================
    // ---------------------------------------------------------------------------------------------    
    this.BuildEditFromXML = function(item)
    {
        return BuildEditTable(item.getAttribute("from_date"),
            item.getAttribute("to_date"),
            My.FirstChildNodeValuesToString(item.getElementsByTagName("category")));
    };
    // ---------------------------------------------------------------------------------------------    
    this.BuildNew = function(date, time)
    {
        return BuildEditTable(date, date, "");
    };
    // ---------------------------------------------------------------------------------------------
    this.CheckEditNewInput = function()
    {
        return true;
    };
    // ---------------------------------------------------------------------------------------------
    this.GetRow = function(id)
    {
        xml = '<row table="day"' + (id == '' ? '' : ' id="' + id + '"') + '>'
            + '  <from_date>' + document.getElementById('input_day_from_date').value + '</from_date>'
            + '  <to_date>' + document.getElementById('input_day_to_date').value + '</to_date>'
            + '  <category>' + document.getElementById('input_day_category').value + '</category>'
            + '</row>';

        return xml;
    };
    // ---------------------------------------------------------------------------------------------
}