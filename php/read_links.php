<?php
require_once 'constants.php';
require_once 'db.php';
require_once 'functions.php';

define('MAX_NUMBER_LINKED_EVENT_NOTES', 40);

function BuildFilter($table, $minImportance, $filtertext)
{
    $filter = BuildGlobalAndTextFilter($table, $minImportance, $filtertext);
    if ($filter == '') {
        return '';
    }
    return " AND " . $filter;
}

function startElement($parser, $name, $attributes)
{
    if ($name == 'ROW') {
        global $gFiltertext;
        global $gMinImportance;
        global $gShowNotes;
        global $gTable;
        global $gId;
        $gFiltertext    = $attributes['FILTERTEXT'];
        $gMinImportance = $attributes['MINIMPORTANCE'];
        $gShowNotes     = $attributes['SHOWNOTES'] == "true";
        $gTable         = $attributes['TABLE'];
        $gId            = $attributes['ID'];
    }
}

function endElement($parser, $name)
{
    if ($name == 'ROW') {
        global $gFiltertext;
        global $gMinImportance;
        global $gShowNotes;
        global $gTable;
        global $gId;
        global $gOutput;
        global $TABLE;
        global $DBLink;
        global $TABLE_LINK;
        global $TABLE_NAME_FROM_ID;

        $table = $TABLE[$gTable];

        // ------------------------- Read item -----------------------------
        $query   = "SELECT " . $table->GetColumnDisplayText() . " FROM " . $table->GetTableName() . " WHERE id = $gId";
        $result  = mysqli_query($DBLink, $query);
        $row     = mysqli_fetch_row($result);
        $gOutput = '<row text="' . htmlspecialchars($row[0], ENT_QUOTES, "UTF-8") . '">';

        // ------------------------- Read links -----------------------------
        $query = "SELECT id,table2_id, table2_item_id FROM " . $TABLE_LINK->GetTableName()
        . " WHERE table1_id = " . $table->GetID() . " AND table1_item_id = $gId ORDER BY table2_item_id DESC";
        $result = mysqli_query($DBLink, $query);
        $query  = "SELECT id,table1_id, table1_item_id FROM " . $TABLE_LINK->GetTableName()
        . " WHERE table2_id = " . $table->GetID() . " AND table2_item_id = $gId ORDER BY table1_item_id DESC";
        $result2 = mysqli_query($DBLink, $query);

        // TODO: Evtl. mit optimizer hint? ... WITH (INDEX (index_name))

        $numberOfEventsNotes = 0;
        if (mysqli_num_rows($result) != 0 || mysqli_num_rows($result2) != 0) {
            $resultEmpty = false;

            while (true) {
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
                $linkId        = $row[0];
                $tableId       = $row[1];
                $itemId        = $row[2];
                $tableLinkName = $TABLE_NAME_FROM_ID[$tableId];

                $hasDate = ($TABLE[$tableLinkName]->GetColumnDate() != '');

                $filter = BuildFilter($TABLE[$tableLinkName], $gMinImportance, $gFiltertext);
                // Read linked item
                $query = "SELECT "
                . $TABLE[$tableLinkName]->GetColumnDisplayText()
                . ",importance,category"
                . ($hasDate ? "," . $TABLE[$tableLinkName]->GetColumnDate() : "")
                . " FROM "
                . $TABLE[$tableLinkName]->GetTableName() . " WHERE id = $itemId" . $filter;
                $resultLink = mysqli_query($DBLink, $query);
                $rowLink    = mysqli_fetch_row($resultLink);
                if ($rowLink) {
                    if ($tableLinkName == NOTE && ! $gShowNotes) {
                        continue;
                    }
                    // Only show MAX_NUMBER_LINKED_EVENT_NOTES items of type 'event' and 'note'
                    if ($tableLinkName == EVENT || $tableLinkName == NOTE) {
                        if ($numberOfEventsNotes >= MAX_NUMBER_LINKED_EVENT_NOTES) {
                            continue;
                        }
                        ++$numberOfEventsNotes;
                    }

                    // Read link info
                    $linkInfo = '<linkInfo type="parent_child" text="test" />';

                    $gOutput .= '<item category="' . $rowLink[2] . '" date="' . ($hasDate ? $rowLink[3] : "") . '" id="' . $itemId . '" importance="' . $rowLink[1] . '" table="' . $tableLinkName . '" text="' . htmlspecialchars($rowLink[0], ENT_QUOTES, "UTF-8") . '">';
                    $gOutput .= $linkInfo;
                    $gOutput .= '</item>';
                }
            }
        }

        $gOutput .= '</row>';
    }
}

function characterData($parser, $data)
{
}

ParseXMLInputStream("startElement", "endElement", "characterData");
mysqli_close($DBLink);

XMLHeader();
echo $gOutput;
