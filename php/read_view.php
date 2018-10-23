<?php
require_once 'constants.php';
require_once 'db.php';

$dateStart = $_GET['dateStart'];
$dateEnd = $_GET['dateEnd'];

$dateStartTimestampSQL = $dateStart / 1000;
$dateEndTimestampSQL = $dateEnd / 1000;

$dateStartSQL = Timestamp2SQLDate($dateStartTimestampSQL);
$dateEndSQL = Timestamp2SQLDate($dateEndTimestampSQL);

XMLHeader();
// Post start and end date for which this view was requested.
echo '<row date_start="' . $dateStart . '" date_end="' . $dateEnd . '">';
// Select DAYs.
// 0. Row ID
// 1. Corresponding day
// 2. category
$query = "SELECT id,from_date,to_date,category FROM " . $TABLE[DAY]->GetTableName() . " WHERE from_date <= " . $dateEndSQL . " AND to_date >= " . $dateStartSQL;
$result = mysqli_query($DBLink, $query);
echo '<table name="' . DAY . '">';
while ($row = mysqli_fetch_assoc($result)) {
    echo '<item id="' . $row['id'] . '" from_date="' . $row['from_date'] . '" to_date="' . $row['to_date'] . '" category="' . $row['category'] . '"/>';
}
echo '</table>';

// Select NOTEs.
// 0. Row ID
// 1. Corresponding day
// 2. Text to be displayed in the box
// 3. importance
// 4. category
$query = "SELECT id,date,title,importance,category FROM " . $TABLE[NOTE]->GetTableName() . " WHERE date BETWEEN " . $dateStartSQL . " AND " . $dateEndSQL;
$result = mysqli_query($DBLink, $query);
echo '<table name="' . NOTE . '">';
while ($row = mysqli_fetch_assoc($result)) {
    echo '<item id="' . $row['id'] . '" date="' . $row['date'] . '" importance="' . $row['importance'] . '" category="' . $row['category'] . '">';
    echo "<title>" . htmlspecialchars($row['title'], ENT_QUOTES, "UTF-8") . "</title>";
    echo "</item>";
}
echo '</table>';

// Select EVENTs.
// 0. Row ID
// 1. Corresponding day
// 2. Text to be displayed in the box
// 3. importance
// 4. category
$query = "SELECT id,title,from_date,to_date,to_time,importance,category FROM " . $TABLE[EVENT]->GetTableName() . " WHERE from_date <= " . $dateEndSQL . " AND to_date >= " . $dateStartSQL;
$result = mysqli_query($DBLink, $query);

echo '<table name="' . EVENT . '">';
while ($row = mysqli_fetch_assoc($result)) {
    // Check if the event has a linked place.
    $eventLinkQuery = "SELECT table1_id, table1_item_id FROM " . $TABLE_LINK->GetTableName()
    . ' WHERE (table1_id=' . $TABLE[EVENT]->GetID() . ' AND table1_item_id=' . $row['id'] . ' AND table2_id=' . $TABLE[PLACE]->GetID() . ') OR'
    . '       (table2_id=' . $TABLE[EVENT]->GetID() . ' AND table2_item_id=' . $row['id'] . ' AND table1_id=' . $TABLE[PLACE]->GetID() . ')';
    $eventLinkResult = mysqli_query($DBLink, $eventLinkQuery);
    $hasPlace = mysqli_num_rows($eventLinkResult) > 0;

    echo '<item id="' . $row['id'] . '" from_date="' . $row['from_date'] . '" to_date="' . $row['to_date'] . '" to_time="' . $row['to_time'] . '" importance="' . $row['importance'] . '" category="' . $row['category'] . '" has_place="' . $hasPlace . '">';
    echo "<title>" . htmlspecialchars($row['title'], ENT_QUOTES, "UTF-8") . "</title>";
    echo "</item>";
}
echo '</table>';

// Select PERSONs.
// Selec persons which have birthday on this date.
$query = '';
$dateMonthDayStart = date('md', $dateStartTimestampSQL);
$dateMonthDayEnd = date('md', $dateEndTimestampSQL);

function EchoPersonData($row, $currentYear)
{
    echo '<item id="' . $row['id'] . '" date="' . strval($currentYear) . '-' . $row['birthday_month'] . '-' . $row['birthday_day'] . '" importance="' . $row['importance'] . '" category="' . $row['category'] . '">';
    echo "<text>" . htmlspecialchars($row['display_name'], ENT_QUOTES, "UTF-8") . ($row['birthday_year'] == '' ? '' : ' (' . strval($currentYear - $row['birthday_year']) . ')') . "</text>";
    echo '</item>';
}

echo '<table name="person">';
if ($dateMonthDayStart <= $dateMonthDayEnd) {
    // Boths date lie in the same year.
    $query = "SELECT id,display_name,birthday_day,birthday_month,birthday_year,importance,category FROM " . $TABLE[PERSON]->GetTableName() . " WHERE (birthday_month * 100 + birthday_day) BETWEEN " . $dateMonthDayStart . " AND " . $dateMonthDayEnd;
    $currentYear = date('Y', $dateStartTimestampSQL);
    $result = mysqli_query($DBLink, $query);
    while ($row = mysqli_fetch_assoc($result)) {
        EchoPersonData($row, $currentYear);
    }
} else {
    // dateEnd lies in the year after dateEnd
    $query = "SELECT id,display_name,birthday_day,birthday_month,birthday_year,importance,category FROM " . $TABLE[PERSON]->GetTableName() . " WHERE (birthday_month * 100 + birthday_day) >= " . $dateMonthDayStart;
    $currentYear = date('Y', $dateStartTimestampSQL);
    $result = mysqli_query($DBLink, $query);
    while ($row = mysqli_fetch_assoc($result)) {
        EchoPersonData($row, $currentYear);
    }
    $query = "SELECT id,display_name,birthday_day,birthday_month,birthday_year,importance,category FROM " . $TABLE[PERSON]->GetTableName() . " WHERE (birthday_month * 100 + birthday_day) <= " . $dateMonthDayEnd;
    $currentYear = date('Y', $dateEndTimestampSQL);
    $result = mysqli_query($DBLink, $query);
    while ($row = mysqli_fetch_assoc($result)) {
        EchoPersonData($row, $currentYear);
    }
}
echo '</table>';
echo '</row>';

mysqli_close($DBLink);
