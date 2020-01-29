<?php
require_once 'constants.php';
require_once 'db.php';
require_once 'functions.php';

function BuildDisplayTextColumnFilter($table, $filterparts)
{
    $filter = '';
    if (count($filterparts) != 0) {
        for ($i = 0; $i < count($filterparts); $i++) {
            $filter .= " AND " . $table->GetColumnDisplayText() . " LIKE '%" . $filterparts[$i] . "%'";
        }
    }
    return $filter;
}

function startElement($parser, $name, $attributes)
{
    if ($name == 'ROW') {
        global $gFiltertext;
        global $gTable;
        global $gId;
        $gFiltertext = $attributes['FILTERTEXT'];
        $gTable = $attributes['TABLE'];
        $gId = $attributes['ID'];
    }
}

function endElement($parser, $name)
{
    if ($name == 'ROW') {
        global $gFiltertext;
        global $gTable;
        global $gId;
        global $gOutput;
        global $TABLE;
        global $DBLink;
        global $TABLE_LINK;
        global $TABLE_NAME_FROM_ID;

        $gOutput = '';
        $filterparts = explode(" ", $gFiltertext);
        $table = $TABLE[$gTable];

        // ------------------------- Read item -----------------------------
        $query = "SELECT " . $table->GetColumnDisplayText() . " FROM " . $table->GetTableName() . " WHERE id = $gId";
        $result = mysqli_query($DBLink, $query);
        $row = mysqli_fetch_row($result);
        $gOutput .= '<row text="' . htmlspecialchars($row[0], ENT_QUOTES, "UTF-8") . '">';

        // ------------------------- Read linked items -----------------------------
        $query = "SELECT table2_id, table2_item_id FROM " . $TABLE_LINK->GetTableName()
        . " WHERE table1_id = " . $table->GetID() . " AND table1_item_id = $gId";
        $result = mysqli_query($DBLink, $query);
        $query = "SELECT table1_id, table1_item_id FROM " . $TABLE_LINK->GetTableName()
        . " WHERE table2_id = " . $table->GetID() . " AND table2_item_id = $gId";
        $result2 = mysqli_query($DBLink, $query);

        // TODO: Evtl. mit optimizer hint? ... WITH (INDEX (index_name))

        $numberOfItems = 0;
        if (mysqli_num_rows($result) != 0 || mysqli_num_rows($result2) != 0) {
            $resultEmpty = false;

            while (true && $numberOfItems < MAX_NUMBER_LINKED_ITEMS) {
                if ($resultEmpty) {
                    $row = mysqli_fetch_row($result2);
                    if ($row == false) {
                        break;
                    }
                } else {
                    $row = mysqli_fetch_row($result);
                    if ($row == false) {
                        $resultEmpty = true;
                        continue;
                    }
                }
                $tableLinkName = $TABLE_NAME_FROM_ID[$row[0]];

                $hasDate = ($TABLE[$tableLinkName]->GetColumnDate() != '');

                $filter = BuildDisplayTextColumnFilter($TABLE[$tableLinkName], $filterparts);
                $query = "SELECT "
                . $TABLE[$tableLinkName]->GetColumnDisplayText()
                . ",importance "
                . ",category "
                . ($hasDate ? "," . $TABLE[$tableLinkName]->GetColumnDate() : "")
                . " FROM "
                . $TABLE[$tableLinkName]->GetTableName() . " WHERE id = $row[1]" . $filter;
                $resultLink = mysqli_query($DBLink, $query);
                $rowLink = mysqli_fetch_row($resultLink);
                if ($rowLink) {
                    $gOutput .= '<item category="' . $rowLink[2] . '" date="' . ($hasDate ? $rowLink[3] : "") . '" id="' . $row[1] . '" importance="' . $rowLink[1] . '" table="' . $tableLinkName . '" text="' . htmlspecialchars($rowLink[0], ENT_QUOTES, "UTF-8") . '" />';
                    ++$numberOfItems;
                }
            }
        }

    }
}

function characterData($parser, $data)
{
}

ParseXMLInputStream("startElement", "endElement", "characterData");
mysqli_close($DBLink);

XMLHeader();
echo $gOutput;
echo '</row>';
