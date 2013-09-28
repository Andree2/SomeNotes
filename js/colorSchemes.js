var ColorSchemes = new function()
{
	function ColorScheme (cssName, displayName)
	{
		this.mCSSName = cssName;
		this.mDisplayName = displayName;
	};

	var mColorSchemes = new Array();
	
	mColorSchemes['event'] = new Array();
	mColorSchemes['event'][100] = new ColorScheme('event', 'Event');
	mColorSchemes['event'][101] = new ColorScheme('othersEvent', 'Other peoples event');
	
	mColorSchemes['note'] = new Array();
	mColorSchemes['note'][200] = new ColorScheme('note', 'Note');
	mColorSchemes['note'][201] = new ColorScheme('diary', 'Diary');
	
	mColorSchemes['person'] = new Array();
	mColorSchemes['person'][300] = new ColorScheme('friend', 'Friend');
	mColorSchemes['person'][301] = new ColorScheme('acquaintance', 'Acquaintance');
	
	mColorSchemes['tag'] = new Array();
	mColorSchemes['tag'][400] = new ColorScheme('tag', 'Tag');



  // *********************************
  // Start of Public  Function Library
  // *********************************
  
    // -------------------------------------------------------------------------------------------	
     /**
      * @brief Gets the CSS style name of the color scheme for objects from \p table with category
      *        \p category and importance \p importance.
      */
  this.GetScheme = function(table, category, importance)
  {
    return mColorSchemes[table][category].mCSSName + importance;
  };
};