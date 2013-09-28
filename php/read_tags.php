<?php
require_once('constants.php');
require_once('db.php');

XMLHeader();
echo '<row>';
// We want to select the following:
// 1. Row ID
// 3. Text to be displayed in the box
$query = "SELECT id,title,importance,category FROM ". $TABLE['tag']->GetTableName() . " ORDER BY title ASC";
$result = mysql_query($query);
while($row = mysql_fetch_row($result)) {
	echo '<item category="'.$row[3].'" table="tag" id="'. $row[0] .'" text="'. htmlspecialchars($row[1], ENT_QUOTES, "UTF-8") .'" importance="'. $row[2] .'"/>';
}	
echo '</row>';

mysql_close();
?> 
