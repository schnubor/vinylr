<?php
	// Connect to Database (host, user, pw, db)
	require('db_connect.php');

	$fbid = $_POST['fbid'];
	$vinylid = $_POST['vinylid'];

	$size = $_POST['size'];
	$type = $_POST['type'];
	$count = $_POST['count'];
	$color = $_POST['color'];

	// 1. Write Vinyl to DB

	$sql = "UPDATE `".$fbid."` SET Color='".$color."' WHERE VinylID='".$vinylid."'";

	if (!mysqli_query($con,$sql))
	{
	  die('Error: ' . mysqli_error($con));
	}

	// 2. Read and return the last entry

	$result = mysqli_query($con, "SELECT * FROM `".$fbid."` WHERE VinylID=".$vinylid) or die(mysqli_error($con));
	$jsonData = array();

	// return result as json
	if($result){
		if(mysqli_num_rows($result)){

		    while($row= $result->fetch_array(MYSQL_ASSOC)){

		        $jsonData[] = $row;
		    }
		    echo json_encode($jsonData);
		}
	}
	else{
		echo $result;
	}

	mysqli_close($con);
?>