<?php

$conn = mysqli_connect("localhost","organic_select","organic_MySQL","organic");
$res = mysqli_query($conn,"SELECT atrium_id as 管理ID, atrium_percent as 混雑割合, atrium_timestamp as 挿入時刻 FROM atrium_count ORDER BY 挿入時刻 DESC;");

$data = "";

while($row = mysqli_fetch_array($res)){
		// print( 	$row[1]."<br>" );
		$data = $row[1];
		break;
}

?>

<script>
	var data = <?php echo json_encode($data); ?>;
</script>

<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<title>TDU Congestion</title>
</head>
<body>
	<header class="header">TDU Congestion</header>

	<div class="status">
		<div class="status-place">Atrium</div>
		<div class="status-congestion">
			<div class="status-congestion-meter-wrap">
				<div class="status-congestion-meter"></div>
			</div>
			<div class="status-congestion-percentage">50%</div>
		</div>
	</div>

	<canvas id="canvas"></canvas>
	<script src="./js/script.js"></script>
	<link rel="stylesheet" href="./css/style.css">
</body>
</html>