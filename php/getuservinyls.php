<?php
	// Connect to Database (host, user, pw, db)
	$con = mysqli_connect("localhost","root","","vinylr");
	// Check connection
	if (mysqli_connect_errno())
	{
	  echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}

	$fbid = $_POST['facebookid'];

	$result = mysqli_query($con, "SELECT COUNT(col) FROM '$fbid'");
	$row = $result->fetch_row();
	echo '#: ', $row[0];

	// return table as json
?>