<?php
	// Connect to Database (host, user, pw, db)
	$con = mysqli_connect("localhost","root","","vinylr");
	// Check connection
	if (mysqli_connect_errno())
	{
	  echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}

	$sql = "INSERT INTO `$_POST[fbid]` (Artist, Album, Label, Catalog, Year, Format, Type, Price, Genre)
	VALUES
	('$_POST[artist]','$_POST[title]','$_POST[label]','$_POST[catalog]','$_POST[year]','$_POST[size]','$_POST[type]','$_POST[price]','$_POST[genre]')";

	if (!mysqli_query($con,$sql))
	{
	  die('Error: ' . mysqli_error($con));
	}

	echo 'Written to DB!';

	mysqli_close($con);
?>