﻿class ItemBarAllItems extends ItemBarBase
{
    constructor(variableName, divID, initialSortColumn, initialSortAscending, firstItemAction)
    {
        super(variableName,
            divID,
            initialSortColumn,
            initialSortAscending,
            firstItemAction,
            function(table, id, text, divClass, linkId, linkInfoNodes)
            {
                // Create boxes for a certain item
                return "  <td class='itemBarItem'>"
                    + '<div class="smallBox itemBarItem ' + divClass + '"'
                    + ' onmouseup="View.OnMouseUpBox(event, \'' + table + '\', ' + id + ', \'' + divClass + '\')">' + My.HtmlSpecialChars(text) + '</div>'
                    + "  </td>"
                    + "  <td class='itemBarLinkAction'></td>";
            },
            "");

        // =============================================================================================
        // ================================= Privileged ================================================
        // =============================================================================================
        this.OnInput = function()
        {
            var xmlHttp = My.GetXMLHttpObject();
            if (xmlHttp == null)
                return;

            var filterText = this.DivFilterText.value;
            // Only start request when there is a filter text.
            if (filterText.length < 1) 
            {
                var parser = new DOMParser();
                var xmlDoc = parser.parseFromString('<row/>', "text/xml");
                ItemBarAll.SetXMLDoc(xmlDoc);
            }
            else
            {
                var minImportance = $('#minimumImportance')[0].valueAsNumber;
                var showNotes = $('#showNotes')[0].checked;
                var xml = '<?xml version="1.0" encoding="utf-8"?>\n<row filtertext="' + filterText + '" minImportance="' + minImportance + '" showNotes="' + showNotes + '"/>';

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
}
