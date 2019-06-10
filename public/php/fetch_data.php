<?php
    header("Content-Type: application/json; charset=UTF-8");

    $conn = mysqli_connect("localhost","organic_select","organic_MySQL","organic");
    $res = mysqli_query($conn,"SELECT atrium_id as 管理ID, atrium_percent as 混雑割合, atrium_timestamp as 挿入時刻 FROM atrium_count ORDER BY 挿入時刻 DESC;");

    $data = [];

    while($row = mysqli_fetch_array($res)){
        array_push($data,$row[1]);
    }

    echo json_encode($data);
exit;

?>  