<?php
require_once('constants.php');
require_once('db.php');
require_once('functions.php');


function startElement($parser, $name, $attributes) 
{
  if ($name == 'ROW') {
    global $gValueList;
    global $TABLE;
    $table1ID     = $TABLE[LINK]->GetPostDataSQLFormat($attributes['TABLE1_ID'], 'TABLE1_ID', $TABLE);
    $table1ItemID = $attributes['TABLE1_ITEM_ID'];
    $table2ID     = $TABLE[LINK]->GetPostDataSQLFormat($attributes['TABLE2_ID'], 'TABLE2_ID', $TABLE);
    $table2ItemID = $attributes['TABLE2_ITEM_ID'];

    // The IDs in links are sorted the following way:
    // - TABLE1_ID must always be smaller or equal to TABLE2_ID
    // - If TABLE1_ID == TABLE2_ID, TABLE1_ITEM_ID must always be smaller or equal to TABLE2_ITEM_ID
    // This way, we avoid two 'equal' links in opposite directions.
    
    if ($table1ID > $table2ID) {
      $temp = $table1ID;
      $table1ID = $table2ID;
      $table2ID = $temp;
      $temp = $table1ItemID;
      $table1ItemID = $table2ItemID;
      $table2ItemID = $temp;
    }
    else if ($table1ID == $table2ID && $table1ItemID > $table2ItemID) {
      $temp = $table1ItemID;
      $table1ItemID = $table2ItemID;
      $table2ItemID = $temp;
    }
    $gValueList = ''.$table1ID.','.$table1ItemID.','.$table2ID.','.$table2ItemID;
  }
}

function endElement($parser, $name)
{
  if ($name == 'ROW') {
    global $TABLE;
    global $gValueList;
    global $query;
    $query = 'INSERT INTO '. $TABLE[LINK]->GetTableName()." (CREATED,LAST_CHANGED,TABLE1_ID,TABLE1_ITEM_ID,TABLE2_ID,TABLE2_ITEM_ID) VALUES (NOW(),NOW(),$gValueList)";
    mysqli_query($DBLink, $query);
  }
}

function characterData($parser, $data)
{
}

ParseXMLInputStream("startElement", "endElement", "characterData");

global $query;
XMLHeader();
  echo '<row>'.$query.'</row>';

mysqli_close($DBLink);

?>
