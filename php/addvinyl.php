<?php
	// Connect to Database (host, user, pw, db)
	require('db_connect.php');

	// 1. Write Vinyl to DB
	$tracklist = mysql_real_escape_string($_POST['tracklist']);
	$artist = mysql_real_escape_string($_POST['artist_corrected']);
	$album = mysql_real_escape_string($_POST['album_corrected']);
	$sql = "INSERT INTO `$_POST[fbid]` (Artist, Album, Label, Sample, Releasedate, Price, Genre, Duration, Tracklist, Count, Format, Type, Color, Artwork, Artistpic, Video, iTunes)
	VALUES
	('$artist','$album','$_POST[label]','$_POST[sample]','$_POST[release]','$_POST[price]','$_POST[genre]','$_POST[duration]','$tracklist','$_POST[count]','$_POST[size]','$_POST[type]','$_POST[color]','$_POST[artwork]','$_POST[artistpic]','$_POST[video]','$_POST[itunes]')";

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