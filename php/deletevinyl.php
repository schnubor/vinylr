<?php
	// Connect to Database (host, user, pw, db)
	require('db_connect.php');

	$fbid = $_POST['facebookid'];
	$id = $_POST['vinylid'];
	// 1. Write Vinyl to DB

	$sql = "DELETE from `".$fbid."` where VinylID=".$id;

	if (!mysqli_query($con,$sql))
	{
	  die('Error: ' . mysqli_error($con));
	}
?>