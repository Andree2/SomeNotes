var Categories = new function()
{
    function CategoryProperty (category, cssName, displayText)
    {
        this.mCategory = category;
        this.mCSSName = cssName;
        this.mDisplayText = displayText;
    };

    var mCategories = new Array();
    
    mCategories['day'] = new Array();
    mCategories['day'][700] = new CategoryProperty(700, 'free', 'Urlaub');
    mCategories['day'][701] = new CategoryProperty(701, 'free', 'Gleitzeit');
    mCategories['day'][702] = new CategoryProperty(702, 'free', 'Neujahr');
    mCategories['day'][703] = new CategoryProperty(703, 'free', 'Heilige Drei Koenige');
    mCategories['day'][704] = new CategoryProperty(704, 'free', 'Karfreitag');
    mCategories['day'][705] = new CategoryProperty(705, 'free', 'Ostermontag');
    mCategories['day'][706] = new CategoryProperty(706, 'free', 'Maifeiertag');
    mCategories['day'][707] = new CategoryProperty(707, 'free', 'Christi Himmelfahrt');
    mCategories['day'][708] = new CategoryProperty(708, 'free', 'Pfingstmontag');
    mCategories['day'][709] = new CategoryProperty(709, 'free', 'Fronleichnam');
    mCategories['day'][710] = new CategoryProperty(710, 'free', 'Tag der Deutschen Einheit');
    mCategories['day'][711] = new CategoryProperty(711, 'free', 'Allerheiligen');
    mCategories['day'][712] = new CategoryProperty(712, 'free', '1. Weihnachtsfeiertag');
    mCategories['day'][713] = new CategoryProperty(713, 'free', '2. Weihnachtsfeiertag');
    mCategories['day'][714] = new CategoryProperty(714, 'free', 'Krankgeschrieben');
    mCategories['day'][715] = new CategoryProperty(715, 'free', 'Schulferien');
    mCategories['day'][716] = new CategoryProperty(716, 'free', 'Heiligabend (Urlaub)');
    mCategories['day'][717] = new CategoryProperty(717, 'free', 'Sylvester (Urlaub)');
    mCategories['day'][718] = new CategoryProperty(718, 'free', 'Reformationstag');
    
    mCategories['event'] = new Array();
    mCategories['event'][100] = new CategoryProperty(100, 'event', 'Event');
    mCategories['event'][101] = new CategoryProperty(101, 'othersEvent', 'Other Event');
    
    mCategories['note'] = new Array();
    mCategories['note'][200] = new CategoryProperty(200, 'note', 'Note');
    mCategories['note'][201] = new CategoryProperty(201, 'diary', 'Diary');
    
    mCategories['person'] = new Array();
    mCategories['person'][300] = new CategoryProperty(300, 'friend', 'Friend');
    
    mCategories['tag'] = new Array();
    mCategories['tag'][400] = new CategoryProperty(400, 'tag', 'Tag');



  // *********************************
  // Start of Public  Function Library
  // *********************************
   /**
      * @brief Gets the categories for \p table.
      */
  this.GetCategories = function(table)
  {
    return mCategories[table];
  };  
};