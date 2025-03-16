﻿function Tag()
{
    // =============================================================================================
    // ================================= Private ===================================================
    // =============================================================================================
    function BuildEditTable(title, text, importance, category, induced_category)
    {
        var output = ""
            + "  <tr>"
            + "    <td>Title</td>"
            + "    <td colspan='5' class='fillTable'><input id='input_tag_title' name='input_tag_title' type='text' maxLength='255' value='" + My.HtmlSpecialChars(title) + "' class='fillCell'/></td>"
            + "  </tr>"
            + "  <tr>"
            + "    <td>Text</td>"
            + "    <td colspan='5' class='fillTable'><textarea id='input_tag_text' name='input_tag_text' type='text' rows='30' class='fillCell'>" + My.HtmlSpecialChars(text) + "</textarea></td>"
            + "  </tr>"
            + "  <tr>"
            + "    <td>Induced</td>"
            + "    <td colspan='5' class='fillTable'><input id='input_tag_induced_category' name='input_tag_induced_category' type='text' maxLength='255' value='" + My.HtmlSpecialChars(induced_category) + "' class='fillCell'/></td>"
            + "  </tr>"
            + "  <tr>"
            + "    <td>Importance</td>"
            + "    <td colspan='4'>"
            + "      <input id='input_tag_importance' type='number' min='0' max='10' value='" + importance + "'/>"
            + "    </td>"
            + "    <td>"
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
            item.getAttribute("importance"),
            My.FirstChildNodeValuesToString(item.getElementsByTagName("category")),
            My.FirstChildNodeValuesToString(item.getElementsByTagName("induced_category")));
    };
    // ---------------------------------------------------------------------------------------------    
    this.BuildNew = function(date, time)
    {
        return BuildEditTable("", "", 1, "", "");
    };
    // ---------------------------------------------------------------------------------------------
    this.CheckEditNewInput = function()
    {
        if (document.getElementById('input_tag_title').value == '')
        {
            alert('Please enter a title.');
            return false;
        }
        return true;
    };
    // ---------------------------------------------------------------------------------------------
    this.GetRow = function(id)
    {
        xml = '<row table="tag"' + (id == '' ? '' : ' id="' + id + '"') + '>'
            + '  <title>' + My.HtmlSpecialChars(document.getElementById('input_tag_title').value) + '</title>'
            + '  <text>' + My.HtmlSpecialChars(document.getElementById('input_tag_text').value) + '</text>'
            + '  <importance>' + document.getElementById('input_tag_importance').value + '</importance>'
            + '  <induced_category>' + My.HtmlSpecialChars(document.getElementById('input_tag_induced_category')).value + '</induced_category>'
            + '</row>';

        return xml;
    };
    // ---------------------------------------------------------------------------------------------
}