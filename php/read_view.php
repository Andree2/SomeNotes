<?php
require_once 'constants.php';
require_once 'db.php';
require_once 'functions.php';

function BuildFilter($minImportance)
{
    $filter = BuildGlobalFilter($minImportance);
    if ($filter == '') {
        return '';
    }
    return " AND " . $filter;
}

function startElement($parser, $name, $attributes)
{
    if ($name == 'ROW') {
        global $gMinImportance;
        global $gShowNotes;
        global $gDateStart;
        global $gDateEnd;
        $gMinImportance = $attributes['MINIMPORTANCE'];
        $gShowNotes     = $attributes['SHOWNOTES'] == "true";
        $gDateStart     = $attributes['DATESTART'];
        $gDateEnd       = $attributes['DATEEND'];
    }
}

function endElement($parser, $name)
{
    if ($name == 'ROW') {
        global $gMinImportance;
        global $gShowNotes;
        global $gDateStart;
        global $gDateEnd;
        global $gOutput;
        global $DBLink;
        global $TABLE;
        global $TABLE_LINK;

        $gOutput = '';

        $dateStartTimestampSQL = $gDateStart / 1000;
        $dateEndTimestampSQL   = $gDateEnd / 1000;

        $dateStartSQL = Timestamp2SQLDate($dateStartTimestampSQL);
        $dateEndSQL   = Timestamp2SQLDate($dateEndTimestampSQL);

        $filter = BuildFilter($gMinImportance);

        // Post start and end date for which this view was requested.
        $gOutput .= '<row date_start="' . $gDateStart . '" date_end="' . $gDateEnd . '">';

        // Read DAYs.
        $query  = "SELECT id,from_date,to_date,category FROM " . $TABLE[DAY]->GetTableName() . " WHERE from_date <= " . $dateEndSQL . " AND to_date >= " . $dateStartSQL;
        $result = mysqli_query($DBLink, $query);
        $gOutput .= '<table name="' . DAY . '">';
        while ($row = mysqli_fetch_assoc($result)) {
            $gOutput .= '<item id="' . $row['id'] . '" from_date="' . $row['from_date'] . '" to_date="' . $row['to_date'] . '" category="' . $row['category'] . '"/>';
        }
        $gOutput .= '</table>';

        // Read NOTEs.
        if ($gShowNotes) {
            $query  = "SELECT id,date,title,importance,category FROM " . $TABLE[NOTE]->GetTableName() . " WHERE date BETWEEN " . $dateStartSQL . " AND " . $dateEndSQL . $filter;
            $result = mysqli_query($DBLink, $query);
            $gOutput .= '<table name="' . NOTE . '">';
            while ($row = mysqli_fetch_assoc($result)) {
                $gOutput .= '<item id="' . $row['id'] . '" date="' . $row['date'] . '" importance="' . $row['importance'] . '" category="' . $row['category'] . '">';
                $gOutput .= "<title>" . htmlspecialchars($row['title'], ENT_QUOTES, "UTF-8") . "</title>";
                $gOutput .= "</item>";
            }
            $gOutput .= '</table>';
        }

        // Read EVENTs.
        $query  = "SELECT id,title,from_time,from_date,to_date,to_time,importance,category FROM " . $TABLE[EVENT]->GetTableName() . " WHERE from_date <= " . $dateEndSQL . " AND to_date >= " . $dateStartSQL . $filter;
        $result = mysqli_query($DBLink, $query);

        $gOutput .= '<table name="' . EVENT . '">';
        while ($row = mysqli_fetch_assoc($result)) {
            // Check if the event has a linked place.
            $eventLinkQuery = "SELECT table1_id, table1_item_id FROM " . $TABLE_LINK->GetTableName()
            . ' WHERE (table1_id=' . $TABLE[EVENT]->GetID() . ' AND table1_item_id=' . $row['id'] . ' AND table2_id=' . $TABLE[PLACE]->GetID() . ') OR'
            . '       (table2_id=' . $TABLE[EVENT]->GetID() . ' AND table2_item_id=' . $row['id'] . ' AND table1_id=' . $TABLE[PLACE]->GetID() . ')';
            $eventLinkResult = mysqli_query($DBLink, $eventLinkQuery);
            $hasPlace        = mysqli_num_rows($eventLinkResult) > 0;

            $gOutput .= '<item id="' . $row['id'] . '" from_date="' . $row['from_date'] . '"  from_time ="' . $row['from_time'] . '" to_date="' . $row['to_date'] . '" to_time="' . $row['to_time'] . '" importance="' . $row['importance'] . '" category="' . $row['category'] . '" has_place="' . $hasPlace . '">';
            $gOutput .= "<title>" . htmlspecialchars($row['title'], ENT_QUOTES, "UTF-8") . "</title>";
            $gOutput .= "</item>";
        }
        $gOutput .= '</table>';

        // Read PERSONs.
        // Select persons which have birthday on this date.
        $query             = '';
        $dateMonthDayStart = date('md', $dateStartTimestampSQL);
        $dateMonthDayEnd   = date('md', $dateEndTimestampSQL);

        function EchoPersonData($row, $currentYear)
        {
            global $gOutput;
            $gOutput .= '<item id="' . $row['id'] . '" date="' . strval($currentYear) . '-' . $row['birthday_month'] . '-' . $row['birthday_day'] . '" importance="' . $row['importance'] . '" category="' . $row['category'] . '">';
            $gOutput .= "<text>" . htmlspecialchars($row['display_name'], ENT_QUOTES, "UTF-8") . ($row['birthday_year'] == '' ? '' : ' (' . strval($currentYear - $row['birthday_year']) . ')') . "</text>";
            $gOutput .= '</item>';
        }

        $gOutput .= '<table name="person">';
        if ($dateMonthDayStart <= $dateMonthDayEnd) {
            // Boths date lie in the same year.
            $query       = "SELECT id,display_name,birthday_day,birthday_month,birthday_year,importance,category FROM " . $TABLE[PERSON]->GetTableName() . " WHERE (birthday_month * 100 + birthday_day) BETWEEN " . $dateMonthDayStart . " AND " . $dateMonthDayEnd . $filter;
            $currentYear = date('Y', $dateStartTimestampSQL);
            $result      = mysqli_query($DBLink, $query);
            while ($row = mysqli_fetch_assoc($result)) {
                EchoPersonData($row, $currentYear);
            }
        } else {
            // dateEnd lies in the year after dateEnd
            $query       = "SELECT id,display_name,birthday_day,birthday_month,birthday_year,importance,category FROM " . $TABLE[PERSON]->GetTableName() . " WHERE (birthday_month * 100 + birthday_day) >= " . $dateMonthDayStart . $filter;
            $currentYear = date('Y', $dateStartTimestampSQL);
            $result      = mysqli_query($DBLink, $query);
            while ($row = mysqli_fetch_assoc($result)) {
                EchoPersonData($row, $currentYear);
            }
            $query       = "SELECT id,display_name,birthday_day,birthday_month,birthday_year,importance,category FROM " . $TABLE[PERSON]->GetTableName() . " WHERE (birthday_month * 100 + birthday_day) <= " . $dateMonthDayEnd . $filter;
            $currentYear = date('Y', $dateEndTimestampSQL);
            $result      = mysqli_query($DBLink, $query);
            while ($row = mysqli_fetch_assoc($result)) {
                EchoPersonData($row, $currentYear);
            }
        }
        $gOutput .= '</table>';
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
