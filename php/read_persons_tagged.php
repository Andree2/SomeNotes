<?php
require_once 'constants.php';
require_once 'db.php';
require_once 'functions.php';

// Select all tags ordered by importance.
$queryTags = "SELECT id,title,importance,category FROM " . $TABLE['tag']->GetTableName() . " ORDER BY importance DESC";
$resultTags = mysqli_query($DBLink, $queryTags);

XMLHeader();
echo '<row>';

while ($rowTags = mysqli_fetch_row($resultTags)) {
    // ------------------------- linked persons ----------------------------->
    $query = "SELECT table2_item_id FROM " . $TABLE_LINK->GetTableName()
    . " WHERE table1_id = " . $TABLE[TAG]->GetID() . " AND table1_item_id = $rowTags[0]"
    . " AND table2_id = " . $TABLE[PERSON]->GetID();
    $result = mysqli_query($DBLink, $query);
    $query = "SELECT table1_item_id FROM " . $TABLE_LINK->GetTableName()
    . " WHERE table2_id = " . $TABLE[TAG]->GetID() . " AND table2_item_id = $rowTags[0]"
    . " AND table1_id = " . $TABLE[PERSON]->GetID();
    $result2 = mysqli_query($DBLink, $query);

    if (mysqli_num_rows($result) != 0 || mysqli_num_rows($result2) != 0) {
        // ------------------------- tag item -----------------------------
        echo '<item category="' . $rowTags[3] . '" table="tag" id="' . $rowTags[0] . '" importance="' . $rowTags[2] . '" text="' . htmlspecialchars($rowTags[1], ENT_QUOTES, "UTF-8") . '">';

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
            $query = "SELECT id,"
            . $TABLE[PERSON]->GetColumnDisplayText()
            . ",importance "
            . ",category "
            . " FROM "
            . $TABLE[PERSON]->GetTableName() . " WHERE id = $row[0]";
            $resultLink = mysqli_query($DBLink, $query);
            $rowLink = mysqli_fetch_row($resultLink);
            echo '<item category="' . $rowLink[3] . '" id="' . $rowLink[0] . '" importance="' . $rowLink[2] . '" table="person" text="' . htmlspecialchars($rowLink[1], ENT_QUOTES, "UTF-8") . '"/>';
        }
        echo '</item>';
    }
}
// <-------------------------- Read links ----------------------------

echo '</row>';
mysqli_close($DBLink);
