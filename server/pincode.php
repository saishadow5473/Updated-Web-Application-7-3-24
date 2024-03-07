<?php
    // header('Access-Control-Allow-Origin: *');
    header("Access-Control-Allow-Origin: *");  // Allow requests from any origin
    header("Access-Control-Allow-Methods: GET");  // Allow only GET requests
    header("Access-Control-Allow-Headers: Content-Type");  // Allow the Content-Type header
    $response = "";

    if (isset($_GET['pincode_value'])) {
        $pincodeValue = $_GET['pincode_value'];
        $url = 'https://api.postalpincode.in/pincode/' . $pincodeValue;
      
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
      
        $response = curl_exec($ch);
      
        if ($response === false) {
          echo 'Error: ' . curl_error($ch);
        } else {
          echo $response;
        }
      
        curl_close($ch);
      } else {
        echo 'No pincode value provided.';
      }
?>