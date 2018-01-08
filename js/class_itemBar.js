﻿function ItemBar(variableName, divID, hasDate, minImportance, initialSortColumn, initialSortAscending, enterKeyFunc)
{
    var mXMLDoc = null;
    var mMinImportance = minImportance;
    var mFilterTexts = [];
    var mFirstItem = null;
    var mHasDate = hasDate;
    var mVariableName = variableName;
    var mInitialSortColumn = initialSortColumn;
    var mInitialSortAscending = initialSortAscending;
    var mEnterKeyFunc = enterKeyFunc;

    var mDivID = divID;
    var mDivTableId = mDivID + 'Table';

    var mDivTable;
    var mDivItems;
    var mDivFilterText;
    var mDivFilterImportance;
    var mDivFilterImportanceDisplay;
    // =============================================================================================
    // ================================= Private ===================================================
    // =============================================================================================
    // -------------------------------------------------------------------------------------------
    function BuildHTMLItems()
    {
        var code = ""
                +"     <table class='sortable' id='"+ mDivTableId + "' style='width: 100%;'>"
                +"     <tr>";
        if (mHasDate) {
            code += "       <th style='min-width: 60px; width: 60px; '>Date</th>";
        }
        code += "       <th>Item</th>";
        code += "     </tr>";
        code += BuildBoxList(mXMLDoc.firstChild.childNodes);        
        code += "</table>";
        return code;
    };
    // -------------------------------------------------------------------------------------------
    function BuildSmallBox(table, id, text, importance, category, width, maxHeight)
    {
        // Create boxes for a certain day
        return '<div class="smallBox '+ category + importance
            +'" style="width: '+ width +'; max-height: '+  maxHeight +'px;"'
            +'" onmouseup="View.OnMouseUpBox(event, \''+ table +'\', '+ id +')">'+ My.HtmlSpecialChars(text) +'</div>';
    };
    // -------------------------------------------------------------------------------------------
    function InitItemsTable()
    {        
        mDivTable = document.getElementById(mDivTableId);
        sorttable.makeSortable(mDivTable);
        if (mInitialSortColumn >= 0) {
            sorttable.sortByColumn(mDivTable, mInitialSortColumn, mInitialSortAscending);
        }
    };
    // ---------------------------------------------------------------------------------------------
    /**
     * @brief Redraws the whole item listbox.
     */
    function Redraw()
    {
        var onInput = mVariableName + '.RedrawItems()';
        var onKeyPress = mVariableName + '.OnKeyPress(event)';

        var divItemsId = mDivID + 'Items';
        var divFilterTextId = mDivID + 'FilterText';
        var divFilterImportanceId = mDivID + 'FilterImportance';
        var divFilterImportanceDisplayId = mDivID + 'FilterImportanceDisplay';

        var code = "<div>"
              + "<input id ='"+ divFilterTextId + "' type='search' oninput='"+ onInput +";' onkeypress='" + onKeyPress + ";' style='width:60%;'/>"
              + "<input id='"+ divFilterImportanceId + "' type='range' min='0' max='10' value='"+ mMinImportance +"' onchange='"+ onInput +";' style='width:20%;'/>"
              + "<span id='"+ divFilterImportanceDisplayId + "' style='width: 6%'>"+ mMinImportance +"</span>"
              + "</div>"
              + "<div id='" + divItemsId + "'>"
              + BuildHTMLItems()
              + "</div>";

        var divContent = document.getElementById(mDivID);
        divContent.innerHTML = code;

        mDivItems = document.getElementById(divItemsId);
        mDivFilterText = document.getElementById(divFilterTextId);
        mDivFilterImportance = document.getElementById(divFilterImportanceId);
        mDivFilterImportanceDisplay = document.getElementById(divFilterImportanceDisplayId);

        InitItemsTable();
    };
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
        for (var j = 0; j < nodes.length; j++) {
            var importance = parseInt(nodes[j].getAttribute("importance"));
            if (importance < mMinImportance) continue;
            
            var text = nodes[j].getAttribute("text");
            var containsFilter = true;
            for (i = 0; i < mFilterTexts.length; i++) {
                if (text.toLowerCase().indexOf(mFilterTexts[i].toLowerCase()) == -1) {
                    containsFilter = false;
                    break;
                };
            }
            if (!containsFilter) continue;

            code += "<tr>";
            if (mHasDate) {
                code +=  "  <td style='font-size: 75%; color: #404040;'>"
                        + nodes[j].getAttribute("date")
                        + "  </td>";
            }
            var table = nodes[j].getAttribute("table");
            var id = nodes[j].getAttribute("id");
            if (mFirstItem == null) {
                mFirstItem = [table, id];
            }
            var category = nodes[j].getAttribute("category");

            code += "  <td>";
            code += BuildSmallBox(table, id, text, importance, category, '170px', 16);
            code += "  </td>";
            code += "</tr>";
            
            if (nodes[j].hasChildNodes()) {
                code += BuildBoxList(nodes[j].childNodes);
            }            
        }
        return code;
    };
    // =============================================================================================
    // ================================= Privileged ================================================
    // =============================================================================================
    // -------------------------------------------------------------------------------------------
    this.SetVisible = function (visible)
    {
        var mainDiv = document.getElementById(mDivID);
        if (visible) {
            mainDiv.style.visibility = 'visible';
        }
        else {
            mainDiv.style.visibility = 'hidden';
        }
    };
    // -------------------------------------------------------------------------------------------
    this.SetXMLDoc = function (xmlDoc)
    {
        mXMLDoc = xmlDoc;
        Redraw();
    };
    // ---------------------------------------------------------------------------------------------
    /**
     * @brief Redraw the items of this item box (but not the filter).
     */
    this.RedrawItems = function ()
    {
        mFilterTexts = mDivFilterText.value.split(" ");
        mMinImportance = mDivFilterImportance.value;
        mDivFilterImportanceDisplay.innerHTML = mMinImportance;
        mDivItems.innerHTML = BuildHTMLItems();
        InitItemsTable();
    };
    // ---------------------------------------------------------------------------------------------
    /**
     * @brief Executed when a key is pressed in the filter text box.
     */
    this.OnKeyPress = function (event)
    {
        if (event.keyCode == 13 && mFirstItem != null) {
            mEnterKeyFunc(mFirstItem[0], mFirstItem[1]);
            mDivFilterText.value = '';
            this.RedrawItems();
        }
    };
}
