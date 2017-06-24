<?php
require_once('constants.php');
require_once('db.php');
require_once('functions.php');

global $gQueryTable;
global $gQueryID;
global $gDate;

function startElement($parser, $name, $attributes) 
{
    global $gItemContent;
    $gItemContent = '';
    
    if ($name == 'ROW') {
        global $gQueryID;
        global $gQueryTable;
        $gQueryTable = $attributes['TABLE'];
        $gQueryID = $attributes['ID'];
    }
}

function endElement($parser, $name) 
{
    global $gQueryList;
    global $gQueryTable;
    global $gDate;
    global $TABLE;
    global $DBLink;
    
    if ($name == 'ROW') {
        global $gQueryID;
        $query = 'UPDATE '.$TABLE["$gQueryTable"]->GetTableName()." SET last_changed=NOW()$gQueryList WHERE id = $gQueryID";
        mysqli_query($DBLink, $query);
    }
    else {
        global $gItemContent;
        $gQueryList .= ",$name=".$TABLE["$gQueryTable"]->GetPostDataSQLFormat($gItemContent, $name, $TABLE);
        if ($name == $TABLE["$gQueryTable"]->GetColumnDate()) {
            $gDate = $gItemContent;
        }
    }
}

function characterData($parser, $data)
{
    global $gItemContent;
    $gItemContent .= $data;
}

ParseXMLInputStream("startElement", "endElement", "characterData");

//TODO: Do not only send table and ID, but send whole object (see read_row.php, EchoXMLRow)
// and directly call BuildEdit in javascript->OnStateChanged

XMLHeader();
echo '<row table="'.$gQueryTable.'" id="'.$gQueryID.'"';
if ($gDate != '') {
    echo ' date="'.$gDate.'"';
}
echo '/>';


mysqli_close($DBLink);

?>
