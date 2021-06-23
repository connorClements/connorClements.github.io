<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	$news = 'https://newsapi.org/v2/top-headlines?country=' . $_POST['countryCode'] . '&apiKey=9c138e2673bc4c2691be1b5e3af3dac3';

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL, $news); 

	$result=curl_exec($ch);

    curl_close($ch);

	$decode = json_decode($result,true);
    
    $output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms"; 
	$output['data'] = $decode; 
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>

