﻿var Table = new Array();

Table['day'] = new Day();
Table['event'] = new Event();
Table['note'] = new Note();
Table['person'] = new Person();
Table['place'] = new Place();
Table['tag'] = new Tag();

var View = new MainView();
var WeekFirstId = 'WeekFirst';
var WeekLastId = 'WeekLast';

var ItemBarLinks   = new ItemBarLinkedItems('ItemBarLinks', 'divLinks', true, 0, 0, false, View.OnEnterKeyLinks);
var ItemBarSearch = new ItemBar('ItemBarSearch', 'divSearch', true, 0, -1, true, View.OnEnterKeySearch)
