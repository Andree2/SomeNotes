﻿class ItemBar extends ItemBarBase {
   
    constructor(variableName, divID, hasDate, minImportance, initialSortColumn, initialSortAscending, firstItemAction) {
     
        super(variableName,
            divID,
            hasDate,
            minImportance,
            initialSortColumn,
            initialSortAscending,
            firstItemAction,
            function (table, id, text, divClass, width, height) {
                // Create boxes for a certain day
                return '  <td style="width: 75%">'
                    + '<div class="smallBox ' + divClass + '"'
                    + ' style="width: ' + width + '; height: ' + height + 'px;"'
                    + ' onmouseup="View.OnMouseUpBox(event, \'' + table + '\', ' + id + ')">' + My.HtmlSpecialChars(text) + '</div>'
                    + "  </td>"
                    + "  <td></td>";
            });        
    }
}
