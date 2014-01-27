<?php
	// Connect to Database (host, user, pw, db)
	require('db_connect.php');

	$fbid = $_POST['facebookid'];
	$id = $_POST['id'];
	// 1. Write Vinyl to DB

	$sql = "DELETE from `".$fbid."` where id=".$id;

	if (!mysqli_query($con,$sql))
	{
	  die('Error: ' . mysqli_error($con));
	}
?>