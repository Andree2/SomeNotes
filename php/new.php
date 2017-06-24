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
        global $gQueryTable;
        $gQueryTable = $attributes['TABLE'];
    }
}

function endElement($parser, $name) 
{
    global $gValueList;
    global $gColumnList;
    global $gQueryTable;	
    global $TABLE;
    global $query;
        
    if ($name == 'ROW') {
        // Insert row (ID will be generated where necessary).
        $query = 'INSERT INTO '. $TABLE["$gQueryTable"]->GetTableName()." (CREATED,LAST_CHANGED$gColumnList) VALUES (NOW(),NOW()$gValueList)";
        mysql_query($query);
    }
    else {
        global $gItemContent;
        global $gDate;
        $gColumnList .= ",".$name;
        $gValueList .= ",".$TABLE["$gQueryTable"]->GetPostDataSQLFormat($gItemContent, $name, $TABLE);	
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
// and direclty call BuildEdit in javascript->OnStateChanged
XMLHeader();
echo '<row table="'.$gQueryTable.'" id="'.mysql_insert_id().'"';
if ($gDate != '') {
  echo ' date="'.$gDate.'"';	
}
echo '/>';

mysql_close();

?>
