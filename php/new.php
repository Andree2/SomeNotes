<?php
require_once 'constants.php';
require_once 'db.php';
require_once 'functions.php';

global $gQueryTable;
global $gQueryID;
global $gDate;

function startElement($parser, $name, $attributes)
{
    global $gItemContent;
    $gItemContent = '';

    if ($name == 'ROW') {
        global $gQueryTable;
        global $gColumnValueMap;
        $gQueryTable     = $attributes['TABLE'];
        $gColumnValueMap = [];
    }
}

function endElement($parser, $name)
{
    global $gColumnValueMap;
    global $gQueryTable;
    global $TABLE;
    global $query;
    global $DBLink;

    if ($name == 'ROW') {
        $columnValueMapSql = $TABLE["$gQueryTable"]->GetPostDataSQLFormat($gColumnValueMap);
        $columnList        = '';
        $valueList         = '';
        foreach ($columnValueMapSql as $column => $value) {
            $columnList .= "," . $column;
            $valueList .= "," . $value;
        }

        // Insert row (ID will be generated where necessary).
        $query = 'INSERT INTO ' . $TABLE["$gQueryTable"]->GetTableName() . " (CREATED,LAST_CHANGED$columnList) VALUES (NOW(),NOW()$valueList)";
        mysqli_query($DBLink, $query);
    } else {
        global $gItemContent;
        global $gDate;
        $gColumnValueMap[$name] = $gItemContent;
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

// TODO: Do not only send table and ID, but send whole object (see read_row.php, EchoXMLReadRow)
// and directly call BuildEdit in javascript->OnStateChanged
XMLHeader();
echo '<row table="' . $gQueryTable . '" id="' . mysqli_insert_id($DBLink) . '"';

mysqli_close($DBLink);

if ($gDate != '') {
    echo ' date="' . $gDate . '"';
}
echo '/>';
