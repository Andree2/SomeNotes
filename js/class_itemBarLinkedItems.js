﻿class ItemBarLinkedItems extends ItemBarBase
{
    constructor(variableName, divID, minImportance, initialSortColumn, initialSortAscending, firstItemAction)
    {
        var mItemTable = null;
        var mItemId = null;

        super(variableName,
            divID,
            minImportance,
            initialSortColumn,
            initialSortAscending,
            firstItemAction,
            function(table, id, text, divClass, width, height)
            {
                // Create boxes for a certain day
                return '  <td>'
                    + '<div class="smallBox itemBarItem ' + divClass + '"'
                    + ' onmouseup="View.OnMouseUpBox(event, \'' + table + '\', ' + id + ', \'' + divClass + '\')">' + My.HtmlSpecialChars(text) + '</div>'
                    + "  </td>"
                    + "  <td>"
                    + "    <a class='delete' onclick='return View.SubmitDeleteLink(\"" + mItemTable + "\", " + mItemId + ", \"" + table + "\", " + id + ")' href='#' style='width: 100%;'>x</a>"
                    + "  </td>";
            });
        // =============================================================================================
        // ================================= Privileged ================================================
        // =============================================================================================
        this.SetXMLDocWithItem = function(xmlDoc, itemTable, itemId)
        {
            mItemTable = itemTable;
            mItemId = itemId;
            this.SetXMLDoc(xmlDoc);
        }

        this.LoadLinks = function(table, id, onReadyStateChange)
        {
            var xmlHttp = My.GetXMLHttpObject();
            if (xmlHttp == null)
                return;

            var filterText = this.DivFilterText.value;
            var xml = '<?xml version="1.0" encoding="utf-8"?>\n<row table="' + table + '" id="' + id + '" filtertext="' + filterText + '"/>';

            My.SendPOSTRequest(xmlHttp, "./php/read_links.php", xml, function()
            {
                if (xmlHttp.readyState == 4)
                {
                    ItemBarLinks.SetXMLDocWithItem(xmlHttp.responseXML, table, id);
                    onReadyStateChange(xmlHttp.responseXML);
                }
            });
        };

        this.OnInput = function()
        {
            this.LoadLinks(mItemTable, mItemId, function(_) { });
        }
    }
}
