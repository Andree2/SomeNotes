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
                    + ' onmouseup="View.OnMouseUpBox(event, \'' + table + '\', ' + id + ')">' + My.HtmlSpecialChars(text) + '</div>'
                    + "  </td>"
                    + "  <td class='itemBarDeleteLink'></td>";
            });

        // =============================================================================================
        // ================================= Privileged ================================================
        // =============================================================================================
        this.UpdateItems = function()
        {
            var xmlHttp = My.GetXMLHttpObject();
            if (xmlHttp == null)
                return;
            var url = "php/read_items.php";
            url = url + "?sid=" + Math.random();
            xmlHttp.onreadystatechange = function()
            {
                if (xmlHttp.readyState == 4)
                {
                    ItemBarAll.SetXMLDoc(xmlHttp.responseXML);
                }
            };

            xmlHttp.open("GET", url, true);
            xmlHttp.send(null);
        }
    }
}
