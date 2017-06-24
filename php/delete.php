<?php
require_once('constants.php');
require_once('db.php');
require_once('functions.php');


function startElement($parser, $name, $attributes) 
{
    if ($name == 'ROW') {
        global $gQueryID;
        global $gQueryTable;
        $gQueryTable = $attributes['TABLE'];
        $gQueryID = $attributes['ID'];
    }
}

function endElement($parser, $name) 
{
    global $gQueryID;
    global $gQueryTable;
    global $TABLE;
    
    if ($name == 'ROW') {
        $query = 'DELETE FROM '. $TABLE["$gQueryTable"]->GetTableName() ." WHERE id = $gQueryID LIMIT 1";
        mysql_query($query);
        // Delete links.
        $query = 'DELETE FROM '. $TABLE[LINK]->GetTableName() .' WHERE (table1_id = '.$TABLE["$gQueryTable"]->GetID()." AND table1_item_id = $gQueryID) OR (table2_id = ".$TABLE["$gQueryTable"]->GetID()." AND table2_item_id = $gQueryID)";
        mysql_query($query);
    }
}

function characterData($parser, $data)
{
}

ParseXMLInputStream("startElement", "endElement", "characterData");

mysql_close();

XMLHeader();
echo '<row table="'.$queryTable.'" id="'.$queryID.'"/>';
?>
