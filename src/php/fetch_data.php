<?php

    header("Content-Type: application/json; charset=UTF-8");
    require('login.php');

    $data = [];
    $atrium = [];
    $lounge = [];
    $syokudo = [];
    
    $conn = mysqli_connect( $db['host'],$db['user'],$db['pass'],$db['dbname'] );
    $res = mysqli_query($conn,"SELECT management_id as 管理ID, congestion_rate as 混雑割合, insertion_time as 挿入時刻 FROM atrium_count ORDER BY 挿入時刻 DESC;");

    while($row = mysqli_fetch_array($res)){
        array_push($atrium,$row[1]);
    }

    $res = mysqli_query($conn,"SELECT management_id as 管理ID, congestion_rate as 混雑割合, insertion_time as 挿入時刻 FROM lounge_count ORDER BY 挿入時刻 DESC;");

    while($row = mysqli_fetch_array($res)){
        array_push($lounge,$row[1]);
    }

    $res = mysqli_query($conn,"SELECT management_id as 管理ID, congestion_rate as 混雑割合, insertion_time as 挿入時刻 FROM syokudo_count ORDER BY 挿入時刻 DESC;");

    while($row = mysqli_fetch_array($res)){
        array_push($syokudo,$row[1]);
    }

    $data['atrium'] = $atrium;
    $data['lounge'] = $lounge;
    $data['syokudo'] = $syokudo;
    echo json_encode($data);

    exit;
?>  