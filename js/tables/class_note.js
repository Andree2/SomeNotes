﻿function Note()
{
    // =============================================================================================
    // ================================= Private ===================================================
    // =============================================================================================
    function BuildEditTable(title, text, date, time, importance, category)
    {
        var output = ""
            +"  <tr>"
            +"    <td>Title</td>"
            +"    <td colspan='5'><input id='input_note_title' name='input_note_title' type='text' maxLength='255' value='"+ My.HtmlSpecialChars(title) +"' size='79'/></td>"
            +"  </tr>"
            +"  <tr>"
            +"    <td>Text</td>"
            +"    <td colspan='5'><textarea id='input_note_text' name='input_note_text' type='text' cols='80' rows='20'>"+ My.HtmlSpecialChars(text) +"</textarea></td>"
            +"  </tr>"
            +"  <tr>"
            +"    <td>Date</td>"
            +"    <td colspan='5'><input id='input_note_datetime' name='input_note_datetime' type='datetime-local' value='"+ date +"T"+ time +"' maxLength='12' size='7'/></td>"
            +"  </tr>"
            +"  <tr>"
            +"    <td>Importance</td>"
            +"    <td colspan='4'>"
            +       Slider.BuildHTML('input_note_importance', importance)
            +"    </td>"
            +"    <td>"
            +"      <span style='border:1px solid #888888; padding:2px;'>" + category + "</span>"
            +"    </td>"
            +"  </tr>";
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
                              item.getAttribute("date"),
                              item.getAttribute("time"),
                              item.getAttribute("importance"),
                              My.FirstChildNodeValuesToString(item.getElementsByTagName("category")));
    };
    // ---------------------------------------------------------------------------------------------    
    this.BuildNew = function(date, time)
    {
        return BuildEditTable("", "", date, time, 1, "");
    };
    // ---------------------------------------------------------------------------------------------
    this.CheckEditNewInput = function()
    {
        if(document.getElementById('input_note_title').value == '') {
            alert('Please enter a title.');
            return false;
        }
        return true;
    };
    // ---------------------------------------------------------------------------------------------
    this.GetRow = function(id)
    {
        datetimeParts = document.getElementById('input_note_datetime').value.split("T");
        xml =   '<row table="note"' + (id == '' ? '' : ' id="'+ id +'"') + '>'        
               +'  <title>'+      My.HtmlSpecialChars(document.getElementById('input_note_title').value) +'</title>'
               +'  <text>'+       My.HtmlSpecialChars(document.getElementById('input_note_text').value) +'</text>'
               +'  <date>'+       datetimeParts[0] +'</date>'
               +'  <time>'+       datetimeParts[1] +'</time>'
               +'  <importance>'+ document.getElementById('input_note_importance').value +'</importance>'
               +'</row>';
        
        return xml;
    };
    // ---------------------------------------------------------------------------------------------
}