<?php
require_once('functions.php');
require_once('tables/class_table.php');
require_once('tables/class_event.php');
require_once('tables/class_link.php');
require_once('tables/class_note.php');
require_once('tables/class_person.php');
require_once('tables/class_tag.php');

define('EVENT',   'event');
define('LINK',    'link');
define('NOTE',    'note');
define('PERSON',  'person');
define('TAG',     'tag');

define('ONEDAY',   '86400'); //24 * 60 * 60

global $TABLE;
$TABLE = array();
$TABLE[EVENT]   = new Event();
$TABLE[LINK]    = new Link();
$TABLE[NOTE]    = new Note();
$TABLE[PERSON]  = new Person();
$TABLE[TAG]     = new Tag();

global $TABLE_FROM_ID;
$TABLE_FROM_ID = array();
$TABLE_FROM_ID[$TABLE[EVENT]->GetID()]  = EVENT;
$TABLE_FROM_ID[$TABLE[LINK]->GetID()]   = LINK;
$TABLE_FROM_ID[$TABLE[NOTE]->GetID()]   = NOTE;
$TABLE_FROM_ID[$TABLE[PERSON]->GetID()] = PERSON;
$TABLE_FROM_ID[$TABLE[TAG]->GetID()]    = TAG;

?>