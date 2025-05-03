<?php
class Tag extends Table
{
    public function GetColumnDisplayText()
    {
        return 'TITLE';
    }

    public function GetName()
    {
        return 'tag';
    }

    public function GetID()
    {
        return 6;
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
                $columnValueMapSql[$column] = '\'' . addslashes($value) . '\'';
            }
        }
        return $columnValueMapSql;
    }

    public function GetTableName()
    {
        return 'lifelog_tags';
    }

    public function GetQueryReadRow($id)
    {
        return "SELECT id,created,last_changed,importance,category,title,text,induced_category FROM " . $this->GetTableName() . " WHERE id = $id";
    }

    /**
     * Puts out the row read from the SQL row as XML.
     */
    public function EchoXMLReadRow($row)
    {
        echo '<row id="' . $row['id'] . '" table="' . $this->GetName() . '" created="' . $row['created'] . '" last_changed="' . $row['last_changed'] . '" importance="' . $row['importance'] . '">';
        echo "<category>" . htmlspecialchars($row['category'], ENT_QUOTES, "UTF-8") . "</category>";
        echo "<title>" . htmlspecialchars($row['title'], ENT_QUOTES, "UTF-8") . "</title>";
        echo "<text>" . htmlspecialchars($row['text'], ENT_QUOTES, "UTF-8") . "</text>";
        echo "<induced_category>" . htmlspecialchars($row['induced_category'], ENT_QUOTES, "UTF-8") . "</induced_category>";
        echo "</row>";
    }
}
