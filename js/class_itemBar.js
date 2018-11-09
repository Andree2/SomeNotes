﻿class ItemBar extends ItemBarBase
{
    constructor(variableName, divID, minImportance, initialSortColumn, initialSortAscending, firstItemAction)
    {
        super(variableName,
            divID,
            minImportance,
            initialSortColumn,
            initialSortAscending,
            firstItemAction,
            function(table, id, text, divClass, width, height)
            {
                // Create boxes for a certain day
                return "  <td class='itemBarItem'>"
                    + '<div class="smallBox itemBarItem ' + divClass + '"'
                    + ' onmouseup="View.OnMouseUpBox(event, \'' + table + '\', ' + id + ')">' + My.HtmlSpecialChars(text) + '</div>'
                    + "  </td>"
                    + "  <td class='itemBarDeleteLink'></td>";
            });
    }
}
