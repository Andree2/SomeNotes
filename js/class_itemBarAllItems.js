﻿class ItemBarAllItems extends ItemBarBase
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
                    + ' onmouseup="View.OnMouseUpBox(event, \'' + table + '\', ' + id + ', \'' + divClass + '\')">' + My.HtmlSpecialChars(text) + '</div>'
                    + "  </td>"
                    + "  <td class='itemBarDeleteLink'></td>";
            });

        // =============================================================================================
        // ================================= Privileged ================================================
        // =============================================================================================
        this.OnInput = function()
        {
            var xmlHttp = My.GetXMLHttpObject();
            if (xmlHttp == null)
                return;

            var filterText = this.DivFilterText.value;
            // Only start request when there is a filter text to speed up search.
            if (filterText.length < 1) return;

            var xml = '<?xml version="1.0" encoding="utf-8"?>\n<row filtertext="' + filterText + '"/>';

            My.SendPOSTRequest(xmlHttp, "./php/read_items.php", xml, function()
            {
                if (xmlHttp.readyState == 4)
                {
                    ItemBarAll.SetXMLDoc(xmlHttp.responseXML);
                }
            });
        }
    }
}
