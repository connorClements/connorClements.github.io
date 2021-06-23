<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	$weatherUrl='http://api.openweathermap.org/data/2.5/weather?lat=' . $_POST['latitude'] . '&lon=' . $_POST['longitude'] . '&appid=4a8f19fa8e7d5abd147eb46d2e7361bc';

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL, $weatherUrl); 

	$resultWeather=curl_exec($ch);

    curl_close($ch);

	$decode = json_decode($resultWeather,true);
    
    $output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms"; 
	$output['list'] = $decode; 
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 


?>