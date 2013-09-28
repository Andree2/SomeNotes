﻿﻿var Table = new Array();

Table['event'] = new Event();
Table['note'] = new Note();
Table['person'] = new Person();
Table['tag'] = new Tag();

var View = new MainView();
var Slider = new Slider();

var ItemBarLinks   = new ItemBar('ItemBarLinks', 'divLinks', true, 0, 0, false);
var ItemBarPersons = new ItemBar('ItemBarPersons', 'divPersons', false, 3, -1, true);
var ItemBarTags    = new ItemBar('ItemBarTags', 'divTags', false, 0, 0, true);
var ItemBarToDo    = new ItemBar('ItemBarToDo', 'divToDo', true, 0, 0, false);
