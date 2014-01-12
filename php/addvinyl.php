<?php
	// Connect to Database (host, user, pw, db)
	$con = mysqli_connect("localhost","root","","vinylr");
	// Check connection
	if (mysqli_connect_errno())
	{
	  echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}

	echo 'Hello world from addvinyl.php!';

	mysqli_close($con);
?>