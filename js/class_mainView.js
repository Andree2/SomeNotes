﻿﻿﻿﻿﻿﻿﻿function MainView()
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
	var mShowPersonsTagged = true;
	
	var mThis = this; // For acces to 'this' in private function ('this' is not set correctly there).
	
	this.mXMLDocView = null;
	
	
		
	//TODO: xml output: Viele items auf attributes umstellen
	
	// =============================================================================================
	// ================================= Private ===================================================
	// =============================================================================================
	// ---------------------------------------------------------------------------------------------
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
		              + "     </td>";

		return "   <table class='window'>"
		     + "   <tr class='windowBar'>"
		     + switchNewCode
		     + "       <td class='windowBar' align='right'>"
		     + "         <a class='button' style='width: 20px;' onclick='return View.SetDivEditVisible(false)' href='#'>X</a>"
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
	// ---------------------------------------------------------------------------------------------
	function BuildSmallBox (table, id, text, importance, category, width, maxHeight)
	{
		var colorScheme = ColorSchemes.GetScheme(table, category, importance);
		// Create boxes for a certain day
		return '<div class="smallBox '+ colorScheme
			+'" style="width: '+ width +'; max-height: '+  maxHeight +'px;"'
			+'" onmouseup="View.OnMouseUpBox(\''+ table +'\', '+ id +')">'+ My.HtmlSpecialChars(text) +'</div>';
	};
	// ---------------------------------------------------------------------------------------------
	function CurrentDay()
	{
		var now = new Date();

		var d = (now.getDate() < 10 ? '0' + now.getDate() : now.getDate());
		var m =   (now.getMonth() < 10 ? '0' + (now.getMonth() + 1)
		                               : (now.getMonth() + 1));

		return d + "." + m + "." + now.getFullYear();
	};
	// ---------------------------------------------------------------------------------------------
	function CurrentTime()
	{
		var now = new Date();

		var h = (now.getHours() < 10 ? '0' + now.getHours() : now.getHours());
		var m = (now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes());
		var s = (now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds());

		return h + ":" + m + ":" + s;
	};
	// ---------------------------------------------------------------------------------------------
	/**
	 * @brief Changed the selected day by \p offsets and reloads the page.
	 */
	function LoadViewDayOffset(dayOffset)
	{
		mDateStart += mOneDay * dayOffset;
		View.LoadView(null);
	};
	// -------------------------------------------------------------------------------------------
	/**
	 * @note \p this object is the xmlHttp object.
	 */
	function OnStateChangedLoadLinks()
	{
		if (this.readyState == 4) {
			ItemBarLinks.SetXMLDoc(this.responseXML);
			ItemBarLinks.Redraw();
		}
	};
	// ---------------------------------------------------------------------------------------------
	/**
	 * @note \p this object is the xmlHttp object.
	 */
	function OnStateChangedLoadPersons()
	{
		if (this.readyState == 4) {
			// For testing xmlDoc
			//alert(xmlDoc);
			//alert((new XMLSerializer()).serializeToString(xmlDoc.documentElement));
			
			ItemBarPersons.SetXMLDoc(this.responseXML);
			ItemBarPersons.Redraw();
		}
	};
	// ---------------------------------------------------------------------------------------------
	/**
	 * @note \p 'this' object is the xmlHttp object.
	 */
	function OnStateChangedLoadTags()
	{
		if (this.readyState == 4) {
			//alert(xmlDoc);
			//alert((new XMLSerializer()).serializeToString(this.responseXML.documentElement));
			ItemBarTags.SetXMLDoc(this.responseXML);
			ItemBarTags.Redraw();
		}
	};
	// ---------------------------------------------------------------------------------------------
	/**
	 * @note \p 'this' object is the xmlHttp object.
	 */
	function OnStateChangedLoadToDo()
	{
		if (this.readyState == 4) {
			//alert(xmlDoc);
			//alert((new XMLSerializer()).serializeToString(this.responseXML.documentElement));
			ItemBarToDo.SetXMLDoc(this.responseXML);
			ItemBarToDo.Redraw();
		}
	};
	// ---------------------------------------------------------------------------------------------
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
	// -------------------------------------------------------------------------------------------
	/**
	 * @note \p this object is the xmlHttp object.
	 */
	function OnStateChangedShowEdit()
	{
		if (this.readyState == 4) {
			var xmlDoc = this.responseXML;

			var objDivEdit = document.getElementById('divEdit');
			objDivEdit.innerHTML = View.BuildEdit(xmlDoc);
			View.SetDivEditVisible(true);

			var itemObj = xmlDoc.getElementsByTagName("item")[0];
			View.mDivEditTable = itemObj.getElementsByTagName("table")[0].firstChild.nodeValue;
			View.mDivEditItemID = itemObj.getElementsByTagName("id")[0].firstChild.nodeValue;
		}
	};
	// -------------------------------------------------------------------------------------------
	/**
	 * @note \p this object is the xmlHttp object.
	 */
	function OnStateChangedSubmitEditNew()
	{
		if (this.readyState == 4) {
			// Update view
			var xmlDoc = this.responseXML;
			var table = xmlDoc.firstChild.getAttribute("table");
			var id = xmlDoc.firstChild.getAttribute("id");
			var date = xmlDoc.firstChild.getAttribute("date");
			if (date != null) {
				date = My.DateDDMMYYYYToDate(date);
			}
			View.ShowEdit(table, id);
			// Update view
			View.LoadView(date);
			View.LoadTags();
			View.LoadPersons();
		}
	};
	// -------------------------------------------------------------------------------------------
	/**
	 * @note \p this object is the xmlHttp object.
	 */
	function OnStateChangedSubmitEditNewClose()
	{
		if (this.readyState == 4) {
			var xmlDoc = this.responseXML;
			// For testing xmlDoc
			//alert(xmlDoc);
			//alert((new XMLSerializer()).serializeToString(xmlDoc));
			var date = xmlDoc.firstChild.getAttribute("date");
			if (date != null) {
				date = My.DateDDMMYYYYToDate(date);
			}
			// Update view
			View.SetDivEditVisible(false);
			
			View.LoadView(date);
			View.LoadTags();
			View.LoadPersons();
		}
	};
	// -------------------------------------------------------------------------------------------
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
	// -------------------------------------------------------------------------------------------
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
			         +'<row table1_id="'+ table +'" table1_item_id="'+ itemID +'" table2_id="'+ mThis.mDivEditTable +'" table2_item_id="'+ mThis.mDivEditItemID +'"/>';
			My.SendPOSTRequest(xmlHttp, "./php/new_link.php", xml, OnStateChangedSubmitNewLink);
		}
	};
	// -------------------------------------------------------------------------------------------
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
	// ---------------------------------------------------------------------------------------------	
	// =============================================================================================
	// ================================= Privileged ================================================
	// =============================================================================================
	this.BuildEdit = function(xmlDoc)
	{
		var itemObj = xmlDoc.getElementsByTagName("item")[0];
		var table = itemObj.getElementsByTagName("table")[0].firstChild.nodeValue;
		var id = itemObj.getElementsByTagName("id")[0].firstChild.nodeValue;
		var lastChanged = itemObj.getElementsByTagName("last_changed")[0].firstChild.nodeValue;
		var code = Table[table].BuildEditFromXML(itemObj);

		return   "  <table class='window'>"
		       + "    <tr class='windowBar'>"
		       + "      <td class='windowBar' colspan='6' align='right'>"
		       + "      </td>"
		       + "      <td class='windowBar' align='right'>"
		       + "        <a class='button' style='width: 20px;' onclick='return View.SetDivEditVisible(false)' href='#'>X</a>"
		       + "      </td>"
		       + "    </tr>"
		       + "    <tr>"
		       + "      <td class='window' colspan='7'>"
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
		       + "      <td class='windowBar' align='right'>Last changed</td>"
		       + "      <td class='windowBar'><input name='editLastChanged' type='text' class='readonly' readonly value='"
		       + lastChanged + "' size='16'/></td>"
		       + "      <td class='windowBar'>"
		       + "        <a class='button' onclick='return View.SubmitDelete(\""
		       + table + "\", " + id + ")' href='#'>Delete</a>"
		       + "      </td>"
		       + "      <td class='windowBar' align='right'>"
		       + "        <a class='button' onclick='return View.SubmitEdit(\""
		       + table + "\", " + id + ", false)' href='#'>Save</a>"
		       + "      </td>"
		       + "      <td class='windowBar' align='right'>"
		       + "        <a class='button' onclick='return View.SubmitEdit(\""
		       + table + "\", " + id + ", true)' href='#'>Save & Close</a>"
		       + "      </td>"
		       + "    </tr>"
		       + "  </table>";
	};
	// -------------------------------------------------------------------------------------------
	this.GetDivEditVisible = function()
	{		
		return mDivEditVisible;
	};
	// -------------------------------------------------------------------------------------------
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
	// ---------------------------------------------------------------------------------------------
	this.LoadPersons = function()
	{
		var xmlHttp = My.GetXMLHttpObject();
		if (xmlHttp == null) return;
		url = "";
		if (mShowPersonsTagged) {
			url = "php/read_persons_tagged.php";
			url += "?sid=" + Math.random();
		}
		else {
			if (xmlHttp == null) return;
			url = "php/read_persons.php";
			url += "?sid=" + Math.random();
		}
		xmlHttp.onreadystatechange = OnStateChangedLoadPersons;
		xmlHttp.open("GET",url,true);
		//window.open(url); //For testing XML output
		xmlHttp.send(null);
	};
	// ---------------------------------------------------------------------------------------------
	this.LoadTags = function()
	{	
		var xmlHttp = My.GetXMLHttpObject();
		if (xmlHttp == null) return;
		url = "php/read_tags.php";
		url = url + "?sid=" + Math.random();
		xmlHttp.onreadystatechange = OnStateChangedLoadTags;
		xmlHttp.open("GET",url,true);
		//window.open(url) //For testing XML output
		xmlHttp.send(null);
	};
	// ---------------------------------------------------------------------------------------------
	this.LoadToDo = function()
	{	
		var xmlHttp = My.GetXMLHttpObject();
		if (xmlHttp == null)
			return;
		var url = "php/read_links.php";
		url = url + "?table=tag";
		url = url + "&id=16";
		url = url + "&sid=" + Math.random();
		xmlHttp.onreadystatechange = OnStateChangedLoadToDo;
		xmlHttp.open("GET", url, true);
		//window.open(url) //For testing XML output
		xmlHttp.send(null);
	};
	// ---------------------------------------------------------------------------------------------
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
	// ---------------------------------------------------------------------------------------------
	this.OnEventContextMenu = function(event)
	{
		return false;
	};
	// ---------------------------------------------------------------------------------------------
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
	// ------------------------------------------------------------------------------------------
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
			if (this.GetDivEditVisible()) {
				// Directly add link for current item
				SubmitNewLinkCurrentEdit(table, id);
			}
		}
		else { // Left click			
			View.ShowEdit(table, id);
		}
	};
	// ---------------------------------------------------------------------------------------------	
	this.RedrawView = function()
	{
		if (this.mXMLDocView == null) return;
		var tables = this.mXMLDocView.getElementsByTagName("table");
		var dayCode = new Array(7 * mNumRows);
		var maxBoxHeight = 2 * mBoxHeight;
		var totalNumDays = dayCode.length;
		var monthBarSizes = new Array();
		var selectedTimestamp = mSelectedDate.getTime();

		var todayTimestamp = My.GetFullDayDate(new Date()).getTime();
		var currentTime = My.GetFullTime(new Date());
		var monthNames = new Array("January", "February", "March", "April", "May", "June",
		                           "July", "August", "September", "October", "November", "December");
		var monthColors = new Array("#C0C0FF", "#A0A0EE", "#90E4B4", "#A0FFA0", "#FFC098", "#FFAAAA",
		                            "#EEEE90", "#B2E0B2", "#EAB4B4", "#B0B0B0", "#D4D4D4", "#F0F0F0");

		for (var i = 0; i < dayCode.length; i++) {
			// Table order for view is: Event, Person, Note
			dayCode[i] = new Array("","","");
		}
		for (var i = 0; i < tables.length; i++) {
			var tableName = tables[i].getAttribute("name");
			var tableIndex = 0;
			switch (tableName) {
				case "event": tableIndex = 0; break;
				case "note":  tableIndex = 2; break;
				case "person":  tableIndex = 1; break;
			}
			var items = tables[i].childNodes;
			for (var j = 0; j < items.length; j++) {
				var id = items[j].getAttribute("id");
				var dateJSTimeStamp = My.SQLDate2JSTimeStamp(items[j].childNodes[0].firstChild.nodeValue);
				var dateIndex = (dateJSTimeStamp - mDateStart) / mOneDay;
				
				var text = items[j].childNodes[1].firstChild.nodeValue;
				var importance = items[j].childNodes[2].firstChild.nodeValue;
				var category = items[j].childNodes[3].firstChild.nodeValue;
				// Create boxes for a certain day		
				if (tableIndex == 0) {
					// EVENT table has additional options for the end date
					// size = endDate - startDate in days
					var numDays = (My.SQLDate2JSTimeStamp(items[j].childNodes[4].firstChild.nodeValue) - dateJSTimeStamp) / mOneDay + 1;
					var endTime = items[j].childNodes[5].firstChild.nodeValue;
					// When the endtime is before 05:00 AM, the event will not be shown at that end day.
					var endHour = endTime.substr(0, 2);
					if (endHour < 5) {
					  numDays -= 1;
					}
					numDays = Math.max(numDays, 1); // An entry with 'zero' duration is still shown
					var eventDateIndex = dateIndex;
					var maxDateIndex = mNumRows * 7;
					while (numDays > 0 && eventDateIndex < maxDateIndex) {
						dayCode[eventDateIndex][tableIndex] += BuildSmallBox(tableName, id, text, importance, category, '100%', maxBoxHeight);
						numDays -= 1;
						eventDateIndex += 1;

						// Obsolete, used when the box was extended to multple days:
						//var useDaysThisRow = Math.min(7 - eventDateIndex % 7, numDays); // 7 - dateIndex % 7 == free days this row.
						//while (useDaysThisRow > 1) {
						//	// Insert copies in the following day with 'extended' width
						//	eventDateIndex += 1;
						//	useDaysThisRow -= 1;
						//	dayCode[eventDateIndex][tableIndex] += BuildSmallBox(tableName, id, text, importance, category, mDayCellWidth - 2 + 'px', maxBoxHeight);
						//}
					}
				}
				else {
					dayCode[dateIndex][tableIndex] += BuildSmallBox(tableName, id, text, importance, category, '100%', maxBoxHeight);	
				}
			}
		}
		// Generate code	
		// Header: Week day names
		var code = "<table class='view'>"
				+ "<tr class='weekDayHeader'>"
				+ "<td>Mo</td><td>Di</td><td>Mi</td><td>Do</td><td>Fr</td><td>Sa</td><td>So</td>"
				+ "</tr>";
		var currentTimestamp = mDateStart;
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
				for (var tableIndex = 0; tableIndex < 3; tableIndex++) {
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
	// -------------------------------------------------------------------------------------------
	this.SetDivEditVisible = function(visible)
	{
		var obj = document.getElementById('divEdit');
		mDivEditVisible = visible;
		if (visible) {
			obj.style.visibility = 'visible';
		}
		else {
			obj.style.visibility = 'hidden';
			obj.innerHTML = '';
			if (mActiveCell != '') {
				mActiveCell.style.backgroundColor = mActiveCellBackground;
			}
			ItemBarLinks.SetVisible(false);
		}
		return false; // Do not follow href after this.
	};
	// ---------------------------------------------------------------------------------------------
	this.SetShowPersonsTagged = function(showPersonsTagged)
	{
		mShowPersonsTagged = showPersonsTagged;
		this.LoadPersons();
		return false; // Do not follow href after this.
	};
	// ---------------------------------------------------------------------------------------------
	this.SetStatusBar = function(text)
	{
		var divStatusBar = document.getElementById('divStatusBar');
		divStatusBar.innerHTML = text;
	};
	// -------------------------------------------------------------------------------------------
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
		//window.open(url) //For testing XML output
		xmlHttp.send(null);
		ItemBarLinks.SetVisible(true);
		
		View.LoadLinks(table, id);
	};
	// ------------------------------------------------------------------------------------------
	this.ShowNew = function(senderID, date, time)
	{
		// Reset color of active cell (if other cell was still active).
		if (mActiveCell != '') {
			mActiveCell.style.backgroundColor = mActiveCellBackground;
		}
		ItemBarLinks.SetVisible(false);
		// Set new active cell.
		mActiveCell = document.getElementById(senderID);
		mActiveCellBackground = mActiveCell.style.backgroundColor;
		mActiveCell.style.backgroundColor = '#F4F400';
		// Show edit box.
		this.mDivEditItemID = 0;
		var obj = document.getElementById('divEdit');
		obj.innerHTML = BuildNew("note", date, time);
		View.SetDivEditVisible(true);
		
		View.UpdatePersons();
	};
	// -------------------------------------------------------------------------------------------
	this.SubmitDelete = function(table, id)
	{
		var confirmDelete = confirm("Really delete item?");
		if (confirmDelete) {
			var xmlHttp = My.GetXMLHttpObject();
			if (xmlHttp == null) return false;
			var xml = '<?xml version="1.0" encoding="utf-8"?>\n<row table="'+table+'" id="'+id+'"></row>';
			My.SendPOSTRequest(xmlHttp, "./php/delete.php", xml, OnStateChangedSubmitEditNewClose);
		}
		return false; // Do not follow href after this.
	};
	// -------------------------------------------------------------------------------------------
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
			My.SendPOSTRequest(xmlHttp, "./php/edit.php", xml, OnStateChangedSubmitEditNewClose);
		}
		else {
			My.SendPOSTRequest(xmlHttp, "./php/edit.php", xml, OnStateChangedSubmitEditNew);
		}
		return false; // Do not follow href after this.
	};
	// -------------------------------------------------------------------------------------------
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
			My.SendPOSTRequest(xmlHttp, "./php/new.php", xml, OnStateChangedSubmitEditNewClose);
		}
		else {
			My.SendPOSTRequest(xmlHttp, "./php/new.php", xml, OnStateChangedSubmitEditNew);
		}
		return false;
	};
	// ------------------------------------------------------------------------------------------
	this.SwitchNew = function(table, date, time)
	{
		var obj = document.getElementById('divEdit');
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