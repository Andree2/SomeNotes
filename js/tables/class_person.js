﻿function Person()
{
    // =============================================================================================
    // ================================= Private ===================================================
    // =============================================================================================
    function BuildEditTable(displayName, firstName, middleName, lastName, birthdayDay, birthdayMonth, birthdayYear, sex, text, importance, category)
    {
        var output = ""
            + "  <tr>"
            + "    <td class='noWrap'>Display Name</td>"
            + "    <td colspan='3' class='fillTable'>"
            + "      <input id='input_person_display_name' name='input_person_display_name' value='" + My.HtmlSpecialChars(displayName) + "' maxLength='255' class='fillCell'/>"
            + "    </td>"
            + "  </tr>"
            + "  <tr>"
            + "    <td class='noWrap'>Name (1st-mid-last)</td>"
            + "    <td colspan='3'>"
            + "      <input id='input_person_first_name' name='input_person_first_name' value='" + My.HtmlSpecialChars(firstName) + "' maxLength='255' />"
            + "      <input id='input_person_middle_name' name='input_person_middle_name' value='" + My.HtmlSpecialChars(middleName) + "' maxLength='255' />"
            + "      <input id='input_person_last_name' name='input_person_last_name' value='" + My.HtmlSpecialChars(lastName) + "' maxLength='255' />"
            + "    </td>"
            + "  </tr>"
            + "  <tr>"
            + "    <td>Birthday</td>"
            + "    <td>"
            + "      <input id='input_person_birthday_day'   name='input_person_birthday_day'    type='text' value='" + birthdayDay + "' maxLength='2' size='1'/>"
            + "      <input id='input_person_birthday_month' name='input_person_birthday_month'  type='text' value='" + birthdayMonth + "' maxLength='2' size='1'/>"
            + "      <input id='input_person_birthday_year'  name='input_person_birthday_year'   type='text' value='" + birthdayYear + "' maxLength='4' size='2'/>"
            + "    </td>"
            + "    <td class='noWrap'>Sex</td>"
            + "    <td>"
            + "      <select id='input_person_sex' name='input_person_sex' size='1'>";
        var sexes = My.GetPersonSexesDisplayText();
        for (key in sexes)
        {
            output += "        <option value='" + key + "' " + (sex == key ? "selected='selected'" : "") + ">" + sexes[key] + "</option>"
        };
        return output
            + "      </select>"
            + "    </td>"
            + "  </tr>"
            + "    <td>Text</td>"
            + "    <td colspan='3'>"
            + "      <textarea id='input_person_text' name='input_person_text' type='text' rows='30' class='fillCell'>" + My.HtmlSpecialChars(text) + "</textarea>"
            + "    </td>"
            + "  </tr>"
            + "  <tr>"
            + "    <td>Importance</td>"
            + "    <td colspan='3'>"
            + "      <input id='input_person_importance' type='number' min='0' max='10' value='" + importance + "'/>"
            + "      <span style='border:1px solid #888888; padding:2px;'>" + category + "</span>"
            + "    </td>"
            + "  </tr>";
    };

    // =============================================================================================
    // ================================= Privileged ================================================
    // =============================================================================================	
    // ---------------------------------------------------------------------------------------------	
    this.BuildEditFromXML = function(item)
    {
        return BuildEditTable(My.FirstChildNodeValuesToString(item.getElementsByTagName("display_name")),
            My.FirstChildNodeValuesToString(item.getElementsByTagName("first_name")),
            My.FirstChildNodeValuesToString(item.getElementsByTagName("middle_name")),
            My.FirstChildNodeValuesToString(item.getElementsByTagName("last_name")),
            item.getAttribute("birthday_day"),
            item.getAttribute("birthday_month"),
            item.getAttribute("birthday_year"),
            My.FirstChildNodeValuesToString(item.getElementsByTagName("sex")),
            My.FirstChildNodeValuesToString(item.getElementsByTagName("text")),
            item.getAttribute("importance"),
            My.FirstChildNodeValuesToString(item.getElementsByTagName("category")));
    };
    // ---------------------------------------------------------------------------------------------	
    this.BuildNew = function(date, time)
    {
        return BuildEditTable("", "", "", "", "", "", "", "", "", 1, "");
    };
    // ---------------------------------------------------------------------------------------------
    this.CheckEditNewInput = function(form)
    {
        if (document.getElementById('input_person_display_name').value == '')
        {
            alert('Please enter a display name.');
            return false;
        }
        return true;
    };
    // ---------------------------------------------------------------------------------------------
    this.GetPOSTRequestRow = function(id)
    {
        xml = '<row table="person"' + (id == '' ? '' : ' id="' + id + '"') + '>'
            + '  <display_name>' + My.HtmlSpecialChars(document.getElementById('input_person_display_name').value) + '</display_name>'
            + '  <first_name>' + My.HtmlSpecialChars(document.getElementById('input_person_first_name').value) + '</first_name>'
            + '  <middle_name>' + My.HtmlSpecialChars(document.getElementById('input_person_middle_name').value) + '</middle_name>'
            + '  <last_name>' + My.HtmlSpecialChars(document.getElementById('input_person_last_name').value) + '</last_name>'
            + '  <birthday_day>' + document.getElementById('input_person_birthday_day').value + '</birthday_day>'
            + '  <birthday_month>' + document.getElementById('input_person_birthday_month').value + '</birthday_month>'
            + '  <birthday_year>' + document.getElementById('input_person_birthday_year').value + '</birthday_year>'
            + '  <sex>' + document.getElementById('input_person_sex').value + '</sex>'
            + '  <text>' + My.HtmlSpecialChars(document.getElementById('input_person_text').value) + '</text>'
            + '  <importance>' + document.getElementById('input_person_importance').value + '</importance>'
            + '</row>';

        return xml;
    };
    // ---------------------------------------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------
}