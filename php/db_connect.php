<?php	
	// production
	//$con = mysqli_connect("smileanddie.com","d018b145","20willi02","d018b145");

	// localhost
	$con = mysqli_connect("localhost","root","","vinylr");
	// Check connection
	if (mysqli_connect_errno())
	{
	  die ("Failed to connect to MySQL: " . mysqli_connect_error());
	}
?>