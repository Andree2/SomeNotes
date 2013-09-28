<?php
class Note extends Table
{	
    
    // ---------------------------------------- Getter ----------------------------------------
    /**
     * @brief Returns the names of all columns except <id> and <last_changed>.
     */
    public function GetColumns()
    {
    	return array('TITLE', 'TEXT', 'DATE', 'TIME', 'IMPORTANCE', 'CATEGORY');
    }
    
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
		if (   $column == 'IMPORTANCE'
		    || $column == 'CATEGORY') {
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

    // ---------------------------------------- SQL Queries ----------------------------------------
    
    public function GetQueryReadView($dateStartSQL, $dateEndSQL)
    {
    	return "SELECT id,date,title,importance,category FROM ". $this->GetTableName() ." WHERE date BETWEEN ". $dateStartSQL ." AND ". $dateEndSQL;
    }
    // ---------------------------------------- Other ----------------------------------------
    public function EchoXMLRow($row)
    {
		echo "<title>". htmlspecialchars ($row[2], ENT_QUOTES, "UTF-8") ."</title>";
		echo "<text>". htmlspecialchars ($row[3], ENT_QUOTES, "UTF-8") ."</text>";
		echo "<date>" . $row[4] . "</date>";
		echo "<time>" . $row[5] . "</time>";
		echo "<importance>" . $row[6] . "</importance>";
    echo "<category>" . $row[7] . "</category>";
    }
}
?>