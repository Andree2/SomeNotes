<?php
require_once 'constants.php';
require_once 'db.php';
require_once 'functions.php';

global $gFiltertext;
global $gOutput;

function BuildDisplayTextColumnFilter($table, $filterparts)
{
    $filter = '';
    if (count($filterparts) != 0) {
        $filter .= " WHERE " . $table->GetColumnDisplayText() . " LIKE '%" . $filterparts[0] . "%'";
        for ($i = 1; $i < count($filterparts); $i++) {
            $filter .= " AND " . $table->GetColumnDisplayText() . " LIKE '%" . $filterparts[$i] . "%'";
        }
    }
    return $filter;
}

function startElement($parser, $name, $attributes)
{
    if ($name == 'ROW') {
        global $gFiltertext;
        $gFiltertext = $attributes['FILTERTEXT'];
    }
}

function endElement($parser, $name)
{
    if ($name == 'ROW') {
        global $gFiltertext;
        global $gOutput;
        global $TABLE;
        global $DBLink;

        $gOutput = '';
        $filterparts = explode(" ", $gFiltertext);

        // Read Persons
        $filter = BuildDisplayTextColumnFilter($TABLE[PERSON], $filterparts);
        $query = "SELECT id,display_name,importance,category FROM " . $TABLE[PERSON]->GetTableName() . $filter . " ORDER BY importance DESC";
        $result = mysqli_query($DBLink, $query);
        while ($row = mysqli_fetch_assoc($result)) {
            $gOutput .= '<item category="' . $row['category'] . '" date="" id="' . $row['id'] . '" importance="' . $row['importance'] . '" table="person" text="' . htmlspecialchars($row['display_name'], ENT_QUOTES, "UTF-8") . '"/>';
        }

        // Read Tags
        $filter = BuildDisplayTextColumnFilter($TABLE[TAG], $filterparts);
        $query = "SELECT id,title,importance,category FROM " . $TABLE[TAG]->GetTableName() . $filter . " ORDER BY importance DESC";
        $result = mysqli_query($DBLink, $query);
        while ($row = mysqli_fetch_assoc($result)) {
            $gOutput .= '<item category="' . $row['category'] . '" date="" id="' . $row['id'] . '" importance="' . $row['importance'] . '" table="tag" text="' . htmlspecialchars($row['title'], ENT_QUOTES, "UTF-8") . '"/>';
        }

        // Read Places
        $filter = BuildDisplayTextColumnFilter($TABLE[PLACE], $filterparts);
        $query = "SELECT id,title,importance,category FROM " . $TABLE[PLACE]->GetTableName() . $filter . " ORDER BY importance DESC";
        $result = mysqli_query($DBLink, $query);
        while ($row = mysqli_fetch_assoc($result)) {
            $gOutput .= '<item category="' . $row['category'] . '" date="" id="' . $row['id'] . '" importance="' . $row['importance'] . '" table="place" text="' . htmlspecialchars($row['title'], ENT_QUOTES, "UTF-8") . '"/>';
        }

        // Read Events
        $filter = BuildDisplayTextColumnFilter($TABLE[EVENT], $filterparts);
        $query = "SELECT id,title,from_date,to_date,to_time,importance,category FROM " . $TABLE[EVENT]->GetTableName() . $filter . " ORDER BY from_date DESC";
        $result = mysqli_query($DBLink, $query);
        while ($row = mysqli_fetch_assoc($result)) {
            $gOutput .= '<item category="' . $row['category'] . '" date="' . $row['from_date'] . '" id="' . $row['id'] . '" importance="' . $row['importance'] . '" table="event" text="' . htmlspecialchars($row['title'], ENT_QUOTES, "UTF-8") . '"/>';
        }

        // Read Notes
        $filter = BuildDisplayTextColumnFilter($TABLE[NOTE], $filterparts);
        $query = "SELECT id,date,title,importance,category FROM " . $TABLE[NOTE]->GetTableName() . $filter . " ORDER BY date DESC";
        $result = mysqli_query($DBLink, $query);
        while ($row = mysqli_fetch_assoc($result)) {
            $gOutput .= '<item category="' . $row['category'] . '" date="' . $row['date'] . '" id="' . $row['id'] . '" importance="' . $row['importance'] . '" table="note" text="' . htmlspecialchars($row['title'], ENT_QUOTES, "UTF-8") . '"/>';
        }
    }
}

function characterData($parser, $data)
{
}

ParseXMLInputStream("startElement", "endElement", "characterData");

mysqli_close($DBLink);

XMLHeader();
echo '<row>';
echo $gOutput;
echo '</row>';
