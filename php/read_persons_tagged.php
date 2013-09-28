<?php
require_once('constants.php');
require_once('db.php');
require_once('functions.php');

// Select all tags ordered by importance.
$queryTags = "SELECT id,title,importance,category FROM ". $TABLE['tag']->GetTableName() . " ORDER BY importance DESC";
$resultTags = mysql_query($queryTags);

XMLHeader();
echo '<row>';

while($rowTags = mysql_fetch_row($resultTags)) {
	// ------------------------- linked persons ----------------------------->
	$query = "SELECT table2_item_id FROM ". $TABLE[LINK]->GetTableName() 
			." WHERE table1_id = ". $TABLE[TAG]->GetID() ." AND table1_item_id = $rowTags[0]"
			." AND table2_id = ". $TABLE[PERSON]->GetID();
	$result = mysql_query($query);
	$query = "SELECT table1_item_id FROM ". $TABLE[LINK]->GetTableName() 
			." WHERE table2_id = ". $TABLE[TAG]->GetID() ." AND table2_item_id = $rowTags[0]"
			." AND table1_id = ". $TABLE[PERSON]->GetID();
	$result2 = mysql_query($query);
	
	if (mysql_num_rows($result) != 0 || mysql_num_rows($result2) != 0) {	
		// ------------------------- tag item -----------------------------	
		echo '<item category="'.$rowTags[3].'" table="tag" id="'. $rowTags[0] .'" importance="'. $rowTags[2] .'" text="'. htmlspecialchars($rowTags[1], ENT_QUOTES, "UTF-8") .'">';
		
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
			$query = "SELECT id,"
					. $TABLE[PERSON]->GetColumnDisplayText()
					. ",importance "
					. ",category "
					. " FROM "
					. $TABLE[PERSON]->GetTableName() ." WHERE id = $row[0]";
			$resultLink = mysql_query($query);
			$rowLink = mysql_fetch_row($resultLink);
			echo '<item category="'. $rowLink[3] .'" id="'. $rowLink[0] .'" importance="'. $rowLink[2] .'" table="person" text="'. htmlspecialchars($rowLink[1], ENT_QUOTES, "UTF-8") .'"/>';
		}	
		echo '</item>';
	}
}
// <-------------------------- Read links ----------------------------


echo '</row>';
mysql_close();
?> 