﻿function Tag()
{
    // =============================================================================================
    // ================================= Private ===================================================
    // =============================================================================================
    function BuildEditTable(title, text, importance, category)
    {
        var output = ""
            +"  <tr>"
            +"    <td>Title</td>"
            +"    <td colspan='5'><input id='input_tag_title' name='input_tag_title' type='text' maxLength='255' value='"+ My.HtmlSpecialChars(title) +"' size='79'/></td>"
            +"  </tr>"
            +"  <tr>"
            +"    <td>Text</td>"
            +"    <td colspan='5'><textarea id='input_tag_text' name='input_tag_text' type='text' cols='80' rows='20'>"+ My.HtmlSpecialChars(text) +"</textarea></td>"
            +"  </tr>"
            +"  <tr>"
            +"    <td>Importance</td>"
            +"    <td colspan='4'>"
            +       Slider.BuildHTML('input_tag_importance', importance)
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
    this.BuildEditFromXML = function (item)
    {
        return BuildEditTable(item.getElementsByTagName("title")[0].childNodes[0].nodeValue,
                              My.NodeValuesToString(item.getElementsByTagName("text")[0].childNodes),
                              item.getAttribute("importance"),
                              item.getAttribute("category"));
    };
    // ---------------------------------------------------------------------------------------------    
    this.BuildNew = function(date, time)
    {
        return BuildEditTable("", "", 1, 400);
    };
    // ---------------------------------------------------------------------------------------------
    this.CheckEditNewInput = function()
    {
        if(document.getElementById('input_tag_title').value == '') {
            alert('Please enter a title.');
            return false;
        }
        return true;
    };
    // ---------------------------------------------------------------------------------------------
    this.GetRow = function(id)
    {
        xml = '<row table="tag"' + (id == '' ? '' : ' id="'+ id +'"') + '>';
        xml +=  '  <title>'+      My.HtmlSpecialChars(document.getElementById('input_tag_title').value) +'</title>'
               +'  <text>'+       My.HtmlSpecialChars(document.getElementById('input_tag_text').value) +'</text>'
               +'  <importance>'+ document.getElementById('input_tag_importance').value +'</importance>'
               +'</row>';
        
        return xml;
    };
    // ---------------------------------------------------------------------------------------------
}