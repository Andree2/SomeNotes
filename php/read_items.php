<?php
require_once 'constants.php';
require_once 'db.php';
require_once 'functions.php';

global $gFiltertext;
global $gOutput;

function BuildFilter($table, $minImportance, $filtertext)
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
        $gFiltertext    = $attributes['FILTERTEXT'];
        $gMinImportance = $attributes['MINIMPORTANCE'];
        $gShowNotes     = $attributes['SHOWNOTES'] == "true";
    }
}

function endElement($parser, $name)
{
    if ($name == 'ROW') {
        global $gFiltertext;
        global $gMinImportance;
        global $gShowNotes;
        global $gOutput;
        global $TABLE;
        global $DBLink;

        $gOutput = '<row>';

        // Read Persons
        $filter = BuildFilter($TABLE[PERSON], $gMinImportance, $gFiltertext);
        $query  = "SELECT id,display_name,importance,category FROM " . $TABLE[PERSON]->GetTableName() . $filter . " ORDER BY importance DESC LIMIT 8";
        $result = mysqli_query($DBLink, $query);
        while ($row = mysqli_fetch_assoc($result)) {
            $gOutput .= '<item category="' . $row['category'] . '" date="" id="' . $row['id'] . '" importance="' . $row['importance'] . '" table="person" text="' . htmlspecialchars($row['display_name'], ENT_QUOTES, "UTF-8") . '"/>';
        }

        // Read Tags
        $filter = BuildFilter($TABLE[TAG], $gMinImportance, $gFiltertext);
        $query  = "SELECT id,title,importance,category FROM " . $TABLE[TAG]->GetTableName() . $filter . " ORDER BY importance DESC LIMIT 3";
        $result = mysqli_query($DBLink, $query);
        while ($row = mysqli_fetch_assoc($result)) {
            $gOutput .= '<item category="' . $row['category'] . '" date="" id="' . $row['id'] . '" importance="' . $row['importance'] . '" table="tag" text="' . htmlspecialchars($row['title'], ENT_QUOTES, "UTF-8") . '"/>';
        }

        // Read Places
        $filter = BuildFilter($TABLE[PLACE], $gMinImportance, $gFiltertext);
        $query  = "SELECT id,title,importance,category FROM " . $TABLE[PLACE]->GetTableName() . $filter . " ORDER BY importance DESC LIMIT 3";
        $result = mysqli_query($DBLink, $query);
        while ($row = mysqli_fetch_assoc($result)) {
            $gOutput .= '<item category="' . $row['category'] . '" date="" id="' . $row['id'] . '" importance="' . $row['importance'] . '" table="place" text="' . htmlspecialchars($row['title'], ENT_QUOTES, "UTF-8") . '"/>';
        }

        // Read Events
        $filter = BuildFilter($TABLE[EVENT], $gMinImportance, $gFiltertext);
        $query  = "SELECT id,title,from_date,to_date,to_time,importance,category FROM " . $TABLE[EVENT]->GetTableName() . $filter . " ORDER BY from_date DESC LIMIT 40";
        $result = mysqli_query($DBLink, $query);
        while ($row = mysqli_fetch_assoc($result)) {
            $gOutput .= '<item category="' . $row['category'] . '" date="' . $row['from_date'] . '" id="' . $row['id'] . '" importance="' . $row['importance'] . '" table="event" text="' . htmlspecialchars($row['title'], ENT_QUOTES, "UTF-8") . '"/>';
        }

        // Read Notes
        if ($gShowNotes) {
            $filter = BuildFilter($TABLE[NOTE], $gMinImportance, $gFiltertext);
            $query  = "SELECT id,date,title,importance,category FROM " . $TABLE[NOTE]->GetTableName() . $filter . " ORDER BY date DESC  LIMIT 20";
            $result = mysqli_query($DBLink, $query);
            while ($row = mysqli_fetch_assoc($result)) {
                $gOutput .= '<item category="' . $row['category'] . '" date="' . $row['date'] . '" id="' . $row['id'] . '" importance="' . $row['importance'] . '" table="note" text="' . htmlspecialchars($row['title'], ENT_QUOTES, "UTF-8") . '"/>';
            }
        }

        $gOutput .= '</row>';
    }
}

function characterData($parser, $data)
{
}

ParseXMLInputStream("startElement", "endElement", "characterData");

mysqli_close($DBLink);

XMLHeader();
echo $gOutput;
