﻿﻿﻿function ItemBar(variableName, divID, hasDate, minImportance, initialSortColumn, initialSortAscending)
{
	this.mXMLDoc = null;
	this.mMinImportance = minImportance;
	this.mHasDate = hasDate;
	this.mDivID = divID;
	this.mVariableName = variableName;
	this.mInitialSortColumn = initialSortColumn;
	this.mInitialSortAscending = initialSortAscending;

	// =============================================================================================
	// ================================= Private ===================================================
	// =============================================================================================
	// -------------------------------------------------------------------------------------------
	function BuildSmallBox(table, id, text, importance, category, width, maxHeight)
	{
		var colorScheme = ColorSchemes.GetScheme(table, category, importance);
		// Create boxes for a certain day
		return '<div class="smallBox '+ colorScheme
			+'" style="width: '+ width +'; max-height: '+  maxHeight +'px;"'
			+'" onmouseup="View.OnMouseUpBox(\''+ table +'\', '+ id +')">'+ My.HtmlSpecialChars(text) +'</div>';
	};
	// -------------------------------------------------------------------------------------------
	/**
	 * @brief Prints a hierarchically list of item boxes.
	 * 
	 * @param nodes         The hierarchically structured input data.
	 * @param minImportance Only items with importance greater or equal to \p minImportance will be drawn.
	 */
	this.BuildBoxList = function(nodes)
	{
		var code = '';
		for (var j = 0; j < nodes.length; j++) {
			var importance = parseInt(nodes[j].getAttribute("importance"));
			if (importance >= this.mMinImportance) {
				code += "<tr>";
				if (this.mHasDate) {
					code +=  "  <td style='font-size: 75%; color: #404040;'>"
					       + nodes[j].getAttribute("date")
					       + "  </td>";
				}
				var table = nodes[j].getAttribute("table");
				var id = nodes[j].getAttribute("id");
				var text = nodes[j].getAttribute("text");
				var category = nodes[j].getAttribute("category");

				code += "  <td>";
				code += BuildSmallBox(table, id, text, importance, category, '96%', 16);
				code += "  </td>";
				//code += "  <td>";
				//code += importance;
				//code += "  </td>";
				code += "</tr>";
				
				if (nodes[j].hasChildNodes()) {
					code += this.BuildBoxList(nodes[j].childNodes);
				}
			}
		}
		return code;
	};
	// =============================================================================================
	// ================================= Privileged ================================================
	// =============================================================================================
	// -------------------------------------------------------------------------------------------
	this.BuildHTMLItems = function()
	{
		var code = ""
		        +"     <table class='sortable' id='"+ this.mDivID +"Table' style='width: 100%;'>"
		        +"     <tr>";
		if (this.mHasDate) {
			code += "       <th style='min-width: 60px; width: 60px; '>Date</th>";
		}
		code += "       <th>Item</th>";
		//code += "       <th>Imp</th>";
		code += "     </tr>";
		code += this.BuildBoxList(this.mXMLDoc.firstChild.childNodes);		
		code += "</table>";
		return code;
	};
	// -------------------------------------------------------------------------------------------
	this.SetVisible = function (visible)
	{
		var mainDiv = document.getElementById(this.mDivID);
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
		this.mXMLDoc = xmlDoc;
	};
	// ---------------------------------------------------------------------------------------------
	/**
	 * @brief Redraws the whole item liboxst.
	 */
	this.Redraw = function()
	{
		var sliderCode = Slider.BuildHTML(this.mDivID + 'Slider', this.mMinImportance, this.mVariableName + '.RedrawItems()');

		var code = "<div id='" + this.mDivID + "SliderDiv'>"
		      + sliderCode
		      + "</div>"
		      + "<div id='" + this.mDivID + "Items' class='itemBarItems'>"
		      + this.BuildHTMLItems()
		      + "</div>";

		var divContent = document.getElementById(this.mDivID + 'Content');
		divContent.innerHTML = code;
		
		var table = document.getElementById(this.mDivID + 'Table');
		sorttable.makeSortable(table);
		if (this.mInitialSortColumn >= 0) {
			sorttable.sortByColumn(table, this.mInitialSortColumn, this.mInitialSortAscending);			
		}
	};
	// ---------------------------------------------------------------------------------------------
	/**
	 * @brief Redraw the items of this item box (but not the slider).
	 */
	this.RedrawItems = function()
	{
		var divItems = document.getElementById(this.mDivID + 'Items');
		this.mMinImportance = document.getElementById(this.mDivID + 'Slider').value;
		
		divItems.innerHTML = this.BuildHTMLItems();
		
		var table = document.getElementById(this.mDivID + 'Table');
		sorttable.makeSortable(table);
	};
}