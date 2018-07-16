<?php
require_once('constants.php');
require_once('db.php');
require_once('functions.php');


function startElement($parser, $name, $attributes) 
{
    if ($name == 'ROW') {
        global $gQueryID1;
        global $gQueryTable1;
        global $gQueryID2;
        global $gQueryTable2;
        $gQueryTable1 = $attributes['TABLE1'];
        $gQueryID1 = $attributes['ID1'];
        $gQueryTable2 = $attributes['TABLE2'];
        $gQueryID2 = $attributes['ID2'];
    }
}

function endElement($parser, $name) 
{
    global $gQueryID1;
    global $gQueryTable1;
    global $gQueryID2;
    global $gQueryTable2;
    global $TABLE;
    global $TABLE_LINK;
    global $DBLink;
    
    if ($name == 'ROW') {
        $query = "DELETE FROM ". $TABLE_LINK->GetTableName() ." WHERE (table1_id = ". $TABLE["$gQueryTable1"]->GetID() ." AND table1_item_id = $gQueryID1 AND table2_id = ". $TABLE["$gQueryTable2"]->GetID() ." AND table2_item_id = $gQueryID2) OR (table1_id = ". $TABLE["$gQueryTable2"]->GetID() ." AND table1_item_id = $gQueryID2 AND table2_id = ". $TABLE["$gQueryTable1"]->GetID() ." AND table2_item_id = $gQueryID1)";
        mysqli_query($DBLink, $query);
    }
}

function characterData($parser, $data)
{
}

ParseXMLInputStream("startElement", "endElement", "characterData");

mysqli_close($DBLink);

XMLHeader();
echo '<row table1="'.$gQueryTable1.'" id1="'.$gQueryID1.' table2="'.$gQueryTable2.'" id2="'.$gQueryID2.'"/>';
?>
