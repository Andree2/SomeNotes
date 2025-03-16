﻿function Event()
{
    // =============================================================================================
    // ================================= Private ===================================================
    // =============================================================================================
    function BuildEditTable(title, text, fromDate, fromTime, toDate, toTime, importance, category)
    {
        var output = ""
            + "  <tr>"
            + "    <td>Title</td>"
            + "    <td colspan='5' class='fillTable'><input id='input_event_title' name='input_event_title' type='text' maxLength='255' value='" + My.HtmlSpecialChars(title) + "' class='fillCell' /></td>"
            + "  </tr>"
            + "  <tr>"
            + "    <td>Text</td>"
            + "    <td colspan='5' class='fillTable'><textarea id='input_event_text' name='input_event_text' type='text' rows='30' class='fillCell'>" + My.HtmlSpecialChars(text) + "</textarea></td>"
            + "  </tr>"
            + "  <tr>"
            + "    <td>From</td>"
            + "    <td colspan='5'><input id='input_event_from_datetime' name='input_event_from_datetime' type='datetime-local' value=" + fromDate + "T" + fromTime + " maxLength='12'/></td>"
            + "  </tr>"
            + "  <tr>"
            + "    <td>To</td>"
            + "    <td colspan='5'><input id='input_event_to_datetime' name='input_event_to_datetime' type='datetime-local' value=" + toDate + "T" + toTime + " maxLength='12'/></td>"
            + "  <tr>"
            + "    <td>Importance</td>"
            + "    <td colspan='3'>"
            + "      <input id='input_event_importance' type='number' min='0' max='10' value='" + importance + "'/>"
            + "    </td>"
            + "    <td colspan='2'>"
            + "      <span style='border:1px solid #888888; padding:2px;'>" + category + "</span>"
            + "    </td>"
            + "  </tr>";
        return output;
    };

    // =============================================================================================
    // ================================= Privileged ================================================
    // =============================================================================================
    // ---------------------------------------------------------------------------------------------        
    this.BuildEditFromXML = function(item)
    {
        return BuildEditTable(My.FirstChildNodeValuesToString(item.getElementsByTagName("title")),
            My.FirstChildNodeValuesToString(item.getElementsByTagName("text")),
            item.getAttribute("from_date"),
            item.getAttribute("from_time"),
            item.getAttribute("to_date"),
            item.getAttribute("to_time"),
            item.getAttribute("importance"),
            My.FirstChildNodeValuesToString(item.getElementsByTagName("category")));
    };
    // ---------------------------------------------------------------------------------------------    
    this.BuildNew = function(date, time)
    {
        return BuildEditTable("", "", date, "00:00", date, "00:00", 0, "");
    };
    // ---------------------------------------------------------------------------------------------
    this.CheckEditNewInput = function()
    {
        if (document.getElementById('input_event_title').value == '')
        {
            alert('Please enter a title.');
            return false;
        }
        return true;
    };
    // ---------------------------------------------------------------------------------------------
    this.GetRow = function(id)
    {
        fromDatetimeParts = document.getElementById('input_event_from_datetime').value.split("T");
        toDatetimeParts = document.getElementById('input_event_to_datetime').value.split("T");
        xml = '<row table="event"' + (id == '' ? '' : ' id="' + id + '"') + '>'
            + '  <title>' + My.HtmlSpecialChars(document.getElementById('input_event_title').value) + '</title>'
            + '  <text>' + My.HtmlSpecialChars(document.getElementById('input_event_text').value) + '</text>'
            + '  <from_date>' + fromDatetimeParts[0] + '</from_date>'
            + '  <from_time>' + fromDatetimeParts[1] + '</from_time>'
            + '  <to_date>' + toDatetimeParts[0] + '</to_date>'
            + '  <to_time>' + toDatetimeParts[1] + '</to_time>'
            + '  <importance>' + document.getElementById('input_event_importance').value + '</importance>'
            + '</row>';

        return xml;
    };
    // ---------------------------------------------------------------------------------------------
}