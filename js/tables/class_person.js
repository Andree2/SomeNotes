﻿﻿function Person()
{
	// =============================================================================================
	// ================================= Private ===================================================
	// =============================================================================================
	function BuildEditTable(displayName, firstName, middleName, lastName, birthdayDay, birthdayMonth, birthdayYear, text, importance, category)
	{
		return ""
    +"  <tr>"
    +"    <td>Display name</td>"
    +"    <td colspan='2'>"
    +"      <input id='input_person_display_name' name='input_person_display_name' value='" + My.HtmlSpecialChars(displayName) + "' maxLength='255' size='32'/>"
    +"    </td>"
    +"  </tr>"
    +"  <tr>"
    +"    <td>Name (first-middle-last)</td>"
    +"    <td colspan='3'>"
    +"      <input id='input_person_first_name' name='input_person_first_name' value='" + My.HtmlSpecialChars(firstName) + "' maxLength='255' size='22'/>"
    +"      <input id='input_person_middle_name' name='input_person_middle_name' value='" + My.HtmlSpecialChars(middleName) + "' maxLength='255' size='22'/>"
    +"      <input id='input_person_last_name' name='input_person_last_name' value='" + My.HtmlSpecialChars(lastName) + "' maxLength='255' size='22'/>"
    +"    </td>"
    +"  </tr>"
    +"  <tr>"
    +"    <td>Birthday</td>"
    +"    <td colspan='3'>"
    +"      <input id='input_person_birthday_day'   name='input_person_birthday_day'    type='text' value='" + birthdayDay + "' maxLength='2' size='1'/>"
    +"      <input id='input_person_birthday_month' name='input_person_birthday_month'  type='text' value='" + birthdayMonth + "' maxLength='2' size='1'/>"
    +"      <input id='input_person_birthday_year'  name='input_person_birthday_year'   type='text' value='" + birthdayYear + "' maxLength='4' size='2'/>"
    +"    </td>"
    +"  </tr>"
    +"    <td>Text</td>"
    +"    <td colspan='3'>"
    +"      <textarea id='input_person_text' name='input_person_text' type='text' cols='80' rows='20'>"+ My.HtmlSpecialChars(text) +"</textarea>"
    +"    </td>"
    +"  </tr>"
    +"  <tr>"
    +"    <td>Importance</td>"
    +"    <td colspan='2'>"
    +        Slider.BuildHTML('input_person_importance', importance)
    +"    </td>"
    +"    <td>"
    +"      <select id='input_person_category' name='input_person_category' size='1'>"
	+"        <option value='300' " + (category == 300 ? "selected='selected'" : "") + ">Friend</option>"
	+"        <option value='301' " + (category == 301 ? "selected='selected'" : "") + ">Acquaintance</option>"
	+"      </select>"
    +"    </td>"
    +"  </tr>";
	};
	
	// =============================================================================================
	// ================================= Privileged ================================================
	// =============================================================================================	
	// ---------------------------------------------------------------------------------------------	
	this.BuildEditFromXML = function(xmlDoc)
	{
		code = BuildEditTable(xmlDoc.getElementsByTagName("display_name")[0].childNodes[0].nodeValue,
							My.NodeValuesToString(xmlDoc.getElementsByTagName("first_name")[0].childNodes),
							My.NodeValuesToString(xmlDoc.getElementsByTagName("middle_name")[0].childNodes),
							My.NodeValuesToString(xmlDoc.getElementsByTagName("last_name")[0].childNodes),
							My.NodeValuesToString(xmlDoc.getElementsByTagName("birthday_day")[0].childNodes),
							My.NodeValuesToString(xmlDoc.getElementsByTagName("birthday_month")[0].childNodes),
							My.NodeValuesToString(xmlDoc.getElementsByTagName("birthday_year")[0].childNodes),
							My.NodeValuesToString(xmlDoc.getElementsByTagName("text")[0].childNodes),
							xmlDoc.getElementsByTagName("importance")[0].childNodes[0].nodeValue,
							xmlDoc.getElementsByTagName("category")[0].childNodes[0].nodeValue);
		return code;
	};
	// ---------------------------------------------------------------------------------------------	
	this.BuildNew = function(date, time)
	{
		return BuildEditTable("", "","","","","","","",1,300);
	};
	// ---------------------------------------------------------------------------------------------
	this.CheckEditNewInput = function(form)
	{
		if(document.getElementById('input_person_display_name').value == '') {
			alert('Please enter a display name.');
			return false;
		}
		return true;
	};
	// ---------------------------------------------------------------------------------------------
	this.GetRow = function(id)
	{
		xml = '<row table="person"' + (id == '' ? '' : ' id="'+ id +'"') + '>';
		xml +=  '  <display_name>'+   My.HtmlSpecialChars(document.getElementById('input_person_display_name').value) +'</display_name>'
		       +'  <first_name>'+     My.HtmlSpecialChars(document.getElementById('input_person_first_name').value) +'</first_name>'
		       +'  <middle_name>'+    My.HtmlSpecialChars(document.getElementById('input_person_middle_name').value) +'</middle_name>'
		       +'  <last_name>'+      My.HtmlSpecialChars(document.getElementById('input_person_last_name').value) +'</last_name>'
		       +'  <birthday_day>'+   document.getElementById('input_person_birthday_day').value +'</birthday_day>'
		       +'  <birthday_month>'+ document.getElementById('input_person_birthday_month').value +'</birthday_month>'
		       +'  <birthday_year>'+  document.getElementById('input_person_birthday_year').value +'</birthday_year>'
		       +'  <text>'+           My.HtmlSpecialChars(document.getElementById('input_person_text').value) +'</text>'
		       +'  <importance>'+     document.getElementById('input_person_importance').value +'</importance>'
		       +'  <category>'+       document.getElementById('input_person_category').value +'</category>'
		       +'</row>';
		
		return xml;
	};
	// ---------------------------------------------------------------------------------------------
	// ---------------------------------------------------------------------------------------------
}