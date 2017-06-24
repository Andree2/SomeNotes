﻿function Slider()
{
    // =============================================================================================
    // ================================= Public ====================================================
    // =============================================================================================
    this.ShowValue = function (valueField, newValue)
    {
        valueField.innerHTML = newValue;
    };
    this.BuildHTML = function(displayFieldId, value)
    {
        var valueFieldId = displayFieldId + 'Value';
        return ""
        +"      <input id='"+ displayFieldId +"' type='range' min='0' max='10' value='"+ value +"' onchange='Slider.ShowValue("+ valueFieldId +", this.value);' style='width:80%;'/>"
        +"      <span id='"+ valueFieldId + "' style='width: 6%'>"+ value +"</span>";
    };
}