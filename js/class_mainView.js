﻿﻿function MainView()
{
    // public
    this.mEditElementTable = null;
    this.mEditElementItemID = 0;
    
    // private    
    var mOneDay = 24 * 60 * 60 * 1000;
    var mWeekPadding = 3;
    var mBoxHeight = 16;
    var mEditElementVisible = false;    
    
    var mThis = this; // For acces to 'this' in private function ('this' is not set correctly there).
    
    this.mDayData = {};
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
                      + "     <td class='place'>"
                      + "       <a class='nav' onclick='return View.SwitchNew(\"place\", " + dateTimeArgs + ")' href='#'>Place</a>"
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
             + "     </tr>"
             + "     <tr>"
             + "       <td class='window' colspan='6'>"
             + "         <table class='" + table + " fillWidth'>"+ Table[table].BuildNew(date, time) + "</table>"
             + "       </td>"
             + "     </tr>"
             + "     <tr class='windowBar'>"
             + "             <td class='windowBar' align='center' colspan='2'>"
             + "               <a class='button' onclick='return View.SubmitNew(\"" + table + "\", false)' href='#'>Save</a>"
             + "             </td>"
             + "             <td class='windowBar' align='center' colspan='2'>"
             + "               <a class='button' onclick='return View.SubmitNew(\"" + table + "\", true)' href='#'>Save & Close</a>"
             + "             </td>"
             + "             <td class='windowBar' align='center' colspan='2'>"
             + "               <a class='button' onclick='return View.SetEditElementVisible(false)' href='#'>Cancel</a>"
             + "             </td>"
             + "     </tr>"
             + "   </table>";
    };

    function BuildSmallBox (table, id, text, style, width, maxHeight)
    {
        // Create boxes for a certain day
        return '<div class="smallBox '+ style
            +'" style="width: '+ width +'; max-height: '+  maxHeight +'px;"'
            +'" onmouseup="View.OnMouseUpBox(event, \''+ table +'\', '+ id +')">'+ My.HtmlSpecialChars(text) +'</div>';
    };

    /**
     * @note \p this object is the xmlHttp object.
     */
    function OnStateChangedShowEdit()
    {
        if (this.readyState == 4) {
            var xmlDoc = this.responseXML;

            //alert((new XMLSerializer()).serializeToString(xmlDoc.documentElement));
            var objEditElementContent = document.getElementById('editElementContent');
            objEditElementContent.innerHTML = View.BuildEdit(xmlDoc);
                    
            var item = xmlDoc.firstChild; // xmlDoc -> row
            View.mEditElementTable = item.getAttribute("table");
            View.mEditElementItemID = item.getAttribute("id");
            
            View.SetEditElementVisible(true);
            View.LoadLinks(View.mEditElementTable, View.mEditElementItemID);
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
            
            // Go to date of new item
            var item = xmlDoc.firstChild; // xmlDoc -> row
            var date = item.getAttribute("date");
            if (date != null) {
                date = My.DateDDMMYYYYToDate(date);
            }
            
            View.SetEditElementVisible(false);
            View.LoadView(date);
            View.LoadSearch();
        }
    };

    /**
     * @brief Creates a link directly between the given item and the currently edited item
     */
    function SubmitNewLinkCurrentEdit(table, id)
    {
        if (mThis.GetEditElementVisible()) {
            var xmlHttp = My.GetXMLHttpObject();
            if (xmlHttp == null) return;
            if (mThis.mEditElementTable == null) return;
            if (table == mThis.mEditElementTable && id == mThis.mEditElementItemID) {
                alert('Link to itself not allowed.');
                return;
            }
            // Build parameter string.
            var xml = '<?xml version="1.0" encoding="utf-8"?>'
                     + '<row table1="' + table + '" table1_item_id="' + id + '" table2="' + mThis.mEditElementTable + '" table2_item_id="' + mThis.mEditElementItemID + '"/>';
            My.SendPOSTRequest(xmlHttp, "./php/new_link.php", xml, function ()
            {
                if (xmlHttp.readyState == 4) {
                    // Update divLink
                    if (View.GetEditElementVisible()) {
                        View.LoadLinks(View.mEditElementTable, View.mEditElementItemID);
                    }
                }
            });
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

    function BuildShowNewCall(currentDate, currentTimestamp, todayTimestamp, currentTime) {
        return 'View.ShowNew(\'' + My.GetFullDate(currentDate) + '\',\''
            + ((currentTimestamp == todayTimestamp) ? currentTime : '12:00') + '\');';
    }
    // =============================================================================================
    // ================================= Privileged ================================================
    // =============================================================================================
    this.Initialize = function()
    {
        this.LoadView(new Date());
        this.LoadSearch();  

        $("#divView").scroll(function(e){
            if (ElementIsInScrollView(WeekFirstId)) {
                //Here you must do what you need to achieve the infinite scroll effect...
                alert('First is in Scroll')
            }
            else if (ElementIsInScrollView(WeekLastId))
            {
                alert('Last is in Scroll')
            }    
        });
    }

    this.BuildEdit = function(xmlDoc)
    {
        var item = xmlDoc.firstChild; // xmlDoc -> row
        var id = item.getAttribute("id");
        var table = item.getAttribute("table");
        var created = item.getAttribute("created");
        var lastChanged = item.getAttribute("last_changed");
        var code = Table[table].BuildEditFromXML(item);

        return   "  <table class='window'>"
               + "    <tr>"
               + "      <td class='window' colspan='5'>"
               + "        <table class='" + table + " fillWidth'>"
               +           code
               + "        </table>"
               + "      </td>"
               + "    </tr>"
               + "    <tr class='windowBar'>"
               + "      <td class='windowBar'>"
               + "        <table class='editMetaData'>"
               + "          <tr>"
               + "            <td class='noWrap'>ID:</td>"
               + "            <td class='noWrap'>" + id + "</td>"
               + "          </tr>"
               + "          <tr>"
               + "            <td class='noWrap'>Created:</td>"
               + "            <td class='noWrap'>" + created + "</td>"
               + "          </tr>"
               + "          <tr>"
               + "            <td class='noWrap'>Changed:</td>"
               + "            <td class='noWrap'>" + lastChanged + "</td>"
               + "          </tr>"
               + "        </table>"
               + "      </td>"
               + "      <td class='windowBar' style='width: 25%' align='center'>"
               + "        <a class='button' onclick='return View.SubmitDelete(\"" + table + "\", " + id + ")' href='#'>Delete</a>"
               + "      </td>"
               + "      <td class='windowBar' style='width: 25%' align='center'>"
               + "        <a class='button' onclick='return View.SubmitEdit(\"" + table + "\", " + id + ", false)' href='#'>Save</a>"
               + "      </td>"
               + "      <td class='windowBar' style='width: 25%' align='center'>"
               + "        <a class='button' onclick='return View.SubmitEdit(\"" + table + "\", " + id + ", true)' href='#'>Save & Close</a>"
               + "      </td>"
               + "      <td class='windowBar' style='width: 25%' align='center'>"
               + "        <a class='button' onclick='return View.SetEditElementVisible(false)' href='#'>Cancel</a>"
               + "      </td>"
               + "    </tr>"
               + "  </table>";
    };

    this.GetEditElementVisible = function()
    {        
        return mEditElementVisible;
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
        xmlHttp.onreadystatechange = function()
        {
            if (xmlHttp.readyState == 4) {
                ItemBarLinks.SetXMLDocWithItem(xmlHttp.responseXML, table, id);
                ItemBarLinks.SetVisible(true);
            }
        };
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
        xmlHttp.onreadystatechange = function ()
        {
            if (xmlHttp.readyState == 4) {
                ItemBarSearch.SetXMLDoc(xmlHttp.responseXML);
            }
        };
        xmlHttp.open("GET", url, true);
        //window.open(url); //For testing XML output
        xmlHttp.send(null);
    }

    this.LoadView = function(date)
    {
        this.mXMLDocView = {};

        // Set timestamp time to 00:00:00
        var dateStart = My.GetWeekStart(My.GetFullDayDate(date)) - mWeekPadding * mOneDay * 7;
        var dateEnd = dateStart + mWeekPadding * 2 * 7 * mOneDay + 6 * mOneDay;
        this.AddView(dateStart, dateEnd);
    }

    /**
     * @brief Load the view. If <date> (of type Date) is not null, this date will be display. 
     */
    this.AddView = function(dateStart, dateEnd)
    {
        var xmlHttp = My.GetXMLHttpObject();
        if (xmlHttp == null) return;
        url = "php/read_view.php";
        url = url + "?dateStart=" + dateStart;
        url = url + "&dateEnd=" + dateEnd;
        url = url + "&sid=" + Math.random();
        xmlHttp.onreadystatechange = function ()
        {
            if (xmlHttp.readyState == 4) {
                View.AddData(xmlHttp.responseXML);
                View.RedrawView();
            }
        };
        xmlHttp.open("GET",url,true);
        //window.open(url) //For testing XML output
        xmlHttp.send(null);
    };

    this.OnEnterKeyLinks = function(table, id)
    { 
        View.ShowEdit(table, id);
    };

    this.OnEnterKeySearch = function(table, id)
    {
        if (View.GetEditElementVisible()) {
            SubmitNewLinkCurrentEdit(table, id);
        }
        else {
             View.ShowEdit(table, id);
        }
    };

    this.OnMouseUpBox = function(event, table, id)
    {
        event = event || window.event;
        
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
            if (View.GetEditElementVisible()) {
                // Directly add link for current item
                SubmitNewLinkCurrentEdit(table, id);
            }
        }
        else { 
            // Left click
            View.ShowEdit(table, id);
        }
    };

    function ElementIsInScrollView(elementId)
    {
        var divViewTop = $("#divView").scrollTop();
        var divViewBottom = divViewTop + $("#divView").height();
    
        var element = $("#"+elementId);
        var elementTop = $(element).offset();
        var elementBottom = elementTop + $(element).height();
    
        return ((elementBottom <= divViewBottom) && (elementTop >= divViewTop));
    }


    this.AddData = function(xml)
    {       

        var tables = xml.getElementsByTagName("table");
        var dateStart = parseInt(xml.firstChild.getAttribute("date_start"));
        var dateEnd = parseInt(xml.firstChild.getAttribute("date_end"));

        var test = new Date(dateStart);
        var test2 = new Date(dateEnd);

        var maxBoxHeight = 2 * mBoxHeight;

        // Create entries for all days from start to end

        for (var timestamp = dateStart; timestamp <= dateEnd; timestamp += mOneDay) {
            if (!(timestamp in this.mDayData))
            {
                // The order in which the items should appear in each day:
                // 0: day
                // 1: event
                // 2: person
                // 3: note
                // 4: divClass
                this.mDayData[timestamp] = new Array("","","","","");
            }
        }
/*
        var maxBoxHeight = 2 * mBoxHeight;
        this.mDayData[dateStart] = {};

        var dayCode = new Array(7);

        

        for (var i = 0; i < dayCode.length; i++) {
            // Table order for view is: Day, Event, Person, Note
            dayCode[i] = new Array("","","","");
        }

        // Last found category for 'day'.
        var dayDivClass = new Array(dayCode.length);
        */
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
                            var fromDay = My.SQLDate2JSTimeStamp(items[j].getAttribute("from_date"));
                            var toDay = My.SQLDate2JSTimeStamp(items[j].getAttribute("to_date"));

                            var dayCagegoryDisplayText = My.GetDayCategoriesDisplayText()[category];
                            // Fill code for relevant days.
                            for (var timestamp = fromDay; timestamp <= toDay; timestamp += mOneDay) {
                                this.mDayData[timestamp][0] += BuildSmallBox(tableName, id, dayCagegoryDisplayText, category, '100%', maxBoxHeight);
                                this.mDayData[timestamp][4] = category; 
                            }
                        }    
                        break;                        
                    case "event":
                        {
                            // EVENT table has additional options for the end date
                            // size = endDate - startDate in days
                            var importance = items[j].getAttribute("importance");  
                            var text = items[j].childNodes[0].firstChild.nodeValue;
                            // If this is linked to a place, add a marker symbol.
                            if (items[j].getAttribute("has_place")) {
                                text = "● " + text;
                            }
                            // Get dates
                            var fromDay = My.SQLDate2JSTimeStamp(items[j].getAttribute("from_date"));
                            var toDay = My.SQLDate2JSTimeStamp(items[j].getAttribute("to_date"));

                            // When the endtime is before 05:00 AM, the event will not be shown at that end day.
                            // An entry with 'zero' duration is still shown however.
                            /*
                            todo:
                            var endTime = items[j].getAttribute("to_time");
                            var endHour = endTime.substr(0, 2);
                            if (endHour < 5 && endIndex > startIndex) {
                                toDay -= 1;
                            }
                            */
                            // Fill code for relevant days.
                            for (var timestamp = fromDay; timestamp <= toDay; timestamp += mOneDay) {
                                this.mDayData[timestamp][1] += BuildSmallBox(tableName, id, text, category + importance, '100%', maxBoxHeight);
                            }
                        }
                        break;
                    case "person":
                        {
                            var dayTimestamp = My.SQLDate2JSTimeStamp(items[j].getAttribute("date"));
                            var importance = items[j].getAttribute("importance");
                            var text = items[j].childNodes[0].firstChild.nodeValue;  
                            this.mDayData[dayTimestamp][2] += BuildSmallBox(tableName, id, text, category + importance, '100%', maxBoxHeight);
                        }
                        break;
                    case "note":
                        {
                            var dayTimestamp = My.SQLDate2JSTimeStamp(items[j].getAttribute("date"));
                            var importance = items[j].getAttribute("importance");
                            var text = items[j].childNodes[0].firstChild.nodeValue;
                            // Fill code for relevant day.
                            this.mDayData[dayTimestamp][3] += BuildSmallBox(tableName, id, text, category + importance, '100%', maxBoxHeight);    
                        }
                        break;
                }
            }
        }
    }

    this.RedrawView = function()
    {
        if (this.mDayData == null) return;

        var todayDate = new Date();
        var todayTimestamp = My.GetFullDayDate(todayDate).getTime();
        var currentTime = My.GetFullTime(todayDate);
        var monthNames = new Array("January", "February", "March", "April", "May", "June",
                                   "July", "August", "September", "October", "November", "December");
        var monthColors = new Array("#C0C0FF", "#A0A0EE", "#90E4B4", "#A0FFA0", "#FFC098", "#FFAAAA",
                                   "#EEEE90", "#B2E0B2", "#EAB4B4", "#B0B0B0", "#D4D4D4", "#F0F0F0");

        // Generate code                       
        var code = "";
        var keys = Object.keys(this.mDayData); 
        keys.sort(); 

        for (var i = 0; i < keys.length; i += 7) {
            // Build a week
            var weekStartTimestamp = parseInt(keys[i]);
            var weekStartDate = new Date(weekStartTimestamp);
            
            var isFirstItem = i == 0;
            var isLastItem = i == keys.length - 1;
            
            // Build month column
            var month = weekStartDate.getMonth();
            var id = (isFirstItem ? 'id='+WeekFirstId+' ' : (isLastItem ? 'id='+WeekLastId+' ' : ''));
            code += "<div "+ id
                        +"class='monthBarOneMonth' style='background-color: "+ monthColors[month] +";'>"
                        +"<div style='height: 100px;'></div><div class='monthBarText'>"
                        + monthNames[month] // Month name
                        +"<span style='color: #909090; margin-left: 12px;'>"+ weekStartDate.getFullYear() +"</span>" // Year
                        +"</div></div>";

            // Day dates
            for (var day = 0; day < 7; day++) {
                code += "<div>";

                var dayTimestamp = weekStartTimestamp + mOneDay * day;
                var dayTableData = dayTimestamp in this.mDayData ? this.mDayData[dayTimestamp] : undefined;

                var dayDate = new Date(dayTimestamp);
                var tdHeaderClass = (dayTimestamp == todayTimestamp) ? 'dayHeaderToday' : 'dayHeaderSomeDay';
                var showNewCode = BuildShowNewCall(dayDate, dayTimestamp, todayTimestamp, currentTime);

                code += (dayDate.getMonth() == todayDate.getMonth()
                    ? '<div class="dayHeader '+ tdHeaderClass +'" onclick="'+showNewCode+'">'
                    : '<div class="dayHeader dayHeaderOtherMonth" onclick="'+showNewCode+'">');
                dateDay = dayDate.getDate();
                code += dateDay;
                if (dateDay == 1) {
                    code += " " + monthNames[dayDate.getMonth()];
                }
                code += '</div>';

                var divClass = '';                
                if (dayTimestamp == todayTimestamp) {
                    divClass = " dayBodyToday";
                } else if (day > 4) {
                    divClass = " dayBodyWeekend";
                } else if (dayTableData != undefined && dayTableData[4] != undefined && dayTableData[4] != ""){
                    // If there is an entry in the 'day' table, get color scheme for that entry.   
                    divClass = " " + dayTableData[4];                        
                }
                // Container for the whole day
                // Click area of day to create new entry
                var showNewCode = BuildShowNewCall(dayDate, dayTimestamp, todayTimestamp, currentTime);
                code += '<div class="dayBody'+ divClass +'" style="z-index: '+ (99 - day) + ';" onclick="'+showNewCode+'">';

                // Insert elements for this day
                if (dayTableData != undefined)
                {
                    for (var tableIndex = 0; tableIndex < 4; tableIndex++) {
                        code += dayTableData[tableIndex];    
                    }
                }
                code += "</div></div>";
            }
                /*
            for (; date <= dateEnd_; date += oneDay_) {
                code += days[date];
            }
            */
                code += "</tr>";
            code += "</div>";
        }

        var scroll = $("#divView").scrollTop();
        var height = $("#divView").height();

        $("#divView").html(code);

        var newHeight = $("#divView").height();
        $("#divView").scrollTop(scroll);

       
        return code;
    };

    this.SetEditElementVisible = function(visible)
    {
        var obj = document.getElementById('editElement');
        mEditElementVisible = visible;
        
        // Hide links and search bar. They will be loaded again when an edit 
        // view is shown.
        ItemBarLinks.SetVisible(false);
        
        if (visible) {
            obj.style.visibility = 'visible';
            obj.style.height = '340px';
        }
        else {
            obj.style.visibility = 'collapse';
            obj.style.height = '0px';
        }
        return false; // Do not follow href after this.
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

    this.ShowNew = function(date, time)
    {
        // Show edit box.
        this.mEditElementItemID = 0;
        var obj = document.getElementById('editElementContent');
        obj.innerHTML = BuildNew("note", date, time);
        View.SetEditElementVisible(true);
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

    this.SubmitDeleteLink = function(table1, id1, table2, id2)
    {
        var confirmDelete = confirm("Really delete link?");
        if (confirmDelete) {
            var xmlHttp = My.GetXMLHttpObject();
            if (xmlHttp == null) return false;
            var xml = '<?xml version="1.0" encoding="utf-8"?>\n<row table1="' + table1 + '" id1="' + id1 + '" table2="' + table2 + '" id2="' + id2 + '"/>';
            My.SendPOSTRequest(xmlHttp, "./php/delete_link.php", xml, function ()
            {
                if (xmlHttp.readyState == 4) {
                    // Update divLink
                    if (View.GetEditElementVisible()) {
                        View.LoadLinks(View.mEditElementTable, View.mEditElementItemID);
                    }
                }
            });
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
        var obj = document.getElementById('editElementContent');
        obj.innerHTML = BuildNew(table, date, time);
        return false; // Do not follow href after this.
    };
};