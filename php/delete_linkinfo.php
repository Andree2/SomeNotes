<?php
require_once 'constants.php';
require_once 'db.php';
require_once 'functions.php';

function startElement($parser, $name, $attributes)
{
    if ($name == 'ROW') {
        global $gLinkInfoId;
        $gLinkInfoId = $attributes['LINKINFO_ID'];
    }
}

function endElement($parser, $name)
{
    global $gLinkInfoId;
    global $DBLink;
    global $TABLE_LINKINFO;

    if ($name == 'ROW') {
        $query = 'DELETE FROM ' . $TABLE_LINKINFO->GetTableName() . ' WHERE id = ' . $gLinkInfoId;
        mysqli_query($DBLink, $query);
    }
}

function characterData($parser, $data)
{
}

ParseXMLInputStream("startElement", "endElement", "characterData");

mysqli_close($DBLink);

XMLHeader();
echo '<row id="' . $gLinkInfoId . '"/>';
