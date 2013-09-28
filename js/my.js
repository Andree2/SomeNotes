var My = new function()
{
		
	function getEl(id)
	{
		return document.getElementById(id);
	};

	// *********************************
	// Start of Public  Function Library
	// *********************************
	
		// -------------------------------------------------------------------------------------------	
	   /**
	    * @brief Converts dd.mm.yyyy to a Date object.
	    */
	this.DateDDMMYYYYToDate = function(date)
	{
		parts = date.split(".");
		// new Date(Jahr, Monat (0 = januar), Tag);
		return new Date(parts[2], parts[1] - 1, parts[0]);
	};
		// -------------------------------------------------------------------------------------------	
	this.URIParameterList = function (querystring)
	{
		if (querystring == '') return;
		var parString = querystring.slice(1);
		var pairs = parString.split("&");
	   	var pair, name, value;
	   	var parList = new Object();
	   	for (var i = 0; i < pairs.length; i++) {
	   		pair 	= pairs[i].split("=");
	   		name 	= pair[0];
	   		value 	= pair[1];
	   		name 	= unescape(name).replace("+", " ");
	   		value 	= unescape(value).replace("+", " ");
	   		parList[name] = value;
	   	}
	   	return parList;
	};
	// -------------------------------------------------------------------------------------------
	this.IsEventSupported = function(eventName){
		var TAGNAMES = {
		  'select':'input','change':'input',
		  'submit':'form','reset':'form',
		  'error':'img','load':'img','abort':'img'
		};
		var el = document.createElement(TAGNAMES[eventName] || 'div');
		eventName = 'on' + eventName;
		var isSupported = (eventName in el);
		if (!isSupported) {
		  el.setAttribute(eventName, 'return;');
		  isSupported = typeof el[eventName] == 'function';
		}
		el = null;
		return isSupported;
	};
	// -------------------------------------------------------------------------------------------
	 /**
	  * @brief Returns a date that corresponds to the passed <date> (Date object) at time 00:00:00,
	  *        UTC +0 (i.e., purges all time informations).
	  */
	 this.GetFullDayDate = function(date)
	 {
		 return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
	 };
		// -------------------------------------------------------------------------------------------	
	 /**
	  * @brief Returns the time from <date> (Date object) in the format hh:mm
	  */
	 this.GetFullTime = function(date)
	{
		 var hours = date.getHours();
		 var minutes = date.getMinutes();
		 var seconds = date.getSeconds();
		 return   ((hours < 10) ? "0" + hours : hours)
		 		+ ":" + ((minutes < 10) ? "0" + minutes : minutes);
	};
	// -------------------------------------------------------------------------------------------	
	 /**
	  * @brief Returns the date from <date> (Date object) in the format YYYY-MM-DD
	  */
	this.GetFullDate = function(date)
	{
		 var day = date.getDate();
		 var month = date.getMonth();
		 var year = date.getFullYear();
		 return   year
		 		+ "-" + ((month < 9) ? "0" + (month + 1) : (month + 1))
		 		+ "-" + ((day < 10) ? "0" + day : day);
	};
	// -------------------------------------------------------------------------------------------	
	 this.GetWeekStart = function(date)
	 {
		var fullDayDate = My.GetFullDayDate(date);	
		var timeStamp = fullDayDate.getTime();
		return timeStamp -  (24 * 60 * 60 * 1000) * ((fullDayDate.getDay() + 6) % 7); // (week start day) = now - oneDay * ((day of the week [0 = sunday, 6 = saturday] + 6) % 7).
	 };
	// -------------------------------------------------------------------------------------------	
	this.GetXMLHttpObject = function()
	{
		if (window.XMLHttpRequest) {
		  // code for IE7+, Firefox, Chrome, Opera, Safari
		  return new XMLHttpRequest();
		}
		if (window.ActiveXObject) {
		  // code for IE6, IE5
		  return new ActiveXObject("Microsoft.XMLHTTP");
		}

		alert ("Browser does not support HTTP Request");
		
		return null;
	};
	// -------------------------------------------------------------------------------------------
	this.HtmlSpecialChars = function(str)
	{
		 if (typeof(str) == "string") {
			 str = str.replace(/&/g, '&amp;') // must do &amp; first 
					.replace(/"/g, '&quot;')
					.replace(/'/g, '&#039;')
					.replace(/</g, '&lt;')
					.replace(/>/g, '&gt;')
					.replace(/\t/g, '&#x9;')
					.replace(/\n/g, '&#xA;')
					.replace(/\r/g, '&#xD;');
		 }
		 return str;
	 };
	// -------------------------------------------------------------------------------------------	
	 this.SendPOSTRequest = function(xmlHttpObj, url, parameters, onReadyFunction)
	{		      
		xmlHttpObj.onreadystatechange = onReadyFunction;
		// For testing
		//alert('POST Param:' + parameters);
		xmlHttpObj.open('POST', url, true);
		xmlHttpObj.setRequestHeader("Content-type", "text/xml");
		xmlHttpObj.setRequestHeader("Content-length", parameters.length);
		xmlHttpObj.setRequestHeader("Connection", "close");
		xmlHttpObj.send(parameters);
	};	
	// -------------------------------------------------------------------------------------------	
   /**
	* @brief Converts YYYY-MM-DD to a Javascript UTC+0 timestamp (seconds since 1970).
	*/
	this.SQLDate2JSTimeStamp = function(date)
	{
		parts = date.split("-");
	    // new Date(Jahr, Monat (0 = januar), Tag);
		return Date.UTC(parts[0], parts[1] - 1, parts[2]);
    };
	// -------------------------------------------------------------------------------------------	
	/*
	*	Returns an empty string if the variable is undefined or the variable itself otherwise.
	*/
    this.NodeValuesToString = function(childNodes)
	{
    	// If the text is longer than 4096, Firefox will split it into multiple
    	// childNodes.
    	if (childNodes.length == 0) return '';
    	var text = '';
    	for(i = 0; i < childNodes.length; i++) {
    		text += childNodes[i].nodeValue;
    	}
    	return text;
	};

};