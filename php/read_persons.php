<?php
require_once('constants.php');
require_once('db.php');

XMLHeader();
echo '<row>';
// We want to select the following:
// 1. Row ID
// 3. Text to be displayed in the box
      $query = "SELECT id,"
          . $TABLE[PERSON]->GetColumnDisplayText()
          . ",importance "
          . ",category "
          . " FROM "
          . $TABLE['person']->GetTableName() . " ORDER BY ". $TABLE[PERSON]->GetColumnDisplayText() ." ASC";
$result = mysql_query($query);
while($row = mysql_fetch_row($result)) {
	echo '<item category="'. $row[3] .'" id="'. $row[0] .'" importance="'. $row[2] .'" table="person" text="'. htmlspecialchars($row[1], ENT_QUOTES, "UTF-8") .'"/>';
}
echo '</row>';

mysql_close();
?> 
