<?php
require_once 'constants.php';
require_once 'db.php';
require_once 'functions.php';

function startElement($parser, $name, $attributes)
{
    global $gItemContent;
    $gItemContent = '';

    if ($name == 'ROW') {
        global $gLinkId;
        global $gText;
        $gLinkId = $attributes['LINK_ID'];
        $gText   = $attributes['TEXT'];
    }
}

function endElement($parser, $name)
{
    if ($name == 'ROW') {
        global $gLinkId;
        global $gText;
        global $gType;
        global $TABLE_LINKINFO;
        global $DBLink;

        $query = 'INSERT INTO ' . $TABLE_LINKINFO->GetTableName() . " (CREATED,LINK_ID,LAST_CHANGED,TYPE,TEXT) VALUES (NOW()," . $gLinkId . ",NOW(),'" . $gType . "','" . $gText . "')";
        mysqli_query($DBLink, $query);
    } else if ($name == 'TYPE') {
        global $gItemContent;
        global $gType;

        $gType = $gItemContent;
    }
}

function characterData($parser, $data)
{
    global $gItemContent;
    $gItemContent .= $data;
}

ParseXMLInputStream("startElement", "endElement", "characterData");

mysqli_close($DBLink);

XMLHeader();
echo '<row />';
