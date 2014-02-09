<?php
	// Connect to Database (host, user, pw, db)
	require('db_connect.php');

	// 1. Write Vinyl to DB

	$sql = "INSERT INTO `$_POST[fbid]` (Artist, Album, Label, Sample, Releasedate, Price, Genre, Duration, Tracklist, Count, Format, Type, Color, Artwork, Artistpic, iTunes)
	VALUES
	('$_POST[artist]','$_POST[title]','$_POST[label]','$_POST[sample]','$_POST[release]','$_POST[price]','$_POST[genre]','$_POST[duration]','$_POST[tracklist]','$_POST[count]','$_POST[size]','$_POST[type]','$_POST[color]','$_POST[artwork]','$_POST[artistpic]','$_POST[itunes]')";

	if (!mysqli_query($con,$sql))
	{
	  die('Error: ' . mysqli_error($con));
	}

	// 2. Read and return the last entry

	$fbid = $_POST['fbid'];
	$result = mysqli_query($con, "SELECT * FROM `".$fbid."` ORDER BY VinylID DESC LIMIT 1") or die(mysqli_error($con));
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