<?php
abstract class Table
{
    // ---------------------------------------- Getter ----------------------------------------
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
    
    public function GetQueryReadRow($id)
    {
        return '';
    }
    
    public function EchoXMLRow($row)
    {
        return '';
    }
}
?>