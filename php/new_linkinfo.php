<?php
require_once 'constants.php';
require_once 'db.php';
require_once 'functions.php';

function startElement($parser, $name, $attributes)
{
    if ($name != 'ROW') {
        return;
    }

    global $gLinkId;
    $gLinkId = $attributes['LINK_ID'];
}

function endElement($parser, $name)
{
    if ($name != 'ROW') {
        return;
    }

    global $gLinkId;
    global $TABLE_LINKINFO;
    global $DBLink;

    $query = 'INSERT INTO ' . $TABLE_LINKINFO->GetTableName() . " (CREATED,LINK_ID,LAST_CHANGED,TYPE,TEXT) VALUES (NOW()," . $gLinkId . ",NOW(),'home_address','linkInfoText')";
    mysqli_query($DBLink, $query);
}

function characterData($parser, $data)
{
}

ParseXMLInputStream("startElement", "endElement", "characterData");

mysqli_close($DBLink);

XMLHeader();
echo '<row />';
