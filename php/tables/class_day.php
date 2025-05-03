<?php
class Day extends Table
{
    public function GetColumnDate()
    {
        return 'FROM_DATE';
    }

    public function GetColumnDisplayText()
    {
        return 'CATEGORY';
    }

    public function GetName()
    {
        return 'day';
    }

    public function GetID()
    {
        return 7;
    }

    public function GetPostDataSQLFormat($columnValueMap)
    {
        $columnValueMapSql = [];
        foreach ($columnValueMap as $column => $value) {
            $columnValueMapSql[$column] = '\'' . addslashes($value) . '\'';
        }
        return $columnValueMapSql;
    }

    public function GetTableName()
    {
        return 'lifelog_days';
    }

    public function GetQueryReadRow($id)
    {
        return "SELECT id,created,last_changed,category,from_date,to_date FROM " . $this->GetTableName() . " WHERE id = $id";
    }

    /**
     * Puts out the row read from the SQL row as XML.
     */
    public function EchoXMLReadRow($row)
    {
        echo '<row id="' . $row['id'] . '" table="' . $this->GetName() . '" created="' . $row['created'] . '" last_changed="' . $row['last_changed'] . '" from_date="' . $row['from_date'] . '" to_date="' . $row['to_date'] . '">';
        echo "  <category>" . htmlspecialchars($row['category'], ENT_QUOTES, "UTF-8") . "</category>";
        echo "</row>";
    }
}
