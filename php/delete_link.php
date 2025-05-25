<?php
require_once 'constants.php';
require_once 'db.php';
require_once 'functions.php';

function startElement($parser, $name, $attributes)
{
    if ($name == 'ROW') {
        global $gQueryID;
        $gQueryID = $attributes['LINK_ID'];
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

ParseXMLInputStream("startElement", "endElement", "characterData");

mysqli_close($DBLink);

XMLHeader();
echo '<row id="' . $gQueryID . '"/>';
