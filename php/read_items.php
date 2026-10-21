<?php
require_once 'constants.php';
require_once 'db.php';
require_once 'functions.php';

global $gFiltertext;
global $gOutput;

function BuildItemsFilter($table, $minImportance, $filtertext)
{
    $filter = BuildGlobalAndTextFilter($table, $minImportance, $filtertext);
    if ($filter == '') {
        return '';
    }
    return " WHERE " . $filter;
}

function startElement($parser, $name, $attributes)
{
    if ($name == 'ROW') {
        global $gFiltertext;
        global $gMinImportance;
        global $gShowNotes;
        global $gMaxItemsCount;
        $gFiltertext    = $attributes['FILTERTEXT'];
        $gMinImportance = $attributes['MINIMPORTANCE'];
        $gShowNotes     = $attributes['SHOWNOTES'] == "true";
        $gMaxItemsCount = NormalizeMaxItemsCount(isset($attributes['MAXITEMSCOUNT']) ? $attributes['MAXITEMSCOUNT'] : null);
    }
}

function endElement($parser, $name)
{
    if ($name != 'ROW') {
        return;
    }

    global $gOutput;
    global $gFiltertext;
    global $gMinImportance;
    global $gShowNotes;
    global $gMaxItemsCount;
    global $TABLE;
    global $DBLink;

    $gOutput = '<row>';

    // Read Persons
    $filter = BuildItemsFilter($TABLE[PERSON], $gMinImportance, $gFiltertext);
    $query  = "SELECT id,display_name,importance,category FROM " . $TABLE[PERSON]->GetTableName() . $filter . " ORDER BY importance DESC LIMIT " . $gMaxItemsCount;
    $result = mysqli_query($DBLink, $query);
    while ($row = mysqli_fetch_assoc($result)) {
        $gOutput .= '<item category="' . $row['category'] . '" date="" id="' . $row['id'] . '" importance="' . $row['importance'] . '" table="person" text="' . htmlspecialchars($row['display_name'], ENT_QUOTES, "UTF-8") . '"/>';
    }

    // Read Tags
    $filter = BuildItemsFilter($TABLE[TAG], $gMinImportance, $gFiltertext);
    $query  = "SELECT id,title,importance,category FROM " . $TABLE[TAG]->GetTableName() . $filter . " ORDER BY importance DESC LIMIT " . $gMaxItemsCount;
    $result = mysqli_query($DBLink, $query);
    while ($row = mysqli_fetch_assoc($result)) {
        $gOutput .= '<item category="' . $row['category'] . '" date="" id="' . $row['id'] . '" importance="' . $row['importance'] . '" table="tag" text="' . htmlspecialchars($row['title'], ENT_QUOTES, "UTF-8") . '"/>';
    }

    // Read Places
    $filter = BuildItemsFilter($TABLE[PLACE], $gMinImportance, $gFiltertext);
    $query  = "SELECT id,title,importance,category FROM " . $TABLE[PLACE]->GetTableName() . $filter . " ORDER BY importance DESC LIMIT " . $gMaxItemsCount;
    $result = mysqli_query($DBLink, $query);
    while ($row = mysqli_fetch_assoc($result)) {
        $gOutput .= '<item category="' . $row['category'] . '" date="" id="' . $row['id'] . '" importance="' . $row['importance'] . '" table="place" text="' . htmlspecialchars($row['title'], ENT_QUOTES, "UTF-8") . '"/>';
    }

    // Read Events
    $filter = BuildItemsFilter($TABLE[EVENT], $gMinImportance, $gFiltertext);
    $query  = "SELECT id,title,from_date,to_date,to_time,importance,category FROM " . $TABLE[EVENT]->GetTableName() . $filter . " ORDER BY from_date DESC LIMIT " . $gMaxItemsCount;
    $result = mysqli_query($DBLink, $query);
    while ($row = mysqli_fetch_assoc($result)) {
        $gOutput .= '<item category="' . $row['category'] . '" date="' . $row['from_date'] . '" id="' . $row['id'] . '" importance="' . $row['importance'] . '" table="event" text="' . htmlspecialchars($row['title'], ENT_QUOTES, "UTF-8") . '"/>';
    }

    // Read Notes
    if ($gShowNotes) {
        $filter = BuildItemsFilter($TABLE[NOTE], $gMinImportance, $gFiltertext);
        $query  = "SELECT id,date,title,importance,category FROM " . $TABLE[NOTE]->GetTableName() . $filter . " ORDER BY date DESC  LIMIT " . $gMaxItemsCount;
        $result = mysqli_query($DBLink, $query);
        while ($row = mysqli_fetch_assoc($result)) {
            $gOutput .= '<item category="' . $row['category'] . '" date="' . $row['date'] . '" id="' . $row['id'] . '" importance="' . $row['importance'] . '" table="note" text="' . htmlspecialchars($row['title'], ENT_QUOTES, "UTF-8") . '"/>';
        }
    }

    $gOutput .= '</row>';
}

function characterData($parser, $data)
{
}

ParseXMLInputStream("startElement", "endElement", "characterData");

mysqli_close($DBLink);

XMLHeader();
echo $gOutput;
