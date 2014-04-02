<?php
  // Connect to Database (host, user, pw, db)
  require('db_connect.php');

  $fbid = $_POST['facebookid'];
  $vinyl = json_decode($_POST['vinyldata']);

  $artist = isset($vinyl->artist) ? mysqli_real_escape_string($con, $vinyl->artist) : '-';
  $album = isset($vinyl->title) ? mysqli_real_escape_string($con, $vinyl->title) : '-';
  $label = isset($vinyl->label) ? mysqli_real_escape_string($con, $vinyl->label) : '-';
  $sample = isset($vinyl->sampleUrl) ? mysqli_real_escape_string($con, $vinyl->sampleUrl) : '-';
  $artistpic = isset($vinyl->artistPic) ? mysqli_real_escape_string($con, $vinyl->artistPic) : '-';
  $artwork = isset($vinyl->artworkUrl) ? mysqli_real_escape_string($con, $vinyl->artworkUrl) : '-';
  $catalog = isset($vinyl->catalog) ? mysqli_real_escape_string($con, $vinyl->catalog) : '-';
  $release = isset($vinyl->release) ? mysqli_real_escape_string($con, $vinyl->release) : '-';
  $price = isset($vinyl->price) ? mysqli_real_escape_string($con, $vinyl->price) : '-';
  $genre = isset($vinyl->genre) ? mysqli_real_escape_string($con, $vinyl->genre) : '-';
  $video = isset($vinyl->video) ? mysqli_real_escape_string($con, $vinyl->video) : '-';
  $duration = isset($vinyl->duration) ? mysqli_real_escape_string($con, $vinyl->duration) : '-';
  $count = 1; // TODO: needs to change (get from discogs)
  $type = "Album"; // TODO: needs to change (get from discogs)
  $size = "12in"; // TODO: needs to change (get from discogs)
  $color = "#000000";
  $tracklist = isset($vinyl->tracklist) ? mysqli_real_escape_string($con, $vinyl->tracklist) : '-';
  $itunes = isset($vinyl->itunes) ? mysqli_real_escape_string($con, $vinyl->itunesUrl) : '-';

  // 1. Write Vinyl to DB
  
  $exists = mysqli_query($con, "SELECT * FROM `".$fbid."` WHERE Artist='".$artist."' AND Album='".$album."'") or die(mysqli_error($con));

  if(mysqli_num_rows($exists) == 0){
    $sql = "INSERT INTO `".$fbid."` (Artist, Album, Label, Sample, Releasedate, Catalog, Price, Genre, Duration, Tracklist, Count, Format, Type, Color, Artwork, Artistpic, Video, iTunes)
    VALUES
    ('$artist','$album','$label','$sample','$release','$catalog','$price','$genre','$duration','$tracklist','$count','$size','$type','$color','$artwork','$artistpic','$video','$itunes')";

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