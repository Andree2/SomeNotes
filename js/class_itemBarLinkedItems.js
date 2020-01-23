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
            var url = "php/read_links.php";
            url = url + "?table=" + table;
            url = url + "&id=" + id;
            url = url + "&sid=" + Math.random();
            xmlHttp.onreadystatechange = function()
            {
                if (xmlHttp.readyState == 4)
                {
                    ItemBarLinks.SetXMLDocWithItem(xmlHttp.responseXML, table, id);
                    onReadyStateChange(xmlHttp.responseXML);
                }
            };
            xmlHttp.open("GET", url, true);
            xmlHttp.send(null);
        };
    }
}
