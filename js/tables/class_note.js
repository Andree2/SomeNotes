﻿﻿function Note()
{
	// =============================================================================================
	// ================================= Private ===================================================
	// =============================================================================================
	function BuildEditTable(title, text, date, time, importance, category)
	{
		return ""
		+"  <tr>"
		+"    <td>Title</td>"
		+"    <td colspan='5'><input id='input_note_title' name='input_note_title' type='text' maxLength='255' value='"+ My.HtmlSpecialChars(title) +"' size='83'/></td>"
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
		+"      <select id='input_note_category' name='input_note_category' size='1'>"
		+"        <option value='200' " + (category == 200 ? "selected='selected'" : "") + ">Note</option>"
		+"        <option value='201' " + (category == 201 ? "selected='selected'" : "") + ">Diary</option>"
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
		code = BuildEditTable(xmlDoc.getElementsByTagName("title")[0].childNodes[0].nodeValue,
							My.NodeValuesToString(xmlDoc.getElementsByTagName("text")[0].childNodes),
							xmlDoc.getElementsByTagName("date")[0].childNodes[0].nodeValue,
							xmlDoc.getElementsByTagName("time")[0].childNodes[0].nodeValue,
							xmlDoc.getElementsByTagName("importance")[0].childNodes[0].nodeValue,
							xmlDoc.getElementsByTagName("category")[0].childNodes[0].nodeValue);
		return code;
	};
	// ---------------------------------------------------------------------------------------------	
	this.BuildNew = function(date, time)
	{
		return BuildEditTable("", "", date, time, 1, 200);
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
		xml = '<row table="note"' + (id == '' ? '' : ' id="'+ id +'"') + '>';
		
		datetimeParts = document.getElementById('input_note_datetime').value.split("T");
		xml +=  '  <title>'+      My.HtmlSpecialChars(document.getElementById('input_note_title').value) +'</title>'
		       +'  <text>'+       My.HtmlSpecialChars(document.getElementById('input_note_text').value) +'</text>'
		       +'  <date>'+       datetimeParts[0] +'</date>'
		       +'  <time>'+       datetimeParts[1] +'</time>'
		       +'  <importance>'+ document.getElementById('input_note_importance').value +'</importance>'
		       +'  <category>'+   document.getElementById('input_note_category').value +'</category>'
		       +'</row>';
		
		return xml;
	};
	// ---------------------------------------------------------------------------------------------
}