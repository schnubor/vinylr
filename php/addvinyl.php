<?php
	// Connect to Database (host, user, pw, db)
	$con = mysqli_connect("localhost","root","","vinylr");
	// Check connection
	if (mysqli_connect_errno())
	{
	  echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}

	// 1. Write Vinyl to DB

	$sql = "INSERT INTO `$_POST[fbid]` (Artist, Album, Label, Catalog, Year, Format, Type, Price, Genre)
	VALUES
	('$_POST[artist]','$_POST[title]','$_POST[label]','$_POST[catalog]','$_POST[year]','$_POST[size]','$_POST[type]','$_POST[price]','$_POST[genre]')";

	if (!mysqli_query($con,$sql))
	{
	  die('Error: ' . mysqli_error($con));
	}

	// 2. Read and return the last entry

	$fbid = $_POST['fbid'];
	$result = mysqli_query($con, "SELECT * FROM `".$fbid."` ORDER BY VinylID DESC LIMIT 1") or die(mysqli_error($con));
	$jsonData = array();

	// return table as json
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