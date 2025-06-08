﻿class ItemData
{
    constructor(table, id, text, style)
    {
        this.Table = table
        this.Id = id;
        this.Text = text;
        this.Style = style;
    }
}

class EventItemData extends ItemData
{
    constructor(table, id, text, style, fromDate, fromTime, toDate, toTime)
    {
        super(table, id, text, style);
        this.FromDate = fromDate;
        this.FromTime = fromTime;
        this.ToDate = toDate;
        this.ToTime = toTime;
    }
}

class DayData
{
    constructor()
    {
        this.Days = new Array();
        this.Events = new Array();
        this.Persons = new Array();
        this.Notes = new Array();
        this.DivClass = "";
    }
}

function IndexView()
{
    //TODO: xml output: Viele items auf attributes umstellen

    // public
    this.mEditElementTable = null;
    this.mEditElementItemID = 0;

    // private    
    var mOneDay = 24 * 60 * 60 * 1000;
    var mOneWeek = mOneDay * 7;

    // Number of weeks that will be padded at start and end.
    var mWeekPadding = 4;

    var mBoxHeight = 18;
    var mEditElementVisible = false;

    var mThis = this; // For acces to 'this' in private functions.

    this.mDayData = {};
    this.mFirstWeekTimestamp = 0;
    this.mLastWeekTimestamp = 0;
    this.mAddingData = false;
    this.mOneWeekHeight = 0;

    // The distance in pixels from the current content border at which new content will be loaded during scrolling.
    this.mWeekScrollLoadLimit = 0;

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
            + "         <table class='" + table + " fillWidth'>" + Table[table].BuildNew(date, time) + "</table>"
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

    function BuildSmallBoxStacked(item, top)
    {
        return '<div class="smallBox smallBoxDay smallBoxDayStacked ' + item.Style + '"'
            + ' style="top: ' + top + 'px; height: ' + mBoxHeight + 'px;"'
            + ' onmouseup="View.OnMouseUpBox(event, \'' + item.Table + '\', ' + item.Id + ', \'' + item.Style + '\')">' + My.HtmlSpecialChars(item.Text) + '</div>';
    };

    function BuildDayBox(item)
    {
        return '<span class="item_day" onmouseup="View.OnMouseUpBox(event, \'' + item.Table + '\', ' + item.Id + ', \'' + item.Style + '\')">' + My.HtmlSpecialChars(item.Text) + '</span>';
    };

    function BuildSmallBoxEvent(item, dayTimestamp)
    {
        var from = item.FromDate != dayTimestamp ? 0 : new Date('1970-01-01T' + item.FromTime + 'Z').getTime() / mOneDay;
        var to = item.ToDate != dayTimestamp ? 1 : new Date('1970-01-01T' + item.ToTime + 'Z').getTime() / mOneDay;

        var backgroundItem = ((from == 0 && to > 0.2) || (to == 1.0 && from < 0.8));
        var left = backgroundItem ? "30%" : "0px";
        var width = backgroundItem ? "70%" : "100%";

        var rowHeight = 100; // percent
        var top = from * rowHeight;
        var bottom = to * rowHeight;
        var height = Math.min(Math.max(8, bottom - top), rowHeight - top);

        return '<div class="smallBox smallBoxDay smallBoxDayEvent ' + item.Style
            + '" style="left: ' + left + '; width: ' + width + '; top: ' + top + '%; height: ' + height + '%; z-index: ' + Math.floor(top) + ';"'
            + '" onmouseup="View.OnMouseUpBox(event, \'' + item.Table + '\', ' + item.Id + ', \'' + item.Style + '\')">' + My.HtmlSpecialChars(item.Text) + '</div>';
    };

    /**
     * @note \p this object is the xmlHttp object.
     */
    function OnStateChangedShowEdit()
    {
        if (this.readyState == 4)
        {
            var xmlDoc = this.responseXML;

            var objEditElementContent = document.getElementById('editElementContent');
            objEditElementContent.innerHTML = View.BuildEdit(xmlDoc);

            var item = xmlDoc.firstChild; // xmlDoc -> row
            View.mEditElementTable = item.getAttribute("table");
            View.mEditElementItemID = item.getAttribute("id");

            View.SetEditElementVisible(true);
            LoadLinksAndShowBar(View.mEditElementTable, View.mEditElementItemID);
        }
    };

    /**
     * @note \p this object is the xmlHttp object.
     */
    function OnStateChangedSubmit()
    {
        if (this.readyState == 4)
        {
            // Update view
            var xmlDoc = this.responseXML;
            //alert((new XMLSerializer()).serializeToString(xmlDoc));
            var item = xmlDoc.firstChild; // xmlDoc -> row
            var table = item.getAttribute("table");
            var id = item.getAttribute("id");
            View.ShowEdit(table, id);

            // An item has changed, reload the data.
            View.LoadViewAfterEdit(item);
            ItemBarAll.OnInput();
        }
    };

    /**
     * Called when an item has been edited and closed.
     * 
     * @note \p this object is the xmlHttp object.
     */
    function OnStateChangedSubmitClose()
    {
        if (this.readyState == 4)
        {
            // Update view
            var xmlDoc = this.responseXML;

            View.SetEditElementVisible(false);
            // An item has changed, reload the data.
            View.LoadViewAfterEdit(xmlDoc.firstChild); // xmlDoc -> row
            ItemBarAll.OnInput();
        }
    };

    function LoadLinksAndShowBar(table, id)
    {
        ItemBarLinks.LoadLinks(table, id, function(_)
        {
            $('#divLinksHeader').css("visibility", "visible");
            $('#divLinksItems').css("visibility", "visible");
            ItemBarLinks.SetVisible(true);
        });

        document.getElementById('editLinkInfo').innerHTML = '';
    }

    /**
     * @brief Creates a link directly between the given item and the currently edited item
     */
    function SubmitNewLinkCurrentEdit(table, id)
    {
        if (mThis.GetEditElementVisible())
        {
            var xmlHttp = My.GetXMLHttpObject();
            if (xmlHttp == null) return;
            if (mThis.mEditElementTable == null) return;
            if (table == mThis.mEditElementTable && id == mThis.mEditElementItemID)
            {
                alert('Link to itself not allowed.');
                return;
            }
            // Build parameter string.
            var xml = '<?xml version="1.0" encoding="utf-8"?>'
                + '<row table1="' + table + '" table1_item_id="' + id + '" table2="' + mThis.mEditElementTable + '" table2_item_id="' + mThis.mEditElementItemID + '"/>';
            My.SendPOSTRequest(xmlHttp, "./php/new_link.php", xml, function()
            {
                if (xmlHttp.readyState == 4)
                {
                    // Update divLink
                    if (View.GetEditElementVisible())
                    {
                        LoadLinksAndShowBar(View.mEditElementTable, View.mEditElementItemID);
                    }
                    // Update view if the link has changed item display properties.
                    var xmlDoc = this.responseXML;
                    var categoryOrPlaceModified = xmlDoc.firstChild.getAttribute("category_or_place_modified");
                    if (categoryOrPlaceModified == 1)
                    {
                        View.LoadViewCurrentlyViewedTimestamp();
                    }
                }
            });
        }
    };

    /**
     * @brief Switches the view if the edit/new time is not on the current page.
     */
    function TimeStampDifferenceURI(editTime)
    {
        var currentTime;
        if (location.search == '')
        {
            currentTime = Math.floor((new Date()).getTime() / 1000);
        } else
        {
            parList = My.URIParameterList(location.search);
            currentTime = parList["date"];
        }
        var diff = editTime - currentTime;
        var uri;
        if (diff > 0 && diff < (5 * 7 * 24 * 3600))
        { // less than 5 weeks difference
            uri = (location.search == '') ? "" : "&viewDate=" + currentTime;
        }
        else
        {
            uri = "&viewDate=" + editTime;
        }
        return uri;
    };

    function BuildShowNewCall(currentDate, currentTimestamp, todayTimestamp, currentTime)
    {
        return 'View.ShowNew(\'' + My.GetFullDate(currentDate) + '\',\''
            + ((currentTimestamp == todayTimestamp) ? currentTime : '12:00') + '\');';
    }
    // =============================================================================================
    // ================================= Privileged ================================================
    // =============================================================================================
    this.Initialize = function()
    {
        console.log('Initialize')
        var currentDate = new Date();
        this.AddView(currentDate, currentDate);
        ItemBarAll.Initialize();
        ItemBarLinks.Initialize();

        this.SetEditElementVisible(false);

        $("#divView").scroll(function(e)
        {
            if (View.mAddingData) return;

            var weekLast = $("#" + WeekLastId);

            if ($("#divView").scrollTop() < View.mWeekScrollLoadLimit)
            {
                console.log('First is in Scroll')
                View.AddViewRange(View.mFirstWeekTimestamp - mWeekPadding * mOneWeek, View.mFirstWeekTimestamp - mOneDay, null)
            }

            var weekLastOffset = weekLast.offset();
            if (weekLastOffset == undefined) return false;

            if (weekLastOffset.top - $("#divView").height() < View.mWeekScrollLoadLimit)
            {
                console.log('Last is in Scroll')
                View.AddViewRange(View.mLastWeekTimestamp + mOneWeek, View.mLastWeekTimestamp + mWeekPadding * mOneWeek + 6 * mOneDay, null)
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

        return "  <table class='window'>"
            + "    <tr class='windowContent'>"
            + "      <td class='window' colspan='5'>"
            + "        <table class='" + table + " fillWidth'>"
            + code
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


    /**
     * Resets the view and loads the view for <date>.
     */
    this.LoadView = function(date)
    {
        this.mDayData = {};
        this.AddView(date, date);
    }

    this.UpdateCurrentlyViewedTimestamp = function()
    {
        var scroll = $("#divView").scrollTop();
        var weeks = Math.floor(scroll / this.mOneWeekHeight);
        this.mCurrentlyViewedTimestamp = this.mFirstWeekTimestamp + weeks * mOneWeek;
        this.mCurrentlyViewedTimestampScrollOffset = scroll - weeks * this.mOneWeekHeight;
        return scroll;
    }

    this.GlobalFilterChanged = function()
    {
        ItemBarAll.OnInput();
        ItemBarLinks.OnInput();
        View.LoadViewCurrentlyViewedTimestamp();
    }

    /**
     * Resets the view and loads the view for <date>.
     */
    this.LoadViewCurrentlyViewedTimestamp = function()
    {
        this.mDayData = {};
        this.UpdateCurrentlyViewedTimestamp();
        this.AddView(new Date(this.mCurrentlyViewedTimestamp), null);
    }

    this.LoadViewAfterEdit = function(item)
    {
        var date = item.getAttribute("date");
        if (date == null)
        {
            // Go to the last viewed date
            this.LoadViewCurrentlyViewedTimestamp();
        }
        else
        {
            this.LoadView(new Date(date));
            console.log('Go to new date ' + date);
        }
    }

    /**
     * Adds view content for <date>.
     */
    this.AddView = function(date, goToDate)
    {
        // Set timestamp time to 00:00:00
        var timestampStart = My.GetWeekStart(My.GetFullDayDate(date)) - mWeekPadding * mOneWeek;
        var timestampEnd = timestampStart + mWeekPadding * 2 * mOneWeek + 6 * mOneDay;
        if (!Number.isInteger(timestampStart) || !Number.isInteger(timestampEnd))
        {
            debugger;
        }
        this.AddViewRange(timestampStart, timestampEnd, goToDate);
    }

    /**
     * @brief Add view data. If <date> (of type Date) is not null, this date will be display. 
     */
    this.AddViewRange = function(timestampStart, timestampEnd, goToDate)
    {
        var xmlHttp = My.GetXMLHttpObject();
        if (xmlHttp == null) return;
        var minImportance = $('#minimumImportance')[0].valueAsNumber;
        var showNotes = $('#showNotes')[0].checked;
        var xml = '<?xml version="1.0" encoding="utf-8"?>\n<row dateStart="' + timestampStart + '" dateEnd="' + timestampEnd + '" minImportance="' + minImportance + '" showNotes="' + showNotes + '"/>';

        this.mAddingData = true;
        My.SendPOSTRequest(xmlHttp, "./php/read_view.php", xml, function()
        {
            if (xmlHttp.readyState == 4)
            {
                View.AddData(xmlHttp.responseXML);
                View.mAddingData = false;
                View.RedrawView(goToDate);
            }
        });
    };

    this.OnEnterKeySearch = function(table, id)
    {
        if (View.GetEditElementVisible())
        {
            SubmitNewLinkCurrentEdit(table, id);
        }
        else
        {
            View.ShowEdit(table, id);
        }
    };

    this.OnMouseUpBox = function(event, table, id, divClass)
    {
        event = event || window.event;

        var rightClick = false;
        if (event.which)
        {
            // Firefox
            rightClick = (event.which == 3);
        }
        else if (event.button)
        {
            // IE
            rightClick = (event.button == 2);
        }
        if (rightClick)
        {
            if (View.GetEditElementVisible())
            {
                // Directly add link for current item
                SubmitNewLinkCurrentEdit(table, id);
            }
        }
        else
        {
            // Left click
            View.ShowEdit(table, id);
        }
    };

    this.AddData = function(xml)
    {
        var tables = xml.getElementsByTagName("table");
        var dateStart = parseInt(xml.firstChild.getAttribute("date_start"));
        var dateEnd = parseInt(xml.firstChild.getAttribute("date_end"));

        console.log("AddData for " + new Date(dateStart) + " to " + new Date(dateEnd));

        // Create entries for all days from start to end

        for (var timestamp = dateStart; timestamp <= dateEnd; timestamp += mOneDay)
        {
            if (!(timestamp in this.mDayData))
            {
                this.mDayData[timestamp] = new DayData();
            }
        }

        // Sort the data into the 'dayCode' array first. They will later be drawn in a certain oder.
        for (var i = 0; i < tables.length; i++)
        {
            var tableName = tables[i].getAttribute("name");
            var items = tables[i].childNodes;
            // Go through all items of the table.
            for (var j = 0; j < items.length; j++)
            {
                var id = items[j].getAttribute("id");
                var category = items[j].getAttribute("category");

                switch (tableName)
                {
                    case "day":
                        {
                            var fromDay = My.SQLDate2JSTimeStamp(items[j].getAttribute("from_date"));
                            var toDay = My.SQLDate2JSTimeStamp(items[j].getAttribute("to_date"));

                            var dayCagegoryDisplayText = My.GetDayCategoriesDisplayText()[category];
                            // Fill code for relevant days.
                            for (var timestamp = fromDay; timestamp <= toDay && timestamp in this.mDayData; timestamp += mOneDay)
                            {
                                this.mDayData[timestamp].Days.push(new ItemData(tableName, id, dayCagegoryDisplayText, category));
                                this.mDayData[timestamp].DivClass = category;
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
                            if (items[j].getAttribute("has_place"))
                            {
                                text = "● " + text;
                            }
                            // Get time and dates

                            var fromDate = My.SQLDate2JSTimeStamp(items[j].getAttribute("from_date"));
                            var fromTime = items[j].getAttribute("from_time");
                            var toDate = My.SQLDate2JSTimeStamp(items[j].getAttribute("to_date"));
                            var toTime = items[j].getAttribute("to_time");

                            // Fill code for relevant days.
                            for (var timestamp = fromDate; timestamp <= toDate && timestamp in this.mDayData; timestamp += mOneDay)
                            {
                                this.mDayData[timestamp].Events.push(new EventItemData(tableName, id, text, category + importance, fromDate, fromTime, toDate, toTime));
                            }
                        }
                        break;
                    case "person":
                        {
                            var dayTimestamp = My.SQLDate2JSTimeStamp(items[j].getAttribute("date"));
                            var importance = items[j].getAttribute("importance");
                            var text = items[j].childNodes[0].firstChild.nodeValue;
                            this.mDayData[dayTimestamp].Persons.push(new ItemData(tableName, id, text, category + importance));
                        }
                        break;
                    case "note":
                        {
                            var dayTimestamp = My.SQLDate2JSTimeStamp(items[j].getAttribute("date"));
                            var importance = items[j].getAttribute("importance");
                            var text = items[j].childNodes[0].firstChild.nodeValue;
                            // Fill code for relevant day.
                            this.mDayData[dayTimestamp].Notes.push(new ItemData(tableName, id, text, category + importance));
                        }
                        break;
                }
            }
        }
    }

    this.BuildViewHtml = function()
    {
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

        for (var i = 0; i < keys.length; i += 7)
        {
            // Build a week
            var weekStartTimestamp = parseInt(keys[i]);
            var weekStartDate = new Date(weekStartTimestamp);

            var divId = "";
            if (i == 0)
            {
                this.mFirstWeekTimestamp = weekStartTimestamp
            }
            if (i + 7 >= keys.length)
            {
                divId = "id=" + WeekLastId + " ";
                this.mLastWeekTimestamp = weekStartTimestamp
            }

            // Build month column
            var month = weekStartDate.getMonth();
            code += "<div " + divId
                + "class='monthBarOneMonth' style='background-color: " + monthColors[month] + ";'>"
                + "<div style='height: 100px;'></div><div class='monthBarText'>"
                + monthNames[month] // Month name
                + "<span style='color: #909090; margin-left: 12px;'>" + weekStartDate.getFullYear() + "</span>" // Year
                + "</div></div>";

            // Day dates
            for (var day = 0; day < 7; day++)
            {
                var dayTimestamp = weekStartTimestamp + mOneDay * day;
                var dayTableData = dayTimestamp in this.mDayData ? this.mDayData[dayTimestamp] : undefined;

                var dayDate = new Date(dayTimestamp);
                var showNewCode = BuildShowNewCall(dayDate, dayTimestamp, todayTimestamp, currentTime);

                var divClass = '';
                if (dayTimestamp == todayTimestamp)
                {
                    divClass = " dayBodyToday";
                }
                if (dayTableData != undefined && dayTableData.DivClass != "")
                {
                    // If there is an entry in the 'day' table, get color scheme for that entry.   
                    divClass += " dayBody_" + dayTableData.DivClass;
                }
                else if (day > 4)
                {
                    divClass += " dayBodyWeekend";
                }

                code += '<div class="dayBody' + divClass + '" onclick="' + showNewCode + '">';
                code += (dayDate.getMonth() == todayDate.getMonth()
                    ? '<div class="dayHeader" onclick="' + showNewCode + '">'
                    : '<div class="dayHeader dayHeaderOtherMonth" onclick="' + showNewCode + '">');
                dateDay = dayDate.getDate();
                code += dateDay;
                if (dateDay == 1)
                {
                    code += " " + monthNames[dayDate.getMonth()];
                }
                if (dayTableData != undefined)
                {
                    dayTableData.Days.forEach(item =>
                    {
                        code += BuildDayBox(item);
                    });
                }
                code += '</div>';


                // Container for the whole day
                // Click area of day to create new entry
                var showNewCode = BuildShowNewCall(dayDate, dayTimestamp, todayTimestamp, currentTime);

                // Insert elements for this day
                if (dayTableData != undefined)
                {
                    code += '<div class="dayContent">';

                    // Add persons and notes stacked after each other, starting with a small space.
                    var top = mBoxHeight;
                    dayTableData.Persons.forEach(item =>
                    {
                        code += BuildSmallBoxStacked(item, top);
                        top += mBoxHeight;
                    });
                    dayTableData.Notes.forEach(item =>
                    {
                        code += BuildSmallBoxStacked(item, top);
                        top += mBoxHeight;
                    });

                    // Add events
                    top += mBoxHeight;
                    dayTableData.Events.forEach(item =>
                    {
                        if (item.FromTime == "00:00:00" && item.ToTime == "00:00:00")
                        {
                            // No time was set for this item - draw it as a stacked box.
                            code += BuildSmallBoxStacked(item, top);
                            top += mBoxHeight;
                        }
                        else
                        {
                            // Draw event with top and height indicating the time.
                            code += BuildSmallBoxEvent(item, dayTimestamp);
                        }
                    });
                    code += '</div>';
                }
                code += "</div>";
            }
            code += "</tr>";
            code += "</div>";
        }

        $("#divView").html(code);

        // If this was the first html draw operation, save the height and padding values.
        if (this.mOneWeekHeight == 0)
        {
            this.mOneWeekHeight = $(".monthBarOneMonth:first").height()
            this.mWeekScrollLoadLimit = mWeekPadding * View.mOneWeekHeight / 2;
            console.log('mOneWeekHeight: ' + View.mOneWeekHeight)
            console.log('mWeekScrollLoadLimit: ' + View.mWeekScrollLoadLimit)
        }
    }

    /**
     * @param goToDate If null, the view will keep the currently vieded date. Otherwise, it will go to this date
     */
    this.RedrawView = function(goToDate)
    {
        if (this.mDayData == null) return;

        if (goToDate == null)
        {
            var oldScroll = this.UpdateCurrentlyViewedTimestamp();
            this.BuildViewHtml();

            console.log('Go to viewed date ' + new Date(this.mCurrentlyViewedTimestamp));

            var diffWeeks = (this.mCurrentlyViewedTimestamp - this.mFirstWeekTimestamp) / mOneWeek;
            var scrollOffset = Math.floor(diffWeeks) * this.mOneWeekHeight + oldScroll % this.mOneWeekHeight;
            $("#divView").scrollTop(scrollOffset);
        }
        else
        {
            this.BuildViewHtml();

            console.log('Go to date ' + goToDate);

            var goToTimestamp = goToDate.getTime();
            var diffWeeks = (goToTimestamp - this.mFirstWeekTimestamp) / mOneWeek;
            var scrollOffset = Math.floor(diffWeeks) * this.mOneWeekHeight;
            $("#divView").scrollTop(scrollOffset);
        }
    };

    this.SetEditElementVisible = function(visible)
    {
        var editElement = document.getElementById('editElement');
        mEditElementVisible = visible;

        // Hide links and search bar. They will be loaded again when an edit 
        // view is shown.
        $('#divLinksHeader').css("visibility", "hidden");
        $('#divLinksItems').css("visibility", "hidden");
        ItemBarLinks.SetVisible(false);

        if (visible)
        {
            editElement.style.display = 'grid';
            $('#divSearchButton').html('Link');
        }
        else
        {
            editElement.style.display = 'none';
            $('#divSearchButton').html('Go');
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

    this.ShowAddLinkInfo = function(linkId, linkText)
    {
        var obj = document.getElementById('editLinkInfo');
        // Drop-down for categories                        
        var linkInfoTypes = My.GetLinkInfoTypesDisplayText();
        var code = "<span>" + linkText + "</span><select id='input_linkinfo_type' size='1'>";
        for (var key in linkInfoTypes)
        {
            code += "        <option value='" + key + "' >" + linkInfoTypes[key] + "</option>";
        };
        code += "      </select>";
        // Link info text
        code += " <input id='input_linkinfo_text' value='' maxLength='255' class='fillCell'/>"
            + "   <a class='button' onclick='return View.SubmitAddLinkInfo(" + linkId + ")' href='#'>Add</a>";
        obj.innerHTML = code;
        return false; // Do not follow href after this.
    }

    this.ShowNew = function(date, time)
    {
        // Show edit box.
        this.mEditElementItemID = 0;
        var obj = document.getElementById('editElementContent');
        obj.innerHTML = BuildNew("event", date, time);
        View.SetEditElementVisible(true);
    };

    this.SubmitDelete = function(table, id)
    {
        var confirmDelete = confirm("Really delete item?");
        if (confirmDelete)
        {
            var xmlHttp = My.GetXMLHttpObject();
            if (xmlHttp == null) return false;
            var xml = '<?xml version="1.0" encoding="utf-8"?>\n<row table="' + table + '" id="' + id + '"/>';
            My.SendPOSTRequest(xmlHttp, "./php/delete.php", xml, OnStateChangedSubmitClose);
        }
        return false; // Do not follow href after this.
    };

    this.SubmitDeleteLink = function(linkId)
    {
        var confirmDelete = confirm("Really delete link?");
        if (confirmDelete)
        {
            var xmlHttp = My.GetXMLHttpObject();
            if (xmlHttp == null) return false;
            var xml = '<?xml version="1.0" encoding="utf-8"?>\n<row link_id="' + linkId + '"/>';
            My.SendPOSTRequest(xmlHttp, "./php/delete_link.php", xml, function()
            {
                if (xmlHttp.readyState == 4)
                {
                    // Update divLink
                    if (View.GetEditElementVisible())
                    {
                        LoadLinksAndShowBar(View.mEditElementTable, View.mEditElementItemID);
                    }
                }
            });
        }
        return false; // Do not follow href after this.
    };

    this.SubmitAddLinkInfo = function(linkId)
    {
        var linkText = My.HtmlSpecialChars(document.getElementById('input_linkinfo_text').value);

        var xmlHttp = My.GetXMLHttpObject();
        if (xmlHttp == null) return false;
        var xml = '<?xml version="1.0" encoding="utf-8"?>\n<row link_id="' + linkId + '" text="' + linkText + '">'
            + '  <type>' + document.getElementById('input_linkinfo_type').value + '</type>'
            + '</row>';
        My.SendPOSTRequest(xmlHttp, "./php/new_linkinfo.php", xml, function()
        {
            if (xmlHttp.readyState == 4)
            {
                // Update divLink
                if (View.GetEditElementVisible())
                {
                    LoadLinksAndShowBar(View.mEditElementTable, View.mEditElementItemID);
                }
            }
        });
        return false; // Do not follow href after this.
    };

    this.SubmitDeleteLinkInfo = function(linkInfoId)
    {
        var confirmDelete = confirm("Really delete link info?");
        if (confirmDelete)
        {
            var xmlHttp = My.GetXMLHttpObject();
            if (xmlHttp == null) return false;
            var xml = '<?xml version="1.0" encoding="utf-8"?>\n<row linkinfo_id="' + linkInfoId + '"/>';
            My.SendPOSTRequest(xmlHttp, "./php/delete_linkinfo.php", xml, function()
            {
                if (xmlHttp.readyState == 4)
                {
                    // Update divLink
                    if (View.GetEditElementVisible())
                    {
                        LoadLinksAndShowBar(View.mEditElementTable, View.mEditElementItemID);
                    }
                }
            });
        }
        return false; // Do not follow href after this.
    };

    this.SubmitEdit = function(table, id, saveAndClose)
    {
        if (!Table[table].CheckEditNewInput())
        {
            return false;
        }
        var xmlHttp = My.GetXMLHttpObject();
        if (xmlHttp == null) return false;
        // Build parameter string
        var xml = Table[table].GetPOSTRequestRow(id);
        if (saveAndClose)
        {
            My.SendPOSTRequest(xmlHttp, "./php/edit.php", xml, OnStateChangedSubmitClose);
        }
        else
        {
            My.SendPOSTRequest(xmlHttp, "./php/edit.php", xml, OnStateChangedSubmit);
        }
        return false; // Do not follow href after this.
    };

    this.SubmitNew = function(table, saveAndClose)
    {
        if (!Table[table].CheckEditNewInput())
        {
            return;
        }
        var xmlHttp = My.GetXMLHttpObject();
        if (xmlHttp == null) return;
        // Build parameter string
        var xml = Table[table].GetPOSTRequestRow('');
        if (saveAndClose)
        {
            My.SendPOSTRequest(xmlHttp, "./php/new.php", xml, OnStateChangedSubmitClose);
        }
        else
        {
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