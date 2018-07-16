﻿class ItemBarLinkedItems extends ItemBarBase {
   
    constructor(variableName, divID, hasDate, minImportance, initialSortColumn, initialSortAscending, firstItemAction) {
        var mItemTable = null;
        var mItemId = null;
        
        super(variableName,
            divID,
            hasDate,
            minImportance,
            initialSortColumn,
            initialSortAscending,
            firstItemAction,
            function (table, id, text, divClass, width, maxHeight) {
                // Create boxes for a certain day
                return '  <td style="width: 75%">'
                + '<div class="smallBox ' + divClass + '"'
                + ' style="width: ' + width + '; max-height: ' + maxHeight + 'px;"'
                + ' onmouseup="View.OnMouseUpBox(event, \'' + table + '\', ' + id + ')">' + My.HtmlSpecialChars(text) + '</div>'
                + "  </td>"
                + "  <td>"
                + "    <a class='delete' onclick='return View.SubmitDeleteLink(\"" + mItemTable + "\", " + mItemId + ", \"" + table + "\", " + id + ")' href='#' style='width: 100%;'>x</a>"
                + "    </td>";
            });
        // =============================================================================================
        // ================================= Privileged ================================================
        // =============================================================================================
        // -------------------------------------------------------------------------------------------
        this.SetXMLDocWithItem = function (xmlDoc, itemTable, itemId) {
            mItemTable = itemTable;
            mItemId = itemId;
            this.SetXMLDoc(xmlDoc);
        }
    }
}
