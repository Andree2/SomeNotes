<?php
class Note extends Table
{
    public function GetColumnDate()
    {
        return 'DATE';
    }
    
    public function GetColumnDisplayText()
    {
        return 'TITLE';
    }
    
    public function GetName()
    {
        return 'note';
    }
    
    public function GetID()
    {
        return 2;
    }

    public function GetPostDataSQLFormat($value, $column, $tableGlobals)
    {
        if (   $column == 'IMPORTANCE') {
            if ($value == '') {
                return 'NULL';
            }
            else {
                return $value;
            }
        }
        elseif ($column == 'TIME') {
            $value = $value.':00';
        }
        
        return '\''.addslashes($value).'\'';
    }
    
    public function GetTableName()
    {
        return 'lifelog_notes';
    }
    
    public function GetQueryReadRow($id)
    {
        return "SELECT id,created,last_changed,importance,category,title,text,date,time FROM ". $this->GetTableName() ." WHERE id = $id";
    }
    
    public function EchoXMLRow($row)
    {
        echo '<row id="'. $row['id'] .'" table="'. $this->GetName() .'" created="'. $row['created'] .'" last_changed="'. $row['last_changed'] .'" date="'. $row['date'] .'" time="'. $row['time'] .'" importance="'. $row['importance'] .'" category="'. $row['category'] .'">';
        echo "<title>". htmlspecialchars ($row['title'], ENT_QUOTES, "UTF-8") ."</title>";
        echo "<text>". htmlspecialchars ($row['text'], ENT_QUOTES, "UTF-8") ."</text>";
        echo "</row>";
    }
}
?>