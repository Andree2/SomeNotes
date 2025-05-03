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
        global $gQueryID;
        global $gQueryTable;
        global $gColumnValueMap;
        $gQueryTable     = $attributes['TABLE'];
        $gQueryID        = $attributes['ID'];
        $gColumnValueMap = [];
    }
}

function endElement($parser, $name)
{
    global $gColumnValueMap;
    global $gQueryList;
    global $gQueryTable;
    global $gDate;
    global $TABLE;
    global $DBLink;

    if ($name == 'ROW') {
        global $gQueryID;

        $columnValueMapSql = $TABLE["$gQueryTable"]->GetPostDataSQLFormat($gColumnValueMap);
        $queryList         = '';
        foreach ($columnValueMapSql as $column => $value) {
            $queryList .= ",$column=" . $value;
        }

        // Update row
        $query = 'UPDATE ' . $TABLE["$gQueryTable"]->GetTableName() . " SET last_changed=NOW()$queryList WHERE id = $gQueryID";
        mysqli_query($DBLink, $query);
    } else {
        global $gItemContent;
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

mysqli_close($DBLink);

// TODO: Do not only send table and ID, but send whole object (see read_row.php, EchoXMLReadRow)
// and directly call BuildEdit in javascript->OnStateChanged

XMLHeader();
echo '<row table="' . $gQueryTable . '" id="' . $gQueryID . '"';
if ($gDate != '') {
    echo ' date="' . $gDate . '"';
}
echo '/>';
