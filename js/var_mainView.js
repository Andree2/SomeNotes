﻿var Table = new Array();

Table['day'] = new Day();
Table['event'] = new Event();
Table['note'] = new Note();
Table['person'] = new Person();
Table['place'] = new Place();
Table['tag'] = new Tag();

var Slider = new Slider();
var View = new MainView();

var ItemBarLinks   = new ItemBar('ItemBarLinks', 'divLinks', true, 0, 0, false, View.OnEnterKeyLinks);
var ItemBarSearch = new ItemBar('ItemBarSearch', 'divSearch', true, 1, -1, true, View.OnEnterKeySearch)
