<?php
require_once('constants.php');
require_once('db.php');

$dateStart = $_GET['dateStart'];
$dateEnd = $_GET['dateEnd'];

$dateStartSQL = Timestamp2SQLDate($dateStart);
$dateEndSQL = Timestamp2SQLDate($dateEnd);

XMLHeader();
echo '<row>';

// Select NOTEs.
// 0. Row ID
// 1. Corresponding day
// 2. Text to be displayed in the box
// 3. importance
// 4. category	
$result = mysql_query($TABLE[NOTE]->GetQueryReadView($dateStartSQL, $dateEndSQL));
echo '<table name="'. NOTE .'">';
while($row = mysql_fetch_row($result)) {
	echo '<item id="'. $row[0] .'">';
	echo '<date>'.  $row[1] .'</date>';
	echo '<text>'. htmlspecialchars($row[2], ENT_QUOTES, "UTF-8") .'</text>';	
	echo '<importance>'. $row[3] .'</importance>';	 
	echo '<category>'. $row[4] .'</category>';   
	echo '</item>';
}
echo '</table>';

// Select EVENTs.
// 0. Row ID
// 1. Corresponding day
// 2. Text to be displayed in the box
// 3. importance
// 4. category	
$result = mysql_query($TABLE[EVENT]->GetQueryReadView($dateStartSQL, $dateEndSQL));
echo '<table name="'. EVENT .'">';
while($row = mysql_fetch_row($result)) {
	echo '<item id="'. $row[0] .'">';
	echo '<date>'.  $row[1] .'</date>';
	echo '<text>'. htmlspecialchars($row[2], ENT_QUOTES, "UTF-8") .'</text>';	
	echo '<importance>'. $row[3] .'</importance>';	 	
	echo '<category>'. $row[4] .'</category>';	
	echo '<dateEnd>'.  $row[5] .'</dateEnd>';
	echo '<to_time>'.  $row[6] .'</to_time>'; 
	echo '</item>';
}
echo '</table>';

// Select PERSON.
// Selec persons which have birthday on this date.
$query = '';
$dateMonthDayStart = date('md', $dateStart);
$dateMonthDayEnd = date('md', $dateEnd);


function EchoPersonData($row, $currentYear)
{
	echo '<item id="'. $row[0] .'">';
	echo '<date>'. strval($currentYear).'-'.$row[3].'-'.$row[2] .'</date>';
	echo '<text>'. htmlspecialchars($row[1], ENT_QUOTES, "UTF-8").($row[4] == '' ? '' : ' ('.strval($currentYear - $row[4]).')') .'</text>';
	echo '<importance>'. $row[5] .'</importance>';
	echo '<category>'. $row[6] .'</category>';
	echo '</item>';
}

echo '<table name="person">';
if ($dateMonthDayStart <= $dateMonthDayEnd) {
	// Boths date lie in the same year.
	$query = "SELECT id,display_name,birthday_day,birthday_month,birthday_year,importance,category FROM ". $TABLE[PERSON]->GetTableName() ." WHERE (birthday_month * 100 + birthday_day) BETWEEN ". $dateMonthDayStart ." AND ". $dateMonthDayEnd;
	$currentYear = date('Y', $dateStart);
	$result = mysql_query($query);
	while($row = mysql_fetch_row($result)) {
		EchoPersonData($row, $currentYear);
	}
}
else {
	// dateEnd lies in the year after dateEnd
	$query = "SELECT id,display_name,birthday_day,birthday_month,birthday_year,importance,category FROM ". $TABLE[PERSON]->GetTableName() ." WHERE (birthday_month * 100 + birthday_day) >= ". $dateMonthDayStart;
	$currentYear = date('Y', $dateStart);
	$result = mysql_query($query);
	while($row = mysql_fetch_row($result)) {
		EchoPersonData($row, $currentYear);
	}
	$query = "SELECT id,display_name,birthday_day,birthday_month,birthday_year,importance,category FROM ". $TABLE[PERSON]->GetTableName() ." WHERE (birthday_month * 100 + birthday_day) <= ". $dateMonthDayEnd;
	$currentYear = date('Y', $dateEnd);
	$result = mysql_query($query);
	while($row = mysql_fetch_row($result)) {
		EchoPersonData($row, $currentYear);
	}
}
echo '</table>';

echo '</row>';

mysql_close();
?> 
