<?php
require_once 'constants.php';
require_once 'db.php';
require_once 'functions.php';

global $gFiltertext;
global $gOutput;

function BuildItemsFilter($table, $minImportance, $filtertext, $contentSearch)
{
    $filter = BuildGlobalAndTextFilter($table, $minImportance, $filtertext, $contentSearch);
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
        $gFiltertext    = $attributes['FILTERTEXT'];
        $gMinImportance = $attributes['MINIMPORTANCE'];
        $gShowNotes     = $attributes['SHOWNOTES'] == "true";
    }
}

function endElement($parser, $name)
{
    if ($name == 'ROW') {

        global $gOutput;

        $gOutput = '<row>';

        // First read items only by display name, then search again with extended search.
        // This way, items are first only shown according to display name, after than by content.
        $gOutput .= readSearchItems($parser, $name, false);
        $gOutput .= readSearchItems($parser, $name, true);

        $gOutput .= '</row>';
    }
}

function readSearchItems($parser, $name, $contentSearch)
{
    global $gFiltertext;
    global $gMinImportance;
    global $gShowNotes;
    global $TABLE;
    global $DBLink;

    $output = '';

    // Read Persons
    $filter = BuildItemsFilter($TABLE[PERSON], $gMinImportance, $gFiltertext, $contentSearch);
    $query  = "SELECT id,display_name,importance,category FROM " . $TABLE[PERSON]->GetTableName() . $filter . " ORDER BY importance DESC LIMIT 8";
    $result = mysqli_query($DBLink, $query);
    while ($row = mysqli_fetch_assoc($result)) {
        $output .= '<item category="' . $row['category'] . '" date="" id="' . $row['id'] . '" importance="' . $row['importance'] . '" table="person" text="' . htmlspecialchars($row['display_name'], ENT_QUOTES, "UTF-8") . '"/>';
    }

    // Read Tags
    $filter = BuildItemsFilter($TABLE[TAG], $gMinImportance, $gFiltertext, $contentSearch);
    $query  = "SELECT id,title,importance,category FROM " . $TABLE[TAG]->GetTableName() . $filter . " ORDER BY importance DESC LIMIT 3";
    $result = mysqli_query($DBLink, $query);
    while ($row = mysqli_fetch_assoc($result)) {
        $output .= '<item category="' . $row['category'] . '" date="" id="' . $row['id'] . '" importance="' . $row['importance'] . '" table="tag" text="' . htmlspecialchars($row['title'], ENT_QUOTES, "UTF-8") . '"/>';
    }

    // Read Places
    $filter = BuildItemsFilter($TABLE[PLACE], $gMinImportance, $gFiltertext, $contentSearch);
    $query  = "SELECT id,title,importance,category FROM " . $TABLE[PLACE]->GetTableName() . $filter . " ORDER BY importance DESC LIMIT 3";
    $result = mysqli_query($DBLink, $query);
    while ($row = mysqli_fetch_assoc($result)) {
        $output .= '<item category="' . $row['category'] . '" date="" id="' . $row['id'] . '" importance="' . $row['importance'] . '" table="place" text="' . htmlspecialchars($row['title'], ENT_QUOTES, "UTF-8") . '"/>';
    }

    // Read Events
    $filter = BuildItemsFilter($TABLE[EVENT], $gMinImportance, $gFiltertext, $contentSearch);
    $query  = "SELECT id,title,from_date,to_date,to_time,importance,category FROM " . $TABLE[EVENT]->GetTableName() . $filter . " ORDER BY from_date DESC LIMIT 40";
    $result = mysqli_query($DBLink, $query);
    while ($row = mysqli_fetch_assoc($result)) {
        $output .= '<item category="' . $row['category'] . '" date="' . $row['from_date'] . '" id="' . $row['id'] . '" importance="' . $row['importance'] . '" table="event" text="' . htmlspecialchars($row['title'], ENT_QUOTES, "UTF-8") . '"/>';
    }

    // Read Notes
    if ($gShowNotes) {
        $filter = BuildItemsFilter($TABLE[NOTE], $gMinImportance, $gFiltertext, $contentSearch);
        $query  = "SELECT id,date,title,importance,category FROM " . $TABLE[NOTE]->GetTableName() . $filter . " ORDER BY date DESC  LIMIT 20";
        $result = mysqli_query($DBLink, $query);
        while ($row = mysqli_fetch_assoc($result)) {
            $output .= '<item category="' . $row['category'] . '" date="' . $row['date'] . '" id="' . $row['id'] . '" importance="' . $row['importance'] . '" table="note" text="' . htmlspecialchars($row['title'], ENT_QUOTES, "UTF-8") . '"/>';
        }
    }

    return $output;
}

function characterData($parser, $data)
{
}

ParseXMLInputStream("startElement", "endElement", "characterData");

mysqli_close($DBLink);

XMLHeader();
echo $gOutput;
