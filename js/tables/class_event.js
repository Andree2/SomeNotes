﻿function Event()
{
    // =============================================================================================
    // ================================= Private ===================================================
    // =============================================================================================
    function BuildEditTable(title, text, fromDate, fromTime, fromMinus, toDate, toTime, toPlus, importance, category)
    {
        var output = ""
            +"  <tr>"
            +"    <td>Title</td>"
            +"    <td colspan='5'><input id='input_event_title' name='input_event_title' type='text' maxLength='255' value='"+ My.HtmlSpecialChars(title) +"' size='79'/></td>"
            +"  </tr>"
            +"  <tr>"
            +"    <td>Text</td>"
            +"    <td colspan='5'><textarea id='input_event_text' name='input_event_text' type='text' cols='80' rows='20'>"+ My.HtmlSpecialChars(text) +"</textarea></td>"
            +"  </tr>"
            +"  <tr>"
            +"    <td>From</td>"
            +"    <td><input id='input_event_from_datetime' name='input_event_from_datetime' type='datetime-local' value="+ fromDate +"T"+ fromTime +" maxLength='12' size='7'/></td>"
            +"    <td>To</td>"
            +"    <td><input id='input_event_to_datetime' name='input_event_to_datetime' type='datetime-local' value="+ toDate +"T"+ toTime +" maxLength='12' size='7'/></td>"
            +"    <td></td>"
            +"    <td></td>"
            +"  <tr>"
            +"    <td align='right'>-</td>"
            +"    <td><input id='input_event_from_minus' name='input_event_from_minus' type='text' value='"+ fromMinus +"' maxLength='3' size='7'/></td>"
            +"    <td align='right'>+</td>"
            +"    <td><input id='input_event_to_plus' name='input_event_to_plus' type='text' value='"+ toPlus +"' maxLength='3' size='7'/></td>"
            +"    <td></td>"
            +"    <td></td>"
            +"  </tr>"
            +"  <tr>"
            +"    <td>Importance</td>"
            +"    <td colspan='3'>"
            +       Slider.BuildHTML('input_event_importance', importance)
            +"    </td>"
            +"    <td colspan='2'>"
            +"      <select id='input_event_category' name='input_event_category' size='1'>"
            var categories = Categories.GetCategories('event');
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
    this.BuildEditFromXML = function (item)
    {
        return BuildEditTable(item.getElementsByTagName("title")[0].childNodes[0].nodeValue,
                              My.NodeValuesToString(item.getElementsByTagName("text")[0].childNodes),
                              item.getAttribute("from_date"),
                              item.getAttribute("from_time"),
                              item.getAttribute("from_minus"),
                              item.getAttribute("to_date"),
                              item.getAttribute("to_time"),
                              item.getAttribute("to_plus"),
                              item.getAttribute("importance"),
                              item.getAttribute("category"));
    };
    // ---------------------------------------------------------------------------------------------    
    this.BuildNew = function(date, time)
    {
        return BuildEditTable("", "", date, "00:00", 0, date, "00:00", 0, 1, 100);
    };
    // ---------------------------------------------------------------------------------------------
    this.CheckEditNewInput = function()
    {
        if(document.getElementById('input_event_title').value == '') {
            alert('Please enter a title.');
            return false;
        }
        return true;
    };
    // ---------------------------------------------------------------------------------------------
    this.GetRow = function(id)
    {
        xml = '<row table="event"' + (id == '' ? '' : ' id="'+ id +'"') + '>';
        
        fromDatetimeParts = document.getElementById('input_event_from_datetime').value.split("T");
        toDatetimeParts = document.getElementById('input_event_to_datetime').value.split("T");
        xml +=  '  <title>'+      My.HtmlSpecialChars(document.getElementById('input_event_title').value) +'</title>'
               +'  <text>'+       My.HtmlSpecialChars(document.getElementById('input_event_text').value) +'</text>'
               +'  <from_date>'+  fromDatetimeParts[0] +'</from_date>'
               +'  <from_time>'+  fromDatetimeParts[1] +'</from_time>'
               +'  <from_minus>'+ document.getElementById('input_event_from_minus').value +'</from_minus>'
               +'  <to_date>'+    toDatetimeParts[0] +'</to_date>'
               +'  <to_time>'+    toDatetimeParts[1] +'</to_time>'
               +'  <to_plus>'+    document.getElementById('input_event_to_plus').value +'</to_plus>'
               +'  <importance>'+ document.getElementById('input_event_importance').value +'</importance>'
               +'  <category>'+   document.getElementById('input_event_category').value +'</category>'
               +'</row>';
        
        return xml;
    };
    // ---------------------------------------------------------------------------------------------
}