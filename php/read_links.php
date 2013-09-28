<?php
require_once('constants.php');
require_once('db.php');
require_once('functions.php');

$table = $_GET['table'];
$id = $_GET['id'];

XMLHeader();
echo '<row>';
// ------------------------- Read links ----------------------------->
$query = "SELECT table2_id, table2_item_id FROM ". $TABLE[LINK]->GetTableName() 
         ." WHERE table1_id = ". $TABLE[$table]->GetID() ." AND table1_item_id = $id";
$result = mysql_query($query);
$query = "SELECT table1_id, table1_item_id FROM ". $TABLE[LINK]->GetTableName() 
         ." WHERE table2_id = ". $TABLE[$table]->GetID() ." AND table2_item_id = $id";
$result2 = mysql_query($query);

// TODO: Evtl. mit optimizer hint? ... WITH (INDEX (index_name))

if (mysql_num_rows($result) != 0 || mysql_num_rows($result2) != 0) {
	$resultEmpty = false;
	
	while(true){
		if ($resultEmpty) {			
			$row = mysql_fetch_row($result2);
			if ($row == false) {
				break;
			}
		}
		else {
			$row = mysql_fetch_row($result);
			if ($row == false) {
				$resultEmpty = true;
				continue;
			}
		}
		$tableLinkName = $TABLE_FROM_ID[$row[0]];
		
		$hasDate = ($TABLE[$tableLinkName]->GetColumnDate() != '');
		
		$query = "SELECT "
		         . $TABLE[$tableLinkName]->GetColumnDisplayText()
		         . ",importance "
		         . ",category "
		         . ($hasDate ? ",".$TABLE[$tableLinkName]->GetColumnDate() : "")
		         . " FROM "
		         . $TABLE[$tableLinkName]->GetTableName() ." WHERE id = $row[1]";
		$resultLink = mysql_query($query);
		$rowLink = mysql_fetch_row($resultLink);
		echo '<item category="'. $rowLink[2] .'" date="'. ($hasDate ? $rowLink[3] : "---") .'" id="'. $row[1] .'" importance="'. $rowLink[1] .'" table="'. $tableLinkName .'" text="'. htmlspecialchars($rowLink[0], ENT_QUOTES, "UTF-8") .'" />';
	}
}
// <-------------------------- Read links ----------------------------

echo '</row>';
mysql_close();
?> 