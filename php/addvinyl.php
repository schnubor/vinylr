<?php
	// Connect to Database (host, user, pw, db)
	require('db_connect.php');

	// 1. Write Vinyl to DB
	$tracklist = mysqli_real_escape_string($con, $_POST['tracklist']);
	$artist = mysqli_real_escape_string($con, $_POST['artist_corrected']);
	$album = mysqli_real_escape_string($con, $_POST['album_corrected']);
	$fbid = $_POST['fbid'];

	$exists = mysqli_query($con, "SELECT * FROM `".$fbid."` WHERE Artist='".$artist."' AND Album='".$album."'") or die(mysqli_error($con));

	if(mysqli_num_rows($exists) == 0){
		$sql = "INSERT INTO `$_POST[fbid]` (Artist, Album, Label, Sample, Releasedate, Catalog, Price, Genre, Duration, Tracklist, Count, Format, Type, Color, Artwork, Artistpic, Video, iTunes)
		VALUES
		('$artist','$album','$_POST[label]','$_POST[sample]','$_POST[release]','$_POST[catalog]','$_POST[price]','$_POST[genre]','$_POST[duration]','$tracklist','$_POST[count]','$_POST[size]','$_POST[type]','$_POST[color]','$_POST[artwork]','$_POST[artistpic]','$_POST[video]','$_POST[itunes]')";

		if (!mysqli_query($con,$sql))
		{
		  die('Error: ' . mysqli_error($con));
		}

		// 2. Read and return the last entry

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
	}
	else{
		echo "already exists!";
	}

	mysqli_close($con);
?>