<?php

function ParseXMLInputStream($startElementHandler, $endElementHandler, $characterDataHandler)
{
    $xmlParser = xml_parser_create();
    xml_set_element_handler($xmlParser, $startElementHandler, $endElementHandler);
    xml_set_character_data_handler($xmlParser, $characterDataHandler);
    if (! ($inputStream = fopen("php://input", "r"))) {
        die("ParseXMLInputStream(): Could not open XML input.");
    }

    while ($data = fread($inputStream, 4096)) {
        if (! xml_parse($xmlParser, $data, feof($inputStream))) {
            exit(sprintf("ParseXMLInputStream(): XML error: %s at line %d",
                xml_error_string(xml_get_error_code($xmlParser)),
                xml_get_current_line_number($xmlParser)));
        }
    }
    xml_parser_free($xmlParser);
}

/**
 * Converts 'dd.mm.yyyy' into 'YYYY-MM-DD'.
 */
function PHP2SQLDate($date)
{
    $dateSQL = $date[6] . $date[7] . $date[8] . $date[9] . "-" . $date[3] . $date[4] . "-" . $date[0] . $date[1];

    return $dateSQL;
}

function Timestamp2SQLDate($timestamp)
{
    return '\'' . date('Y-m-d', $timestamp) . '\'';
}

function XMLHeader()
{
    header('content-type: text/xml; charset=utf-8');
}

function NormalizeMaxItemsCount($maxItemsCount)
{
    $maxItemsCount = filter_var($maxItemsCount, FILTER_VALIDATE_INT, [
        'options' => ['min_range' => 1, 'max_range' => 99999],
    ]);
    return $maxItemsCount === false ? 40 : $maxItemsCount;
}

function BuildGlobalFilter($minImportance)
{
    $filter = '';
    if ($minImportance > 0) {
        $filter .= "importance >= " . $minImportance;
    }
    return $filter;
}

// Build the shared WHERE and ORDER BY clauses. Additional filters are internal SQL predicates.
function BuildItemQuerySuffix($table, $minImportance, $filtertext, $additionalFilter = '')
{
    global $DBLink;

    $filters = [];
    $globalFilter = BuildGlobalFilter($minImportance);
    if ($globalFilter != '') {
        $filters[] = $globalFilter;
    }
    if ($additionalFilter != '') {
        $filters[] = "(" . $additionalFilter . ")";
    }

    $filterparts = preg_split('/\s+/', $filtertext, -1, PREG_SPLIT_NO_EMPTY);
    $displayTextMatches = [];
    foreach ($filterparts as $filterpart) {
        $filterpart = mysqli_real_escape_string($DBLink, $filterpart);
        $filters[] = "(" . $table->CreateQueryFilterMatches($filterpart) . ")";
        $displayTextMatches[] = "CASE WHEN " . $table->GetColumnDisplayText()
            . " LIKE '%" . $filterpart . "%' THEN 1 ELSE 0 END";
    }

    $order = [];
    if (count($displayTextMatches) > 0) {
        $order[] = "(" . implode(" + ", $displayTextMatches) . ") DESC";
    }
    $order[] = "importance DESC";
    if ($table->GetName() == EVENT || $table->GetName() == NOTE) {
        $order[] = $table->GetColumnDate() . " DESC";
    }

    return (count($filters) > 0 ? " WHERE " . implode(" AND ", $filters) : '')
        . " ORDER BY " . implode(", ", $order);
}

function DeleteLink($linkId)
{
    global $TABLE_LINK;
    global $TABLE_LINKINFO;
    global $DBLink;

    $query = "DELETE FROM " . $TABLE_LINK->GetTableName() . " WHERE id = " . $linkId;
    mysqli_query($DBLink, $query);

    // Delete related link infos.
    $query = 'DELETE FROM ' . $TABLE_LINKINFO->GetTableName() . ' WHERE link_id = ' . $linkId;
    mysqli_query($DBLink, $query);
}
