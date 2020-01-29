<?php

function ParseXMLInputStream($startElementHandler, $endElementHandler, $characterDataHandler)
{
    $xmlParser = xml_parser_create();
    xml_set_element_handler($xmlParser, $startElementHandler, $endElementHandler);
    xml_set_character_data_handler($xmlParser, $characterDataHandler);
    if (!($inputStream = fopen("php://input", "r"))) {
        die("ParseXMLInputStream(): Could not open XML input.");
    }

    while ($data = fread($inputStream, 4096)) {
        if (!xml_parse($xmlParser, $data, feof($inputStream))) {
            die(sprintf("ParseXMLInputStream(): XML error: %s at line %d",
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

function BuildColumnFilter($table, $filterparts)
{
    $filter = '';
    for ($i = 0; $i < count($filterparts); $i++) {
        if ($i > 0) {
            $filter .= " AND";
        }
        $displayTextSearch = $table->GetColumnDisplayText() . " LIKE '%" . $filterparts[$i] . "%'";
        if ($table->GetColumnDate() == '') {
            $filter .= " " . $displayTextSearch;
        } else {
            $filter .= " (" . $displayTextSearch . " OR " . $table->GetColumnDate() . " LIKE '%" . $filterparts[$i] . "%')";
        }
    }
    return $filter;
}
