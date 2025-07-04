<?php
class Person extends Table
{
    // ---------------------------------------- Getter ----------------------------------------
    public function GetColumnDisplayText()
    {
        return 'DISPLAY_NAME';
    }

    public function GetName()
    {
        return 'person';
    }

    public function GetID()
    {
        return 5;
    }

    public function GetPostDataSQLFormat($columnValueMap)
    {
        $columnValueMapSql = [];
        foreach ($columnValueMap as $column => $value) {
            if ($column == 'BIRTH_DAY'
                || $column == 'BIRTH_MONTH'
                || $column == 'BIRTH_YEAR'
                || $column == 'DEATH_DAY'
                || $column == 'DEATH_MONTH'
                || $column == 'DEATH_YEAR'
                || $column == 'IMPORTANCE') {
                if ($value == '') {
                    $columnValueMapSql[$column] = 'NULL';
                } else {
                    $columnValueMapSql[$column] = $value;
                }
            } else if ($column == 'BIRTH_ESTIMATED') {
                $columnValueMapSql[$column] = $value;
            } else {
                $columnValueMapSql[$column] = '\'' . addslashes($value) . '\'';
            }
        }
        return $columnValueMapSql;
    }

    public function GetTableName()
    {
        return 'lifelog_persons';
    }

    public function GetQueryReadRow($id)
    {
        return "SELECT id,created,last_changed,importance,category,display_name,first_name,middle_name,last_name,birth_day,birth_month,birth_year,birth_estimated,death_day,death_month,death_year,sex,text FROM " . $this->GetTableName() . " WHERE id = $id";
    }

    /**
     * Puts out the row read from the SQL row as XML.
     */
    public function EchoXMLReadRow($row)
    {
        echo '<row id="' . $row['id'] . '" table="' . $this->GetName() . '" created="' . $row['created'] . '" last_changed="' . $row['last_changed'] . '" birth_day="' . $row['birth_day'] . '" birth_month="' . $row['birth_month'] . '" birth_year="' . $row['birth_year'] . '" birth_estimated="' . $row['birth_estimated'] . '" death_day="' . $row['death_day'] . '" death_month="' . $row['death_month'] . '" death_year="' . $row['death_year'] . '" importance="' . $row['importance'] . '">';
        echo "  <display_name>" . htmlspecialchars($row['display_name'], ENT_QUOTES, "UTF-8") . "</display_name>";
        echo "  <first_name>" . htmlspecialchars($row['first_name'], ENT_QUOTES, "UTF-8") . "</first_name>";
        echo "  <middle_name>" . htmlspecialchars($row['middle_name'], ENT_QUOTES, "UTF-8") . "</middle_name>";
        echo "  <last_name>" . htmlspecialchars($row['last_name'], ENT_QUOTES, "UTF-8") . "</last_name>";
        echo "  <sex>" . htmlspecialchars($row['sex'], ENT_QUOTES, "UTF-8") . "</sex>";
        echo "  <text>" . htmlspecialchars($row['text'], ENT_QUOTES, "UTF-8") . "</text>";
        echo "  <category>" . htmlspecialchars($row['category'], ENT_QUOTES, "UTF-8") . "</category>";
        echo "</row>";
    }
}
