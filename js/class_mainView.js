﻿function MainView()
{
    // public
    this.mDivEditTable = null;
    this.mDivEditItemID = 0;
    
    // private    
    var mActiveCell = '';
    var mActiveCellBackground;
    var mDateStart;
    var mDateEnd;
    var mOneDay = 24 * 60 * 60 * 1000;
    var mNumRows = 7;
    var mSelectedDate;
    var mBoxHeight = 16;
    var mDivEditVisible = false;
    
    var mThis = this; // For acces to 'this' in private function ('this' is not set correctly there).
    
    this.mXMLDocView = null;
    
    
        
    //TODO: xml output: Viele items auf attributes umstellen
    
    // =============================================================================================
    // ================================= Private ===================================================
    // =============================================================================================

    function BuildNew(table, date, time)
    {
        var dateTimeArgs = "\"" + date + "\",\"" + time + "\"";
        var switchNewCode = '';
        
        switchNewCode = ""
                      + "     <td class='note'>"
                      + "       <a class='nav' onclick='return View.SwitchNew(\"note\", " + dateTimeArgs + ")' href='#'>Note</a>"
                      + "     </td>"
                      + "     <td class='event'>"
                      + "       <a class='nav' onclick='return View.SwitchNew(\"event\", " + dateTimeArgs + ")' href='#'>Event</a>"
                      + "     </td>"
                      + "     <td class='person'>"
                      + "       <a class='nav' onclick='return View.SwitchNew(\"person\", " + dateTimeArgs + ")' href='#'>Person</a>"
                      + "     </td>"
                      + "     <td class='tag'>"
                      + "       <a class='nav' onclick='return View.SwitchNew(\"tag\", " + dateTimeArgs + ")' href='#'>Tag</a>"
                      + "     </td>"
                      + "     <td class='day'>"
                      + "       <a class='nav' onclick='return View.SwitchNew(\"day\", " + dateTimeArgs + ")' href='#'>Day</a>"
                      + "     </td>";

        return "   <table class='window'>"
             + "   <tr class='windowBar'>"
             + switchNewCode
             + "       <td class='windowBar' align='right'>"
             + "         <a class='button closeButton' onclick='return View.SetDivEditVisible(false)' href='#'>X</a>"
             + "       </td>"
             + "     </tr>"
             + "     <tr>"
             + "       <td class='window' colspan='6'>"
             + "         <table class='" + table + "'>"+ Table[table].BuildNew(date, time) + "</table>"
             + "       </td>"
             + "     </tr>"
             + "     <tr class='windowBar'>"
             + "       <td class='windowBar' colspan='2' align='right'>"
             + "       </td>"
             + "       <td class='windowBar' colspan='2' align='right'>"
             + "         <a class='button' onclick='return View.SubmitNew(\"" + table + "\", false)' href='#'>Save</a>"
             + "       </td>"
             + "       <td class='windowBar' colspan='2' align='right'>"
             + "         <a class='button' onclick='return View.SubmitNew(\"" + table + "\", true)' href='#'>Save & Close</a>"
             + "       </td>"
             + "     </tr>"
             + "   </table>";
    };

    function BuildSmallBox (table, id, text, importance, category, width, maxHeight)
    {
        // Create boxes for a certain day
        return '<div class="smallBox '+ Categories.GetCategories(table)[category].mCSSName + importance
            +'" style="width: '+ width +'; max-height: '+  maxHeight +'px;"'
            +'" onmouseup="View.OnMouseUpBox(\''+ table +'\', '+ id +')">'+ My.HtmlSpecialChars(text) +'</div>';
    };

    /**
     * @brief Changed the selected day by \p offsets and reloads the page.
     */
    function LoadViewDayOffset(dayOffset)
    {
        mDateStart += mOneDay * dayOffset;
        View.LoadView(null);
    };

    /**
     * @note \p this object is the xmlHttp object.
     */
    function OnStateChangedLoadLinks()
    {
        if (this.readyState == 4) {
            ItemBarLinks.SetXMLDoc(this.responseXML);
            ItemBarLinks.SetVisible(true);
        }
    };

    /**
     * @note \p this object is the xmlHttp object.
     */
    function OnStateChangedLoadSearch()
    {
        if (this.readyState == 4) {
            ItemBarSearch.SetXMLDoc(this.responseXML);
        }
    };

    /**
     * @note \p this object is the xmlHttp object.
     */
    function OnStateChangedLoadView()
    {
        if (this.readyState == 4) {
            View.mXMLDocView = this.responseXML;
            View.RedrawView();
        }
    };

    /**
     * @note \p this object is the xmlHttp object.
     */
    function OnStateChangedShowEdit()
    {
        if (this.readyState == 4) {
            var xmlDoc = this.responseXML;

            //alert((new XMLSerializer()).serializeToString(xmlDoc.documentElement));
            var objDivEditContent = document.getElementById('divEditContent');
            objDivEditContent.innerHTML = View.BuildEdit(xmlDoc);
                    
            var item = xmlDoc.firstChild; // xmlDoc -> row
            View.mDivEditTable = item.getAttribute("table");
            View.mDivEditItemID = item.getAttribute("id");
            
            View.SetDivEditVisible(true);
            View.LoadLinks(View.mDivEditTable, View.mDivEditItemID);
            //alert((new XMLSerializer()).serializeToString(xmlDoc));
        }
    };

    /**
     * @note \p this object is the xmlHttp object.
     */
    function OnStateChangedSubmit()
    {
        if (this.readyState == 4) {
            // Update view
            var xmlDoc = this.responseXML;
            //alert((new XMLSerializer()).serializeToString(xmlDoc));
            var item = xmlDoc.firstChild; // xmlDoc -> row
            var table = item.getAttribute("table");
            var id = item.getAttribute("id");
            var date = item.getAttribute("date");
            if (date != null) {
                date = My.DateDDMMYYYYToDate(date);
            }
            View.ShowEdit(table, id);
            View.LoadView(date);
        }
    };

    /**
     * @note \p this object is the xmlHttp object.
     */
    function OnStateChangedSubmitClose()
    {
        if (this.readyState == 4) {
            // Update view
            var xmlDoc = this.responseXML;
            // For testing xmlDoc
            /*
            // Go to date of new item
            var item = xmlDoc.firstChild; // xmlDoc -> row
            var date = item.getAttribute("date");
            if (date != null) {
                date = My.DateDDMMYYYYToDate(date);
            }
            */
            View.SetDivEditVisible(false);
            View.LoadView();
            View.LoadSearch();
        }
    };

    /**
     * @note \p this object is the xmlHttp object.
     */
    function OnStateChangedSubmitNewLink()
    {
        if (this.readyState == 4) {
            // For testing xmlDoc
            //var xmlDoc = this.responseXML;
            //alert(xmlDoc);
            //alert((new XMLSerializer()).serializeToString(xmlDoc));
            // Update divLink
            View.SetStatusBar('Link added.');
            if (View.GetDivEditVisible()) {
                View.LoadLinks(View.mDivEditTable, View.mDivEditItemID);
            }
        }
    };

    /**
     * @brief Creates a link directly between the given item and the currently edited item
     */
    function SubmitNewLinkCurrentEdit(table, itemID)
    {
        if (mThis.GetDivEditVisible()) {
            var xmlHttp = My.GetXMLHttpObject();
            if (xmlHttp == null) return;
            if (table == mThis.mDivEditTable && itemID == mThis.mDivEditItemID) {
                alert('Link to itself not allowed.');
                return;
            }
            // Build parameter string.
            var xml = '<?xml version="1.0" encoding="utf-8"?>'
                     + '<row table1_id="' + table + '" table1_item_id="' + itemID + '" table2_id="' + mThis.mDivEditTable + '" table2_item_id="' + mThis.mDivEditItemID + '"/>';
            My.SendPOSTRequest(xmlHttp, "./php/new_link.php", xml, OnStateChangedSubmitNewLink);
        }
    };

    /**
     * @brief Switches the view if the edit/new time is not on the current page.
     */
    function TimeStampDifferenceURI(editTime) {
        var currentTime;
        if (location.search == '') {
            currentTime = Math.floor((new Date()).getTime() / 1000);
        } else {
            parList = My.URIParameterList(location.search);
            currentTime = parList["date"];
        }
        var diff = editTime - currentTime;
        var uri;
        if (diff > 0 && diff < (5 * 7 * 24 * 3600)) { // less than 5 weeks difference
            uri = (location.search == '') ? "" : "&viewDate=" + currentTime;
        } else {
            uri = "&viewDate=" + editTime;
        }
        return uri;
    };
    // =============================================================================================
    // ================================= Privileged ================================================
    // =============================================================================================
    this.BuildEdit = function(xmlDoc)
    {
        var item = xmlDoc.firstChild; // xmlDoc -> row
        var id = item.getAttribute("id");
        var table = item.getAttribute("table");
        var created = item.getAttribute("created");
        var lastChanged = item.getAttribute("last_changed");
        var code = Table[table].BuildEditFromXML(item);

        return   "  <table class='window'>"
               + "    <tr class='windowBar'>"
               + "      <td class='windowBar' colspan='6' align='right'>"
               + "      </td>"
               + "      <td class='windowBar' align='right'>"
               + "        <a class='button closeButton' onclick='return View.SetDivEditVisible(false)' href='#'>X</a>"
               + "      </td>"
               + "    </tr>"
               + "    <tr>"
               + "      <td class='window' colspan='9'>"
               + "        <table class='"
               + table
               + "'>"
               + code
               + "        </table>"
               + "      </td>"
               + "    </tr>"
               + "    <tr class='windowBar'>"
               + "      <td class='windowBar' align='right'>ID</td>"
               + "      <td class='windowBar'><input name='editID' type='text' class='readonly' readonly value='"
               + id
               + "' size='3'/></td>"
               + "      <td class='windowBar' align='right'>Created</td>"
               + "      <td class='windowBar'><input name='editCreated' type='text' class='readonly' readonly value='"
               + created + "' size='16'/></td>"
               + "      <td class='windowBar' rowspan='2'>"
               + "        <a class='button' onclick='return View.SubmitDelete(\""
               + table + "\", " + id + ")' href='#'>Delete</a>"
               + "      </td>"
               + "      <td class='windowBar' align='right' rowspan='2'>"
               + "        <a class='button' onclick='return View.SubmitEdit(\""
               + table + "\", " + id + ", false)' href='#'>Save</a>"
               + "      </td>"
               + "      <td class='windowBar' align='right' rowspan='2'>"
               + "        <a class='button' onclick='return View.SubmitEdit(\""
               + table + "\", " + id + ", true)' href='#'>Save & Close</a>"
               + "      </td>"
               + "    </tr>"
               + "    <tr class='windowBar'>"
               + "      <td class='windowBar' colspan='3' align='right'>Last changed</td>"
               + "      <td class='windowBar'><input name='editLastChanged' type='text' class='readonly' readonly value='"
               + lastChanged + "' size='16'/></td>"
               + "    </tr>"
               + "  </table>";
    };

    this.GetDivEditVisible = function()
    {        
        return mDivEditVisible;
    };

    this.LoadLinks = function(table, id)
    {
        var xmlHttp = My.GetXMLHttpObject();
        if (xmlHttp == null)
            return;
        var url = "php/read_links.php";
        url = url + "?table=" + table;
        url = url + "&id=" + id;
        url = url + "&sid=" + Math.random();
        xmlHttp.onreadystatechange = OnStateChangedLoadLinks;
        xmlHttp.open("GET", url, true);
        //window.open(url) //For testing XML output
        xmlHttp.send(null);
    };

    this.LoadSearch = function()
    {        
        var xmlHttp = My.GetXMLHttpObject();
        if (xmlHttp == null)
            return;
        var url = "php/read_items.php";
        url = url + "?sid=" + Math.random();
        xmlHttp.onreadystatechange = OnStateChangedLoadSearch;
        xmlHttp.open("GET", url, true);
        //window.open(url); //For testing XML output
        xmlHttp.send(null);
    }

    /**
     * @brief Load the view. If <date> (of type Date) is not null, this date will be display. 
     */
    this.LoadView = function(date)
    {
        // Set timestamp time to 00:00:00
        if (date != null) {
            mSelectedDate = My.GetFullDayDate(date);
            if (mDateStart == null || date.getTime() < mDateStart || date.getTime() > mDateEnd) {
                mDateStart = My.GetWeekStart(mSelectedDate);
            }
        }
        if (mDateStart == null) {
            mSelectedDate = My.GetFullDayDate(new Date());
            mDateStart = My.GetWeekStart(mSelectedDate);
        }
        mDateEnd = mDateStart + mOneDay * (7 * mNumRows - 1);
        var xmlHttp = My.GetXMLHttpObject();
        if (xmlHttp == null) return;
        url = "php/read_view.php";
        url = url + "?dateStart=" + mDateStart / 1000;
        url = url + "&dateEnd=" + mDateEnd / 1000;
        url = url + "&sid=" + Math.random();
        xmlHttp.onreadystatechange = OnStateChangedLoadView;
        xmlHttp.open("GET",url,true);
        //window.open(url) //For testing XML output
        xmlHttp.send(null);
    };

    this.OnEventContextMenu = function(event)
    {
        return false;
    };

    this.OnEventMouseScroll = function(event)
    {
        var delta = 0;
        if (!event)
            event = window.event;
        // normalize the delta
        if (event.wheelDelta) {
            // IE & Opera
            delta = event.wheelDelta / 120;
        } else if (event.detail) {// W3C
            delta = -event.detail / 3;
        }
        event.wheelDelta = 0;
        // The delta variable holds the value 1 (mouse wheel up) or -1
        // (mouse wheel down)
        if (delta > 0) {
            LoadViewDayOffset(-7);
        } else {
            LoadViewDayOffset(7);
        }
    };

    this.OnEnterKeyLinks = function(table, id)
    { 
        View.ShowEdit(table, id);
    };

    this.OnEnterKeySearch = function(table, id)
    {
        if (View.GetDivEditVisible()) {
            SubmitNewLinkCurrentEdit(table, id);
        }
        else {
             View.ShowEdit(table, id);
        }
    };

    this.OnMouseUpBox = function(table, id)
    {
        var event = window.event;
        
        var rightClick = false;
        if (event.which) {
            // Firefox
            rightClick = (event.which == 3);
        }
        else if (event.button) {
            // IE
            rightClick = (event.button == 2);
        }
        if (rightClick) {
            if (View.GetDivEditVisible()) {
                // Directly add link for current item
                SubmitNewLinkCurrentEdit(table, id);
            }
        }
        else { 
            // Left click
            View.ShowEdit(table, id);
        }
    };

    this.RedrawView = function()
    {
        if (this.mXMLDocView == null) return;
        var tables = this.mXMLDocView.getElementsByTagName("table");
        var dateStart = this.mXMLDocView.firstChild.getAttribute("date_start") * 1000;
        var dayCode = new Array(7 * mNumRows);
        var maxBoxHeight = 2 * mBoxHeight;
        var totalNumDays = dayCode.length;
        var monthBarSizes = new Array();

        var todayTimestamp = My.GetFullDayDate(new Date()).getTime();
        var currentTime = My.GetFullTime(new Date());
        var monthNames = new Array("January", "February", "March", "April", "May", "June",
                                   "July", "August", "September", "October", "November", "December");
        var monthColors = new Array("#C0C0FF", "#A0A0EE", "#90E4B4", "#A0FFA0", "#FFC098", "#FFAAAA",
                                    "#EEEE90", "#B2E0B2", "#EAB4B4", "#B0B0B0", "#D4D4D4", "#F0F0F0");

        for (var i = 0; i < dayCode.length; i++) {
            // Table order for view is: Day, Event, Person, Note
            dayCode[i] = new Array("","","","");
            // The order in which the items should in each day:
            // 0: day
            // 1: event
            // 2: person
            // 3: note
        }
        // Last found category for 'day'.
        var dayTdClass = new Array(dayCode.length);
        
        // Sort the data into the 'dayCode' array first. They will later be drawn in a certain oder.
        for (var i = 0; i < tables.length; i++) {
            var tableName = tables[i].getAttribute("name");
            var items = tables[i].childNodes;
            // Go through all items of the table.
            for (var j = 0; j < items.length; j++) {
                var id = items[j].getAttribute("id");
                var category = items[j].getAttribute("category");
                           
                switch (tableName) {
                    case "day":
                        {
                            var startIndex = (My.SQLDate2JSTimeStamp(items[j].getAttribute("from_date")) - dateStart) / mOneDay;
                            var endIndex = (My.SQLDate2JSTimeStamp(items[j].getAttribute("to_date")) - dateStart) / mOneDay;
                            startIndex = Math.max(startIndex, 0);
                            endIndex = Math.min(endIndex, mNumRows * 7 - 1);
                            var colorScheme = Categories.GetCategories('day')[category].mCSSName;
                            var displayText = Categories.GetCategories('day')[category].mDisplayText;
                            // Fill code for relevant days.
                            for (var k = startIndex; k <= endIndex; ++k) {
                                dayTdClass[k] = colorScheme; 
                                dayCode[k][0] += BuildSmallBox(tableName, id, displayText, "", category, '100%', maxBoxHeight);
                            }
                        }    
                        break;
                    case "event":
                        {
                            // EVENT table has additional options for the end date
                            // size = endDate - startDate in days
                            var importance = items[j].getAttribute("importance");
                            var text = items[j].childNodes[0].firstChild.nodeValue;
                            // Get date indices
                            var startIndex = (My.SQLDate2JSTimeStamp(items[j].getAttribute("from_date")) - dateStart) / mOneDay;
                            var endIndex = (My.SQLDate2JSTimeStamp(items[j].getAttribute("to_date")) - dateStart) / mOneDay;
                            startIndex = Math.max(startIndex, 0);
                            // When the endtime is before 05:00 AM, the event will not be shown at that end day.
                            // An entry with 'zero' duration is still shown however.
                            var endTime = items[j].getAttribute("to_time");
                            var endHour = endTime.substr(0, 2);
                            if (endHour < 5 && endIndex > startIndex) {
                                endIndex -= 1;
                            }
                            endIndex = Math.min(endIndex, mNumRows * 7 - 1);
                            // Fill code for relevant days.
                            for (var k = startIndex; k <= endIndex; ++k) {
                                dayCode[k][1] += BuildSmallBox(tableName, id, text, importance, category, '100%', maxBoxHeight);
                            }
                        }
                        break;
                    case "person":
                        {
                            var dateIndex = (My.SQLDate2JSTimeStamp(items[j].getAttribute("date")) - dateStart) / mOneDay;
                            var importance = items[j].getAttribute("importance");
                            var text = items[j].childNodes[0].firstChild.nodeValue;
                            // Fill code for relevant day.
                            if (dayCode[dateIndex] == null) {
                                alert(dateIndex)
                                alert(dateStart)
                                alert(items[j].getAttribute("date"))
                            }
                            dayCode[dateIndex][2] += BuildSmallBox(tableName, id, text, importance, category, '100%', maxBoxHeight);    
                        }
                        break;
                    case "note":
                        {
                            var dateIndex = (My.SQLDate2JSTimeStamp(items[j].getAttribute("date")) - dateStart) / mOneDay;
                            var importance = items[j].getAttribute("importance");
                            var text = items[j].childNodes[0].firstChild.nodeValue;
                            // Fill code for relevant day.
                            dayCode[dateIndex][3] += BuildSmallBox(tableName, id, text, importance, category, '100%', maxBoxHeight);    
                        }
                        break;
                }
            }
        }
        // Generate code
        // Header: Week day names
        var code = "<table class='view'>"
                + "<tr class='weekDayHeader'>"
                + "<td>Mo</td><td>Di</td><td>Mi</td><td>Do</td><td>Fr</td><td>Sa</td><td>So</td>"
                + "</tr>";
        var currentTimestamp = dateStart;
        for (var week = 0; week < mNumRows; week++) {
            code += "<tr class='weekDateHeader'>";
            var tempTimestamp = currentTimestamp;
            for (var day = 0; day < 7; day++) {
                var dateIndex = week * 7 + day;
                var tempDate = new Date(tempTimestamp);
                
                var tdHeaderClass = (tempTimestamp == todayTimestamp) ? 'dayHeaderToday' : 'dayHeaderSomeDay';
                
                code += (tempDate.getMonth() == mSelectedDate.getMonth() ? '<td class="dayHeader '+ tdHeaderClass +'">' : '<td class="dayHeader dayHeaderOtherMonth">');
                
                dateDay = tempDate.getDate();
                code += dateDay;
                if (dateDay == 1 || day == 0 && week == 0) {
                    code += " " + monthNames[tempDate.getMonth()];
                }
                // The month bar sizes have the following format: (month index, dateIndex, year).
                // The #day and height for the preceding month is set when the next month starts
                if (day == 0 && week == 0) {
                    monthBarSizes[0] = new Array(tempDate.getMonth(), 0, tempDate.getFullYear());
                }
                else if (dateDay == 1) {
                    monthBarSizes[monthBarSizes.length] = new Array(tempDate.getMonth(), dateIndex, tempDate.getFullYear());
                }
                code += "</td>";
                tempTimestamp += mOneDay;
            }
            code += "</tr>";
            // Contents for the day
            code += "<tr class='weekBody'>";
            for (var day = 0; day < 7; day++) {    
                var dateIndex = week * 7 + day;
                var tdClass = '';                
                
                if (currentTimestamp == todayTimestamp) {
                    tdClass = " class='dayBodyToday'";
                } else if (day > 4) {
                    tdClass = " class='dayBodyWeekend'";
                } else if (dayTdClass[dateIndex] != undefined){
                    // If there is an entry in the 'day' table, get color scheme for that entry.   
                    tdClass = " class='" + dayTdClass[dateIndex] + "'";                        
                }                
                        
                code += '<td'+ tdClass +'>';
                divID = 'div_'+ week +'_'+ day;
                
                var currentDate = new Date(currentTimestamp);
                var onClickCode = 'View.ShowNew(\''+ divID 
                        +'\',\''+ My.GetFullDate(currentDate) +'\',\''
                        + ((currentTimestamp == todayTimestamp) ? currentTime : '12:00') +'\');';
                
                
                // Container for the whole day
                code += '<div class="dayView" style="z-index: '+ (99 - dateIndex) + ';">';
                // Click area of day to create new entry
                code += '<div id="'+ divID  +'" style="z-index: 50;" class="dayBody" onclick="'+onClickCode+'"></div>';
                code += '<div class="dayContent">';
                // Insert elements for this day    
                for (var tableIndex = 0; tableIndex < 4; tableIndex++) {
                    code += dayCode[dateIndex][tableIndex];    
                }
                code += '</div></div></td>';
                code += "</td>";
                currentTimestamp += mOneDay;
            }
            code += "</tr>";
        }
            /*
        for (; date <= dateEnd_; date += oneDay_) {
            code += days[date];
        }
        */
        code += "</table>";
        
        // Build code for the month side bar
        var monthBarCode = "<table class='noSpaces' style='height: 100%;'><tr><td><div class='monthBarTopFill' style='height: 18px;'></td></tr><tr style='height: 100%;'><td>";
        
        for (var i = 0; i < monthBarSizes.length; i++) {
            var numDaysForMonth = (i == monthBarSizes.length - 1) ? totalNumDays - monthBarSizes[i][1] : monthBarSizes[i+1][1] - monthBarSizes[i][1];
            monthBarCode += "<div class='monthBarOneMonth' style='background-color: "+ monthColors[monthBarSizes[i][0]] +"; height: "+ 100*numDaysForMonth/totalNumDays +"%;'>"
                              +"<div style='height: 40%;'></div><div class='monthBarText'>"
                              + monthNames[monthBarSizes[i][0]] // Month name
                              +"<div style='color: #909090;'>"+ monthBarSizes[i][2] +"</div>" // Year
                              +"</div></div>";
            // 
        }
        
        monthBarCode += "</td></tr></table>";
        var divMonthBar = document.getElementById('divMonthBar');
        divMonthBar.innerHTML = monthBarCode;

        var divView = document.getElementById('divView');
        divView.innerHTML = code;
    };

    this.SetDivEditVisible = function(visible)
    {
        var obj = document.getElementById('divEdit');
        mDivEditVisible = visible;
        
        // Hide links and search bar. They will be loaded again when an edit 
        // view is shown.
        ItemBarLinks.SetVisible(false);
        
        if (visible) {
            obj.style.visibility = 'visible';
        }
        else {
            obj.style.visibility = 'hidden';
            if (mActiveCell != '') {
                mActiveCell.style.backgroundColor = mActiveCellBackground;
            }
        }
        return false; // Do not follow href after this.
    };

    this.SetStatusBar = function(text)
    {
        var divStatusBar = document.getElementById('divStatusBar');
        divStatusBar.innerHTML = text;
    };

    this.ShowEdit = function(table, id)
    {
        var xmlHttp = My.GetXMLHttpObject();
        if (xmlHttp == null)
            return;
        var url = "php/read_row.php";
        url = url + "?table=" + table;
        url = url + "&id=" + id;
        url = url + "&sid=" + Math.random();
        xmlHttp.onreadystatechange = OnStateChangedShowEdit;
        xmlHttp.open("GET", url, true);
        //window.open(url); //For testing XML output
        xmlHttp.send(null);
    };

    this.ShowNew = function(senderID, date, time)
    {
        // Reset color of active cell (if other cell was still active).
        if (mActiveCell != '') {
            mActiveCell.style.backgroundColor = mActiveCellBackground;
        }
        // Set new active cell.
        mActiveCell = document.getElementById(senderID);
        mActiveCellBackground = mActiveCell.style.backgroundColor;
        mActiveCell.style.backgroundColor = '#F4F400';
        // Show edit box.
        this.mDivEditItemID = 0;
        var obj = document.getElementById('divEditContent');
        obj.innerHTML = BuildNew("note", date, time);
        View.SetDivEditVisible(true);
    };

    this.SubmitDelete = function(table, id)
    {
        var confirmDelete = confirm("Really delete item?");
        if (confirmDelete) {
            var xmlHttp = My.GetXMLHttpObject();
            if (xmlHttp == null) return false;
            var xml = '<?xml version="1.0" encoding="utf-8"?>\n<row table="' + table + '" id="' + id + '"/>';
            My.SendPOSTRequest(xmlHttp, "./php/delete.php", xml, OnStateChangedSubmitClose);
        }
        return false; // Do not follow href after this.
    };

    this.SubmitEdit = function(table, id, saveAndClose)
    {
        if(!Table[table].CheckEditNewInput()) {
            return false;
        }
        var xmlHttp = My.GetXMLHttpObject();
        if (xmlHttp == null) return false;
        // Build parameter string
        var xml = Table[table].GetRow(id);
        if (saveAndClose) {
            My.SendPOSTRequest(xmlHttp, "./php/edit.php", xml, OnStateChangedSubmitClose);
        }
        else {
            My.SendPOSTRequest(xmlHttp, "./php/edit.php", xml, OnStateChangedSubmit);
        }
        return false; // Do not follow href after this.
    };

    this.SubmitNew = function(table, saveAndClose)
    {
        if(!Table[table].CheckEditNewInput()) {
            return;
        }
        var xmlHttp = My.GetXMLHttpObject();
        if (xmlHttp == null) return;
        // Build parameter string
        var xml = Table[table].GetRow('');
        if (saveAndClose) {
            My.SendPOSTRequest(xmlHttp, "./php/new.php", xml, OnStateChangedSubmitClose);
        }
        else {
            My.SendPOSTRequest(xmlHttp, "./php/new.php", xml, OnStateChangedSubmit);
        }
        return false;
    };

    this.SwitchNew = function(table, date, time)
    {
        var obj = document.getElementById('divEditContent');
        obj.innerHTML = BuildNew(table, date, time);
        return false; // Do not follow href after this.
    };
};



// =============================================================================================
// ================================= Public ====================================================
// =============================================================================================
// ---------------------------------------------------------------------------------------------
//MainView.prototype.ExamplePublicFunction = function(table, id)
//{
//}
//---------------------------------------------------------------------------------------------