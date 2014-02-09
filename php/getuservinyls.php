<?php
	// Connect to Database (host, user, pw, db)
	require('db_connect.php');

	$fbid = $_POST['facebookid'];
	$result = mysqli_query($con, "SELECT * FROM `".$fbid."`") or die(mysqli_error($con));
	$jsonData = array();

	// return table as json
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
?>