﻿class ItemBarLinkedItems extends ItemBarBase
{
    constructor(variableName, divID, initialSortColumn, initialSortAscending, firstItemAction)
    {
        var mItemTable = null;
        var mItemId = null;

        super(variableName,
            divID,
            initialSortColumn,
            initialSortAscending,
            firstItemAction,
            function(table, id, text, divClass, linkId, linkInfoNodes)
            {
                // Create box for an item
                var code = "  <td class='itemBarItem'>"
                    + '     <div class="smallBox itemBarItem ' + divClass + '" onmouseup="View.OnMouseUpBox(event, \'' + table + '\', ' + id + ', \'' + divClass + '\')">' + My.HtmlSpecialChars(text) + '</div>';

                if (linkInfoNodes.length > 0)
                {
                    var linkInfoTypes = My.GetLinkInfoTypesDisplayText();
                    for (var j = 0; j < linkInfoNodes.length; j++)
                    {
                        var linkInfoNode = linkInfoNodes[j];

                        if (linkInfoNode.nodeName != "linkInfo") continue;

                        var linkInfoId = linkInfoNode.getAttribute("id");
                        var linkInfoText = linkInfoNode.getAttribute("text");
                        var linkInfoType = linkInfoNode.getAttribute("type");
                        code += "     <div class='linkInfo'>";
                        code += "<div class='" + divClass + "'>" + My.HtmlSpecialChars(linkInfoTypes[linkInfoType]) + "</div>"
                        code += "<div class='" + divClass + "'>" + My.HtmlSpecialChars(linkInfoText) + "</div>"
                            + "<a class='linkAction' onclick='return View.SubmitDeleteLinkInfo(" + linkInfoId + ")' href='#'>x</a>"
                            + "</div>";
                    }
                }

                return code
                    + "  </td>"
                    + "  <td class='itemBarLinkAction'>"
                    + "    <a class='linkAction' onclick='return View.ShowAddLinkInfo(" + linkId + ")' href='#'>+</a>"
                    + "    <a class='linkAction' onclick='return View.SubmitDeleteLink(" + linkId + ")' href='#'>x</a>"
                    + "  </td>";
            },
            "<div id='editLinkInfo'></div>");
        // =============================================================================================
        // ================================= Privileged ================================================
        // =============================================================================================
        this.SetXMLDocWithItem = function(xmlDoc, itemTable, itemId)
        {
            mItemTable = itemTable;
            mItemId = itemId;
            this.SetXMLDoc(xmlDoc);
        }
        // -------------------------------------------------------------------------------------------
        this.LoadLinks = function(table, id, onReadyStateChange)
        {
            var xmlHttp = My.GetXMLHttpObject();
            if (xmlHttp == null)
                return;

            var filterText = this.DivFilterText.value;
            var minImportance = $('#minimumImportance')[0].valueAsNumber;
            var showNotes = $('#showNotes')[0].checked;
            var xml = '<?xml version="1.0" encoding="utf-8"?>\n<row table="' + table + '" id="' + id + '" filtertext="' + filterText + '" minImportance="' + minImportance + '" showNotes="' + showNotes + '"/>';

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
            if (this.IsVisible)
            {
                this.LoadLinks(mItemTable, mItemId, function(_) { });
            }
        }
    }
}
