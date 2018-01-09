<?php
require_once('constants.php');
require_once('db.php');
require_once('functions.php');


function startElement($parser, $name, $attributes) 
{
  if ($name != 'ROW') return;

  global $table1Name;
  global $table1ItemID;
  global $table2Name;
  global $table2ItemID;
  $table1Name   = $attributes['TABLE1'];
  $table1ItemID = $attributes['TABLE1_ITEM_ID'];
  $table2Name   = $attributes['TABLE2'];
  $table2ItemID = $attributes['TABLE2_ITEM_ID'];
}

function endElement($parser, $name)
{
  if ($name != 'ROW') return;

  global $query;
  global $DBLink;
  global $TABLE;
  global $TABLE_LINK;
  global $table1Name;
  global $table1ItemID;
  global $table2Name;
  global $table2ItemID;

  // The IDs in links are restricted the following way:
  // - TABLE1.ID must always be smaller or equal to TABLE2.ID
  // - If TABLE1.ID == TABLE2.ID, TABLE1_ITEM_ID must always be smaller or equal to TABLE2_ITEM_ID
  // This way, we avoid two 'equal' links in opposite directions.
  
  $table1 = $TABLE[$table1Name];
  $table2 = $TABLE[$table2Name];

  if ($table1->GetID() > $table2->GetID()) {
    $temp = $table1;
    $table1 = $table2;
    $table2 = $temp;
    $temp = $table1ItemID;
    $table1ItemID = $table2ItemID;
    $table2ItemID = $temp;
  }
  else if ($table1->GetID() == $table2->GetID() && $table1ItemID > $table2ItemID) {
    $temp = $table1ItemID;
    $table1ItemID = $table2ItemID;
    $table2ItemID = $temp;
  }

  $query = 'INSERT INTO '. $TABLE_LINK->GetTableName()." (CREATED,TABLE1_ID,TABLE1_ITEM_ID,TABLE2_ID,TABLE2_ITEM_ID) VALUES (NOW(),".$table1->GetID().",$table1ItemID,".$table2->GetID().",$table2ItemID)";
  mysqli_query($DBLink, $query);

  // If table1 or table2 is a tag, set categories if applicable
  setCategoryFromTag($table1, $table1ItemID, $table2,$table2ItemID);
  setCategoryFromTag($table2, $table2ItemID, $table1,$table1ItemID);

  // Special case: if table1Item or table2Item is 'Me' and the other an event, set to 'event' (instead of the default 'event_others').
  setCategoryEvent($table1, $table1ItemID, $table2,$table2ItemID);
  setCategoryEvent($table2, $table2ItemID, $table1,$table1ItemID);
}

function characterData($parser, $data)
{
}

function setCategoryFromTag($tagTable, $tagItemID, $targetTable, $targetItemID)
{
  global $TABLE;
  
  // If not tag, nothing to do.
  if ($tagTable->GetID() != $TABLE[TAG]->GetID()) return;

  global $DBLink;
  global $query;

  // Otherwise, get the tag and see if it has a induced category
  $query = "SELECT induced_category FROM ". $TABLE[TAG]->GetTableName() ." WHERE id = $tagItemID";
  $result = mysqli_query($DBLink, $query);
  $row = mysqli_fetch_assoc($result);

  if ($row['induced_category'] == '') return;

  // A category is induced, edit this in the target table
  $query = 'UPDATE '.$targetTable->GetTableName()." SET category='". $row['induced_category'] ."' WHERE id = $targetItemID";
  mysqli_query($DBLink, $query);
}

function setCategoryEvent($sourceTable, $sourceItemID, $targetTable, $targetItemID)
{
  global $TABLE;
  
  // If not 'Me', nothing to do.
  if ($sourceItemID != 1 || $sourceTable->GetID() != $TABLE[PERSON]->GetID()) return;

  // If target not event, nothing to do.
  if ($targetTable->GetID() != $TABLE[EVENT]->GetID()) return;

  global $DBLink;
  
  // This is 'Me', set event category to 'event' (instead of the default 'event_others')
  $query = 'UPDATE '.$targetTable->GetTableName()." SET category='event' WHERE id = $targetItemID";
  mysqli_query($DBLink, $query);

}

ParseXMLInputStream("startElement", "endElement", "characterData");

global $query;
XMLHeader();
  echo '<row>'.$query.'</row>';

mysqli_close($DBLink);

?>
