class ItemBarBase
{
    constructor(variableName, divID, initialSortColumn, initialSortAscending, firstItemAction, buildRow, topContent)
    {
        var mXMLDoc = null;
        var mFirstItem = null;
        var mVariableName = variableName;
        var mInitialSortColumn = initialSortColumn;
        var mInitialSortAscending = initialSortAscending;
        var mFirstItemAction = firstItemAction;
        var mDivID = divID;
        var mDivTableId = mDivID + 'Table';
        var mDivTable;
        var mDivItems;
        // =============================================================================================
        // ================================= Private ===================================================
        // =============================================================================================
        // -------------------------------------------------------------------------------------------
        function BuildHTMLItems()
        {
            var code = topContent
                + "     <table class='sortable' id='" + mDivTableId + "' style='width: 100%;'>"
                + "     <tr>";
            code += "       <th class='itemBarDate'>Date</th>";
            code += "       <th class='itemBarItem'>Item</th>";
            code += "       <th class='itemBarLinkAction'></th>";
            code += "     </tr>";
            code += BuildBoxList(mXMLDoc.firstChild.childNodes);
            code += "</table>";
            return code;
        };
        // -------------------------------------------------------------------------------------------
        /**
         * @brief Prints a list of item boxes from an <item> list, with potential <linkInfo> children.
         */
        function BuildBoxList(nodes)
        {
            mFirstItem = null;
            var code = '';
            for (var j = 0; j < nodes.length; j++)
            {
                var node = nodes[j];

                if (node.nodeName != "item") continue;

                var importance = parseInt(node.getAttribute("importance"));
                var text = node.getAttribute("text");
                code += "<tr>";
                code += "  <td class='itemBarDate'>"
                    + node.getAttribute("date")
                    + "  </td>";
                var table = node.getAttribute("table");
                var id = node.getAttribute("id");
                var linkId = node.getAttribute("linkId");
                if (mFirstItem == null)
                {
                    mFirstItem = [table, id];
                }
                var category = node.getAttribute("category");
                code += buildRow(table, id, text, category + importance, linkId, node.childNodes);
                code += "</tr>";
            }

            return code;

        };
        // =============================================================================================
        // ================================= Privileged ================================================
        // =============================================================================================
        // ---------------------------------------------------------------------------------------------
        /**
         * @brief Initializes the whole item listbox.
         */
        this.Initialize = function()
        {
            var onInput = mVariableName + '.OnInput()';
            var onKeyPress = mVariableName + '.OnKeyPress(event)';
            var executeFirstItemAction = mVariableName + '.ExecuteFirstItemAction()';
            var divItemsId = mDivID + 'Items';
            var divFilterTextId = mDivID + 'FilterText';
            var divButtonId = mDivID + 'Button';
            var code = "<div>"
                + "  <input id='" + divFilterTextId + "' type='search' oninput='" + onInput + ";' onkeypress='" + onKeyPress + ";' style='width:60%;'/>"
                + "  <span><a class='button' id='" + divButtonId + "' onclick='" + executeFirstItemAction + "' href='#' style='width:30%;'>Go</a></span>"
                + "</div>"
                + "<div id='" + divItemsId + "' class='itemBar'>"
                + "</div>";
            var divContent = document.getElementById(mDivID);
            divContent.innerHTML = code;
            mDivItems = document.getElementById(divItemsId);
            this.DivFilterText = document.getElementById(divFilterTextId);
            this.IsVisible = false;
        };
        // -------------------------------------------------------------------------------------------
        this.SetVisible = function(visible)
        {
            if (!visible)
            {
                this.DivFilterText.value = '';
            }
            this.IsVisible = visible;
        };
        // -------------------------------------------------------------------------------------------
        this.SetXMLDoc = function(xmlDoc)
        {
            mXMLDoc = xmlDoc;
            mDivItems.innerHTML = BuildHTMLItems();
            mDivTable = document.getElementById(mDivTableId);
            sorttable.makeSortable(mDivTable);
            if (mInitialSortColumn >= 0)
            {
                sorttable.sortByColumn(mDivTable, mInitialSortColumn, mInitialSortAscending);
            }
        };
        // ---------------------------------------------------------------------------------------------
        /**
         * @brief Executed when a key is pressed in the filter text box.
         */
        this.OnKeyPress = function(event)
        {
            // When 'Enter' is pressed, call the 'EnterKeyFunc'.
            if (event.keyCode == 13)
            {
                this.ExecuteFirstItemAction();
            }
        };
        // ---------------------------------------------------------------------------------------------
        /**
         * @brief Executes the given first item action for the first element in the box.
         */
        this.ExecuteFirstItemAction = function()
        {
            if (mFirstItem == null)
                return;
            mFirstItemAction(mFirstItem[0], mFirstItem[1]);
            this.DivFilterText.value = '';
            this.OnInput();
        };
    }
}
