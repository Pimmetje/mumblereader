<?php
//include the parser
require('MumbleReader.class.php');
// GET
$port = (isset($_GET['port']))?filter_input(INPUT_GET, 'port', FILTER_VALIDATE_INT):0;
$id = (isset($_GET['id']))?filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT):0;

$mReader = new MumbleReader($port);
if($id > 0) {
    $mReader->setId($id);
}

//Make sure page is not cached
header ("Expires: Thu, 17 May 2001 10:17:17 GMT");    // Date in the past
header ("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT"); // always modified
header ("Cache-Control: no-cache, must-revalidate");  // HTTP/1.1
header ("Pragma: no-cache");                          // HTTP/1.0
//header ("Content-type: application/json"); //Not sure if this is nice because sometimes it will return json but for the rest it returns javascrpt
//output the json
echo $mReader->render();
