﻿function Slider()
{
	// =============================================================================================
	// ================================= Public ====================================================
	// =============================================================================================
	this.ShowValue = function (valueField, newValue)
	{
		valueField.innerHTML = newValue;
	};
	this.BuildHTML = function(displayFieldName, value, additionalFunc)
	{
		var valueFieldName = displayFieldName + 'Value';
		if (additionalFunc != undefined) {
			additionalFunc = '; ' + additionalFunc + ';';
		}
		else {
			additionalFunc = '';
		}
		return ""
		+"      <input id='"+ displayFieldName +"' name='"+ displayFieldName +"' type='range' min='0' max='10' value='"+ value +"' onchange='Slider.ShowValue("+ valueFieldName +", this.value);"+ additionalFunc +"' style='width:80%;'/>"
		+"      <span id='"+ valueFieldName + "' style='width: 6%'>"+ value +"</span>";
	};
}