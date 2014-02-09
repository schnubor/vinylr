<?php
	// Connect to Database (host, user, pw, db)
	require('db_connect.php');

	$fbid = $_POST['facebookid'];
	$id = $_POST['vinylid'];

	$sql = "DELETE from `".$fbid."` where VinylID=".$id;

	if (!mysqli_query($con,$sql))
	{
	  die('Error: ' . mysqli_error($con));
	}

	echo "delete done.";

	mysqli_close($con);
?>