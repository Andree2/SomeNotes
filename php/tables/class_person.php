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
    
    public function GetPostDataSQLFormat($value, $column, $tableGlobals)
    {
        if (   $column == 'BIRTHDAY_DAY' 
            || $column == 'BIRTHDAY_MONTH'
            || $column == 'BIRTHDAY_YEAR'
            || $column == 'IMPORTANCE'
            || $column == 'CATEGORY') {
            if ($value == '') {
                return 'NULL';
            }
            else {
                return $value;
            }
        }
        return '\''.addslashes($value).'\'';	
    }
    
    public function GetTableName()
    {
        return 'lifelog_persons';
    }
    
    public function GetQueryReadRow($id)
    {
        return "SELECT id,created,last_changed,display_name,first_name,middle_name,last_name,birthday_day,birthday_month,birthday_year,text,importance,category FROM ". $this->GetTableName() ." WHERE id = $id";
    }
    
    public function EchoXMLRow($row)
    {
        echo '<row id="'. $row['id'] .'" table="'. $this->GetName() .'" created="'. $row['created'] .'" last_changed="'. $row['last_changed'] .'" birthday_day="'. $row['birthday_day'] .'" birthday_month="'. $row['birthday_month'] .'" birthday_year="'. $row['birthday_year'] .'" importance="'. $row['importance'] .'" category="'. $row['category'] .'">';
        echo "<display_name>". htmlspecialchars($row['display_name'], ENT_QUOTES, "UTF-8") ."</display_name>";
        echo "<first_name>" . htmlspecialchars($row['first_name'], ENT_QUOTES, "UTF-8") . "</first_name>";
        echo "<middle_name>" . htmlspecialchars($row['middle_name'], ENT_QUOTES, "UTF-8") . "</middle_name>";
        echo "<last_name>" . htmlspecialchars($row['last_name'], ENT_QUOTES, "UTF-8") . "</last_name>";
        echo "<text>" . htmlspecialchars($row['text'], ENT_QUOTES, "UTF-8") . "</text>";
        echo "</row>";
    }
}
?>