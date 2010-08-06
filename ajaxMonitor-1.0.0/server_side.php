<?php
/**
 * Created by PhpStorm.
 * User: jgutierrez
 * Date: Jul 24, 2010
 * Time: 1:59:59 PM
 * To change this template use File | Settings | File Templates.
 */

error_reporting(0);

$testJson = array(
    'status' => 'success'
    ,'message' => 'Thank you for using ajaxMonitor!'
);

$wait = $_REQUEST['wait'];

if ($wait) {
    sleep($wait);
}

echo json_encode($testJson);

?>