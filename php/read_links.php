<?php
require_once 'constants.php';
require_once 'db.php';
require_once 'functions.php';

function startElement($parser, $name, $attributes)
{
    if ($name == 'ROW') {
        global $gFiltertext;
        global $gMinImportance;
        global $gShowNotes;
        global $gMaxItemsCount;
        global $gTable;
        global $gId;
        $gFiltertext    = $attributes['FILTERTEXT'];
        $gMinImportance = $attributes['MINIMPORTANCE'];
        $gShowNotes     = $attributes['SHOWNOTES'] == "true";
        $gMaxItemsCount = NormalizeMaxItemsCount(isset($attributes['MAXITEMSCOUNT']) ? $attributes['MAXITEMSCOUNT'] : null);
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
        global $gMaxItemsCount;
        global $gTable;
        global $gId;
        global $gOutput;
        global $TABLE;
        global $DBLink;
        global $TABLE_LINK;
        global $TABLE_LINKINFO;
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

        // Gather both link directions before ranking and limiting each item type.
        $linksByType = [];
        foreach ([$result, $result2] as $linkResult) {
            while ($row = mysqli_fetch_row($linkResult)) {
                $tableLinkName = $TABLE_NAME_FROM_ID[$row[1]];
                if ($tableLinkName == NOTE && ! $gShowNotes) {
                    continue;
                }
                $linksByType[$tableLinkName][(int) $row[2]][] = (int) $row[0];
            }
        }

        foreach ($linksByType as $tableLinkName => $linksByItem) {
            $linkedTable = $TABLE[$tableLinkName];
            $hasDate = ($linkedTable->GetColumnDate() != '');
            $itemIds = implode(',', array_map('intval', array_keys($linksByItem)));
            $querySuffix = BuildItemQuerySuffix($linkedTable, $gMinImportance, $gFiltertext, "id IN (" . $itemIds . ")");
            $query = "SELECT id," . $linkedTable->GetColumnDisplayText() . " AS item_text,importance,category"
                . ($hasDate ? "," . $linkedTable->GetColumnDate() . " AS item_date" : "")
                . " FROM " . $linkedTable->GetTableName() . $querySuffix . " LIMIT " . $gMaxItemsCount;
            $resultItems = mysqli_query($DBLink, $query);
            $itemsCount = 0;
            while ($itemsCount < $gMaxItemsCount && ($item = mysqli_fetch_assoc($resultItems))) {
                // Preserve each link and its metadata, including multiple links to the same item.
                foreach ($linksByItem[$item['id']] as $linkId) {
                    if ($itemsCount >= $gMaxItemsCount) {
                        break;
                    }
                    ++$itemsCount;
                    $gOutput .= '<item category="' . $item['category'] . '" date="' . ($hasDate ? $item['item_date'] : "") . '" id="' . $item['id'] . '" importance="' . $item['importance'] . '" linkId="' . $linkId . '" table="' . $tableLinkName . '" text="' . htmlspecialchars($item['item_text'], ENT_QUOTES, "UTF-8") . '">';

                    $readLinkInfoQuery  = "SELECT id,type,text FROM " . $TABLE_LINKINFO->GetTableName() . " WHERE link_id = " . $linkId;
                    $readLinkInfoResult = mysqli_query($DBLink, $readLinkInfoQuery);
                    while ($linkInfoRow = mysqli_fetch_row($readLinkInfoResult)) {
                        $gOutput .= '<linkInfo id="' . $linkInfoRow[0] . '" type="' . $linkInfoRow[1] . '" text="' . $linkInfoRow[2] . '" />';
                    }
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
