<?php
abstract class Table
{	
    // ---------------------------------------- Getter ----------------------------------------
    /**
     * @brief Returns the names of all columns except <id> and <last_changed>.
     */
    public function GetColumns()
    {
    	return '';
    }
    
    public function GetColumnDate()
    {
    	return '';
    }
    
    public function GetColumnDisplayText()
    {
    	return '';
    }
    
    public function GetName()
    {
    	return '';
    }
    
    public function GetID()
    {
    	return 0;
    }
    
	public function GetPostDataSQLFormat($value, $column, $tableGlobals)
	{
    	return '';
	}
	
    public function GetTableName()
    {
    	return '';
    }

    // ---------------------------------------- SQL Queries ----------------------------------------

    public function GetQueryReadView($dateStartSQL, $dateEndSQL)
    {
    	return '';
    }
    
    public function EchoXMLRow($row)
    {
    	return '';
    }
	
    // ---------------------------------------- Other ----------------------------------------
	
}	
?>