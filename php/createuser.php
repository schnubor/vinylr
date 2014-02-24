<?php
	// Connect to Database (host, user, pw, db)
	require('db_connect.php');
	
	$fbid = $_POST['facebookid'];
	$username = $_POST['username'];
	
	// Create completly new table based on the FB id

	$create = "CREATE TABLE IF NOT EXISTS `$fbid` (
	`VinylID` INT AUTO_INCREMENT NOT NULL,
	`Artist` VARCHAR(255),
	`Album` VARCHAR(255),
	`Label` VARCHAR(255),
	`Sample` VARCHAR(255),
	`Releasedate` VARCHAR(255),
	`Price` VARCHAR(255),
	`Genre` VARCHAR(255),
	`Duration` VARCHAR(255),
	`Tracklist` VARCHAR(2048),
	`Count` VARCHAR(255),
	`Format` VARCHAR(255),
	`Type` VARCHAR(255),
	`Color` VARCHAR(255),
	`Artwork` VARCHAR(255),
	`Artistpic` VARCHAR(255),
	`Video` VARCHAR(255),
	`iTunes` VARCHAR(255),
	PRIMARY KEY(VinylID)
	);";
	
	if (!mysqli_query($con,$create))
	{
	  echo('Error: ' . mysqli_error($con));
	}
	
	echo "data received: ".$username." ".$fbid;

	mysqli_close($con);
?>