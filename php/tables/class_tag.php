<?php
class Tag extends Table
{	
    
    /**
     * @brief Returns the names of all columns except <id> and <last_changed>.
     */
    public function GetColumns()
    {
    	return array('TITLE', 'TEXT', 'IMPORTANCE', 'CATEGORY');
    }
    
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

    // ---------------------------------------- Other ----------------------------------------
    public function EchoXMLRow($row)
    {
		echo "<title>". htmlspecialchars ($row[2], ENT_QUOTES, "UTF-8") ."</title>";
		echo "<text>". htmlspecialchars ($row[3], ENT_QUOTES, "UTF-8") ."</text>";
		echo "<importance>" . $row[4] . "</importance>";
    echo "<category>" . $row[5] . "</category>";
    }

    // ---------------------------------------- Other ----------------------------------------
    
}	
?>