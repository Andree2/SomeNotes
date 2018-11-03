﻿class ItemBarBase
{

    constructor(variableName, divID, hasDate, minImportance, initialSortColumn, initialSortAscending, firstItemAction, buildRow)
    {

        var mXMLDoc = null;
        var mMinImportance = minImportance;
        var mFilterTexts = [];
        var mFirstItem = null;
        var mHasDate = hasDate;
        var mVariableName = variableName;
        var mInitialSortColumn = initialSortColumn;
        var mInitialSortAscending = initialSortAscending;
        var mFirstItemAction = firstItemAction;
        var mDivID = divID;
        var mDivTableId = mDivID + 'Table';
        var mDivTable;
        var mDivItems;
        var mDivFilterText;
        var mDivFilterImportance;
        // =============================================================================================
        // ================================= Private ===================================================
        // =============================================================================================
        // -------------------------------------------------------------------------------------------
        function BuildHTMLItems()
        {
            var code = ""
                + "     <table class='sortable' id='" + mDivTableId + "' style='width: 100%;'>"
                + "     <tr>";
            if (mHasDate)
            {
                code += "       <th class='itemBarDateHeader'>Date</th>";
            }
            code += "       <th class='itemBarItemHeader'>Item</th>";
            code += "       <th class='itemBarDeleteLinkHeader'></th>";
            code += "     </tr>";
            code += BuildBoxList(mXMLDoc.firstChild.childNodes);
            code += "</table>";
            return code;
        }
        ;
        // -------------------------------------------------------------------------------------------
        function InitItemsTable()
        {
            mDivTable = document.getElementById(mDivTableId);
            sorttable.makeSortable(mDivTable);
            if (mInitialSortColumn >= 0)
            {
                sorttable.sortByColumn(mDivTable, mInitialSortColumn, mInitialSortAscending);
            }
        }
        ;
        // ---------------------------------------------------------------------------------------------
        /**
         * @brief Redraws the whole item listbox.
         */
        function Redraw()
        {
            var onInput = mVariableName + '.RedrawItems()';
            var onKeyPress = mVariableName + '.OnKeyPress(event)';
            var executeFirstItemAction = mVariableName + '.ExecuteFirstItemAction()';
            var divItemsId = mDivID + 'Items';
            var divFilterTextId = mDivID + 'FilterText';
            var divFilterImportanceId = mDivID + 'FilterImportance';
            var code = "<div>"
                + "  <input id ='" + divFilterTextId + "' type='search' oninput='" + onInput + ";' onkeypress='" + onKeyPress + ";' style='width:55%;'/>"
                + "  <span><a class='button' onclick='" + executeFirstItemAction + "' href='#' style='width:20%;'>Go</a></span>"
                + "  <input id='" + divFilterImportanceId + "' type='number' min='0' max='10' value='" + mMinImportance + "' onchange='" + onInput + ";' style='width: 15%;'/>"
                + "</div>"
                + "<div id='" + divItemsId + "' class='itemBarItems'>"
                + BuildHTMLItems()
                + "</div>";
            var divContent = document.getElementById(mDivID);
            divContent.innerHTML = code;
            mDivItems = document.getElementById(divItemsId);
            mDivFilterText = document.getElementById(divFilterTextId);
            mDivFilterImportance = document.getElementById(divFilterImportanceId);
            InitItemsTable();
        }
        ;
        // -------------------------------------------------------------------------------------------
        /**
         * @brief Prints a hierarchically list of item boxes.
         *
         * @param nodes         The hierarchically structured input data.
         * @param minImportance Only items with importance greater or equal to \p minImportance will be drawn.
         */
        function BuildBoxList(nodes)
        {
            mFirstItem = null;
            var code = '';
            for (var j = 0; j < nodes.length; j++)
            {
                var importance = parseInt(nodes[j].getAttribute("importance"));
                if (importance < mMinImportance)
                    continue;
                var text = nodes[j].getAttribute("text");
                var containsFilter = true;
                for (var i = 0; i < mFilterTexts.length; i++)
                {
                    if (text.toLowerCase().indexOf(mFilterTexts[i].toLowerCase()) == -1)
                    {
                        containsFilter = false;
                        break;
                    }
                    ;
                }
                if (!containsFilter)
                    continue;
                code += "<tr>";
                if (mHasDate)
                {
                    code += "  <td style='font-size: 75%; color: #404040;'>"
                        + nodes[j].getAttribute("date")
                        + "  </td>";
                }
                var table = nodes[j].getAttribute("table");
                var id = nodes[j].getAttribute("id");
                if (mFirstItem == null)
                {
                    mFirstItem = [table, id];
                }
                var category = nodes[j].getAttribute("category");
                code += buildRow(table, id, text, category + importance);
                code += "</tr>";
                if (nodes[j].hasChildNodes())
                {
                    code += BuildBoxList(nodes[j].childNodes);
                }
            }
            return code;
        }
        ;
        // =============================================================================================
        // ================================= Privileged ================================================
        // =============================================================================================
        // -------------------------------------------------------------------------------------------
        this.SetVisible = function(visible)
        {
            var mainDiv = document.getElementById(mDivID);
            if (visible)
            {
                mainDiv.style.visibility = 'visible';
            }
            else
            {
                mainDiv.style.visibility = 'hidden';
            }
        };
        // -------------------------------------------------------------------------------------------
        this.SetXMLDoc = function(xmlDoc)
        {
            mXMLDoc = xmlDoc;
            Redraw();
        };
        // ---------------------------------------------------------------------------------------------
        /**
         * @brief Redraw the items of this item box (but not the filter).
         */
        this.RedrawItems = function()
        {
            mFilterTexts = mDivFilterText.value.split(" ");
            mMinImportance = mDivFilterImportance.value;
            mDivItems.innerHTML = BuildHTMLItems();
            InitItemsTable();
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
            mDivFilterText.value = '';
            this.RedrawItems();
        };
    }
}
