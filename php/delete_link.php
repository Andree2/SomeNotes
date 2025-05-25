<?php
require_once 'constants.php';
require_once 'db.php';
require_once 'functions.php';

function startElement($parser, $name, $attributes)
{
    if ($name == 'ROW') {
        global $gQueryID;
        $gQueryID = $attributes['ID'];
    }
}

function endElement($parser, $name)
{
    global $gQueryID;
    global $TABLE;
    global $DBLink;

    if ($name == 'ROW') {
        DeleteLink($gQueryID);
    }
}

function characterData($parser, $data)
{
}

function DeleteLink($linkId)
{
    global $TABLE_LINK;
    global $DBLink;

    $query = "DELETE FROM " . $TABLE_LINK->GetTableName() . " WHERE id = " . $linkId;
    mysqli_query($DBLink, $query);
    // Delete link info.
    $query = 'DELETE FROM ' . $TABLE_LINKINFO->GetTableName() . ' WHERE link_id = ' . $linkId;
    mysqli_query($DBLink, $query);
}

ParseXMLInputStream("startElement", "endElement", "characterData");

mysqli_close($DBLink);

XMLHeader();
echo '<row id="' . $gQueryID . '"/>';
