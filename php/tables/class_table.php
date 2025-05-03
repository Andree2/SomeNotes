<?php
abstract class Table
{
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

    public function GetPostDataSQLFormat($columnValueMap)
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

    /**
     * Puts out the row read from the SQL row as XML.
     */
    public function EchoXMLReadRow($row)
    {
        return '';
    }
}
