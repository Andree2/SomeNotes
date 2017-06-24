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
    
    public function GetPostDataSQLFormat($value, $column, $tableGlobals)
    {
        if (   $column == 'IMPORTANCE'
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
        return 'lifelog_tags';
    }
    
    public function GetQueryReadRow($id)
    {
        return "SELECT id,created,last_changed,title,text,importance,category FROM ". $this->GetTableName() ." WHERE id = $id";
    }
    
    public function EchoXMLRow($row)
    {
        echo '<row id="'. $row['id'] .'" table="'. $this->GetName() .'" created="'. $row['created'] .'" last_changed="'. $row['last_changed'] .'" importance="'. $row['importance'] .'" category="'. $row['category'] .'">';
        echo "<title>". htmlspecialchars ($row['title'], ENT_QUOTES, "UTF-8") ."</title>";
        echo "<text>" . htmlspecialchars($row['text'], ENT_QUOTES, "UTF-8") . "</text>";
        echo "</row>";
    }
}
?>