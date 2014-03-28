<?php
  // Connect to Database (host, user, pw, db)
  require('db_connect.php');

  $fbid = $_POST['facebookid'];
  $vinyl = json_decode($_POST['vinyldata']);

  $artist = mysqli_real_escape_string($con, $vinyl->artist);
  $album = mysqli_real_escape_string($con, $vinyl->title);
  $label = $vinyl->label;
  $sample = $vinyl->sampleUrl;
  $artistpic = $vinyl->artistPic;
  $artwork = $vinyl->artworkUrl;
  $catalog = $vinyl->catalog;
  $date = $vinyl->date;
  $price = $vinyl->price;
  $genre = $vinyl->genre;
  $video = $vinyl->video;
  $duration = $vinyl->duration;
  $count = 1; // TODO: needs to change (get from discogs)
  $type = "Album"; // TODO: needs to change (get from discogs)
  $size = "12in"; // TODO: needs to change (get from discogs)
  $color = "#000000";
  $tracklist = mysqli_real_escape_string($con, $vinyl->tracklist);
  $itunes = $vinyl->itunesUrl;

  // 1. Write Vinyl to DB
  
  $exists = mysqli_query($con, "SELECT * FROM `".$fbid."` WHERE Artist='".$artist."' AND Album='".$album."'") or die(mysqli_error($con));

  if(mysqli_num_rows($exists) == 0){
    $sql = "INSERT INTO `".$fbid."` (Artist, Album, Label, Sample, Releasedate, Catalog, Price, Genre, Duration, Tracklist, Count, Format, Type, Color, Artwork, Artistpic, Video, iTunes)
    VALUES
    ('$artist','$album','$label','$sample','$date','$catalog','$price','$genre','$duration','$tracklist','$count','$size','$type','$color','$artwork','$artistpic','$video','$itunes')";

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