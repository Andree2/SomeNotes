<?php
class Event extends Table
{
    public function GetColumnDate()
    {
        return 'FROM_DATE';
    }

    public function GetColumnDisplayText()
    {
        return 'TITLE';
    }

    public function GetName()
    {
        return 'event';
    }

    public function GetID()
    {
        return 1;
    }

    public function GetPostDataSQLFormat($columnValueMap)
    {
        $columnValueMapSql = [];
        foreach ($columnValueMap as $column => $value) {
            if ($column == 'IMPORTANCE') {
                if ($value == '') {
                    $columnValueMapSql[$column] = 'NULL';
                } else {
                    $columnValueMapSql[$column] = $value;
                }
            } else {
                if ($column == 'FROM_TIME' || $column == 'TO_TIME') {
                    $value = $value . ':00';
                }
                $columnValueMapSql[$column] = '\'' . addslashes($value) . '\'';
            }
        }
        return $columnValueMapSql;
    }

    public function GetTableName()
    {
        return 'lifelog_events';
    }

    public function GetQueryReadRow($id)
    {
        return "SELECT id,created,last_changed,importance,category,title,text,from_date,from_time,to_date,to_time FROM " . $this->GetTableName() . " WHERE id = $id";
    }

    /**
     * Puts out the row read from the SQL row as XML.
     */
    public function EchoXMLReadRow($row)
    {
        echo '<row id="' . $row['id'] . '" table="' . $this->GetName() . '" created="' . $row['created'] . '" last_changed="' . $row['last_changed'] . '" from_date="' . $row['from_date'] . '" from_time="' . $row['from_time'] . '" to_date="' . $row['to_date'] . '" to_time="' . $row['to_time'] . '" importance="' . $row['importance'] . '">';
        echo "  <title>" . htmlspecialchars($row['title'], ENT_QUOTES, "UTF-8") . "</title>";
        echo "  <text>" . htmlspecialchars($row['text'], ENT_QUOTES, "UTF-8") . "</text>";
        echo "  <category>" . htmlspecialchars($row['category'], ENT_QUOTES, "UTF-8") . "</category>";
        echo "</row>";
    }
}
