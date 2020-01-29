<?php
require_once 'functions.php';
require_once 'tables/class_table.php';
require_once 'tables/class_day.php';
require_once 'tables/class_event.php';
require_once 'tables/class_link.php';
require_once 'tables/class_note.php';
require_once 'tables/class_person.php';
require_once 'tables/class_place.php';
require_once 'tables/class_tag.php';

define('DAY', 'day');
define('EVENT', 'event');
define('LINK', 'link');
define('NOTE', 'note');
define('PERSON', 'person');
define('PLACE', 'place');
define('TAG', 'tag');

define('ONEDAY', '86400'); //24 * 60 * 60

global $TABLE;
$TABLE = array();
$TABLE[DAY] = new Day();
$TABLE[EVENT] = new Event();
$TABLE[NOTE] = new Note();
$TABLE[PERSON] = new Person();
$TABLE[PLACE] = new Place();
$TABLE[TAG] = new Tag();

global $TABLE_LINK;
$TABLE_LINK = new Link();

global $TABLE_NAME_FROM_ID;
$TABLE_NAME_FROM_ID = array();
$TABLE_NAME_FROM_ID[$TABLE[DAY]->GetID()] = DAY;
$TABLE_NAME_FROM_ID[$TABLE[EVENT]->GetID()] = EVENT;
$TABLE_NAME_FROM_ID[$TABLE[NOTE]->GetID()] = NOTE;
$TABLE_NAME_FROM_ID[$TABLE[PERSON]->GetID()] = PERSON;
$TABLE_NAME_FROM_ID[$TABLE[PLACE]->GetID()] = PLACE;
$TABLE_NAME_FROM_ID[$TABLE[TAG]->GetID()] = TAG;
$TABLE_NAME_FROM_ID[$TABLE_LINK->GetID()] = LINK;
