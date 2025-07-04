<?php
require_once 'constants.php';
require_once 'db.php';
require_once 'functions.php';

function startElement($parser, $name, $attributes)
{
    if ($name == 'ROW') {
        global $gQueryID;
        global $gQueryTable;
        $gQueryTable = $attributes['TABLE'];
        $gQueryID    = $attributes['ID'];
    }
}

function endElement($parser, $name)
{
    global $gQueryID;
    global $gQueryTable;
    global $TABLE;
    global $TABLE_LINK;
    global $DBLink;

    if ($name == 'ROW') {
        $delelteItemQuery = 'DELETE FROM ' . $TABLE["$gQueryTable"]->GetTableName() . " WHERE id = $gQueryID LIMIT 1";
        mysqli_query($DBLink, $delelteItemQuery);

        // Delete links.
        $readLinksQuery  = 'SELECT id FROM ' . $TABLE_LINK->GetTableName() . ' WHERE (table1_id = ' . $TABLE["$gQueryTable"]->GetID() . " AND table1_item_id = $gQueryID) OR (table2_id = " . $TABLE["$gQueryTable"]->GetID() . " AND table2_item_id = $gQueryID)";
        $readLinksResult = mysqli_query($DBLink, $readLinksQuery);

        while ($linkRow = mysqli_fetch_row($readLinksResult)) {
            DeleteLink($linkRow[0]);
        }
    }
}

function characterData($parser, $data)
{
}

ParseXMLInputStream("startElement", "endElement", "characterData");

mysqli_close($DBLink);

XMLHeader();
echo '<row table="' . $gQueryTable . '" id="' . $gQueryID . '"/>';
