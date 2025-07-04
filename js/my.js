﻿var My = new function()
{
    // -------------------------------------------------------------------------------------------	
    this.URIParameterList = function(querystring)
    {
        if (querystring == '') return;
        var parString = querystring.slice(1);
        var pairs = parString.split("&");
        var pair, name, value;
        var parList = new Object();
        for (var i = 0; i < pairs.length; i++)
        {
            pair = pairs[i].split("=");
            name = pair[0];
            value = pair[1];
            name = unescape(name).replace("+", " ");
            value = unescape(value).replace("+", " ");
            parList[name] = value;
        }
        return parList;
    };
    // -------------------------------------------------------------------------------------------
    this.IsEventSupported = function(eventName)
    {
        var TAGNAMES = {
            'select': 'input', 'change': 'input',
            'submit': 'form', 'reset': 'form',
            'error': 'img', 'load': 'img', 'abort': 'img'
        };
        var el = document.createElement(TAGNAMES[eventName] || 'div');
        eventName = 'on' + eventName;
        var isSupported = (eventName in el);
        if (!isSupported)
        {
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
        return ((hours < 10) ? "0" + hours : hours)
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
        return year
            + "-" + ((month < 9) ? "0" + (month + 1) : (month + 1))
            + "-" + ((day < 10) ? "0" + day : day);
    };
    // -------------------------------------------------------------------------------------------	

    /**
     * Returns the timestamp for start of the week in which <date> lies.
     */
    this.GetWeekStart = function(date)
    {
        var fullDayDate = My.GetFullDayDate(date);
        var timeStamp = fullDayDate.getTime();
        return timeStamp - (24 * 60 * 60 * 1000) * ((fullDayDate.getDay() + 6) % 7); // (week start day) = now - oneDay * ((day of the week [0 = sunday, 6 = saturday] + 6) % 7).
    };
    // -------------------------------------------------------------------------------------------	
    this.GetXMLHttpObject = function()
    {
        if (window.XMLHttpRequest)
        {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            return new XMLHttpRequest();
        }
        if (window.ActiveXObject)
        {
            // code for IE6, IE5
            return new ActiveXObject("Microsoft.XMLHTTP");
        }

        alert("Browser does not support HTTP Request");

        return null;
    };
    // -------------------------------------------------------------------------------------------
    this.HtmlSpecialChars = function(str)
    {
        if (typeof (str) == "string")
        {
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
    this.FirstChildNodeValuesToString = function(item)
    {
        var childNodes = item[0].childNodes;
        // If the text is longer than 4096, Firefox will split it into multiple
        // childNodes.
        if (childNodes.length == 0) return '';
        var text = '';
        for (i = 0; i < childNodes.length; i++)
        {
            text += childNodes[i].nodeValue;
        }
        return text;
    };
    // -------------------------------------------------------------------------------------------	
    this.GetDayCategoriesDisplayText = function()
    {
        var categories = {
            day_holiday: "Urlaub",
            day_flextime: "Gleitzeit",
            day_new_year: "Neujahr",
            day_three_wise_men: "Heilige Drei Koenige",
            day_good_friday: "Karfreitag",
            day_easter_monday: "Ostermontag",
            day_workers_day: "Maifeiertag",
            day_ascension_day: "Christi Himmelfahrt",
            day_pentecost: "Pfingstmontag",
            day_corpus_christi: "Fronleichnam",
            day_german_unity_day: "Tag der Deutschen Einheit",
            day_all_saints_day: "Allerheiligen",
            day_december_25: "1. Weihnachtsfeiertag",
            day_december_26: "2. Weihnachtsfeiertag",
            day_medical_leave: "Krankgeschrieben",
            day_christmas_eve: "Heiligabend (Urlaub)",
            day_new_years_eve: "Silvester (Urlaub)",
            day_reformation_day: "Reformationstag",
            day_school_holidays: "Schulferien",
            day_parental_leave: "Elternzeit"
        };
        return categories;
    };
    // -------------------------------------------------------------------------------------------	
    this.GetLinkInfoTypesDisplayText = function()
    {
        var linkInfoTypes = {
            home_address: "Wohnort",
            parent_child: "Eltern/Kind",
            relationship: "Beziehung",
            married: "Verheiratet"
        };
        return linkInfoTypes;
    };
    // -------------------------------------------------------------------------------------------	
    this.GetPersonSexesDisplayText = function()
    {
        var sexes = {
            diverse: "Divers",
            female: "Weiblich",
            male: "Männlich",
            unknown: "Unkebannt",
            dog_female: "Hündin",
            dog_male: "Hund (männlich)",
            cat_female: "Katze (weiblich)",
            cat_male: "Kater",
            horse_female: "Pferd (Stute)",
            horse_male: "Pferd (Hengst)"
        };
        return sexes;
    };
};