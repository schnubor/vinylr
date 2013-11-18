<?php
	$con = mysqli_connect("localhost","root","","vinylr");
	// Check connection
	if (mysqli_connect_errno())
	{
	  echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}
	
	$fbid = $_POST['facebookid'];
	$username = $_POST['username'];

	$sql = "INSERT INTO users (name, fbid)
	VALUES
	('$_POST[username]','$_POST[facebookid]')";

	if (!mysqli_query($con,$sql))
	{
	  echo('Error: ' . mysqli_error($con));
	}
	
	$create = "CREATE TABLE IF NOT EXISTS `$fbid` (
	`VinylID` INT AUTO_INCREMENT NOT NULL,
	`Artist` VARCHAR(255),
	`Album` VARCHAR(255),
	`Label` VARCHAR(255),
	`Catalog` VARCHAR(255),
	`Year` VARCHAR(255),
	`Format` VARCHAR(255),
	`Type` VARCHAR(255),
	PRIMARY KEY(VinylID)
	);";
	
	if (!mysqli_query($con,$create))
	{
	  echo('Error: ' . mysqli_error($con));
	}
	
	echo "data received: ".$username." ".$fbid;

	mysqli_close($con);
?>