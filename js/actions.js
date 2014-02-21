var VINYLS = null;
var latestVinyl = null;
var vinylcount = 0;

var Main = (function()
{

  function _init(){
    Select.init(); // style selectboxes
    $("#colorpicker").spectrum({
      color: "#000000",
      showInput: true,
      preferedFormat: "hex6"
    });
  }

  // this is where stuff happens
	function _doAfterLogin(name, fbid){
		_addUserToDb(name, fbid);
    _updateForms(fbid);
		_getExistingData(fbid);
	}

	// Add username with his fb id to db
	function _addUserToDb(name, fbid){
  	//console.log('calling ajax with '+name+' and '+fbid);
  	$.ajax({
    		type: 'POST',
    		url: './php/createuser.php',
    		data: {
      		username: name,
      		facebookid: fbid
   		},
    		success: function (response) {
      		console.log("record has been saved in database: "+response);
    		},
    		error: function () {
      		console.warn('there is some error in the createuser ajax request');
    		}
  	});
	}

  // Update Add and Edit forms with hidden input containing FB ID
  function _updateForms(fbid){
    if($('#addvinylform').length){
      $('#addvinylform').prepend('<input type="hidden" id="hiddenfbidinput" name="fbid" value="'+fbid+'">');
    }
    else{
      $('#editvinylform').prepend('<input type="hidden" id="hiddenfbidinput" name="fbid" value="'+fbid+'">');
    }
  }

  // After logged in, get users vinyl Data and display it on success
	function _getExistingData(fbid){
    //console.log("calling _getExistingData");
		$.ajax({
    		type: 'POST',
    		url: './php/getuservinyls.php',
    		data: {
      		facebookid: fbid
   		},
    		success: function (response) {
          //console.log(response);
          if(response.length){
            VINYLS = $.parseJSON(response);
            _displayVinylData(VINYLS); // display the resceived data
          }
          else{ // no vinyls in DB yet
            $('.footable').hide();
            $('#vinylcount').text('0');
          }
    		},
    		error: function () {
      		console.warn('there is some error in the getuservinyls ajax request');
    		}
  	});
	}

  // Build actual Vinyl List and display it
  function _displayVinylData(vinyls){
    
    var index = 0;

    $.each(vinyls, function(){
      content = '<tr class="vinyl">';
      content += '<td><div class="vinyl-artwork"><img src="'+vinyls[index].Artwork+'" alt="'+vinyls[index].Artist+' - '+vinyls[index].Album+'"></div></td>'
      content += '<td class="vinyl-id">'+vinyls[index].VinylID+'</td>';
      content += '<td class="vinyl-artist">'+vinyls[index].Artist+'</td>';
      content += '<td class="vinyl-name">'+vinyls[index].Album+'</td>';
      content += '<td class="label">'+vinyls[index].Label+'</td>';
      content += '<td class="format">'+vinyls[index].Format+' '+vinyls[index].Type+'</td>';
      content += '<td class="count">'+vinyls[index].Count+'</td>'
      content += '<td class="color"><div class="circle" style="background-color:'+vinyls[index].Color+';">'+vinyls[index].Color+'</div></td>'
      content += '<td class="date">'+vinyls[index].Releasedate+'</td>';
      content += '<td class="itunes"><a href="'+vinyls[index].iTunes+'" title="buy digital version of '+vinyls[index].Artist+' - '+vinyls[index].Album+'">iTunes</a></td>';
      content += '<td class="price">'+vinyls[index].Price+'</td>';
      content += '<td class="sample"><audio controls onplay="Main.audioHandler()"><source src="'+vinyls[index].Sample+'" type="audio/mp4">Sorry. Your browser does not seem to support the m4a audio format.</audio></td>';
      content += '<td class="artistpic"><img src="'+vinyls[index].Artistpic+'" alt="'+vinyls[index].Artist+'"></td>';
      content += '<td class="video">'+vinyls[index].Video.replace(/(?:http:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g, '<iframe width="300" height="170" src="http://www.youtube.com/embed/$1" frameborder="0" allowfullscreen style="vertical-align: middle;"></iframe>')+'</td>';
      content += '<td class="genre">'+vinyls[index].Genre+'</td>';
      content += '<td><span class="delete fa fa-trash-o fa-fw"></span><span class="edit fa fa-pencil fa-fw"></span></td>';
      content += '</tr>';
      
      $('#tablecontent').append(content);
      index += 1;
    });

    // redraw the whole table
    $('.footable').trigger('footable_initialize');

    // update vinyl count
    vinylcount = vinyls.length;
    $('#vinylcount').text(vinylcount);
  }

  // pause all other audio players when another audio is playing
  function _audioHandler(){
    console.log("playing!");
    // TODO: stop all others audio players..
  }

  // fetch vinyl Data before submitting form
  function _fetchData(){
    console.log("calling _fetchData");

    var pickercolor = $("#colorpicker").spectrum("get").toHexString();
    $('input[name=color]').val(pickercolor);
    console.log(pickercolor);

    var artist = $('input[name=artist]').val();
    var album = $('input[name=title]').val();

    var vinyl = {};
    var releaseID;

    $.when(
      // 1st get Release ID from Discogs
      $.getJSON('http://api.discogs.com/database/search?type=release&q=title:'+album+'%20AND%20artist:'+artist+'%20AND%20format:%22vinyl%22&callback=?', 
        function(data){
          if(typeof data.data.results[0] === 'undefined'){  // nothing was found
            alert("Sorry, couldn't find this vinyl. Please try again.");
            return;
          }
          else{ 
            releaseID = data.data.results[0].id;
          }
        })
    ).done(function(){
      $.when(
        // 2nd get Discogs Release infos
        $.getJSON('http://api.discogs.com/releases/'+releaseID, 
          function(data){
            console.log(data);

            vinyl.label = data.labels[0].name;
            vinyl.genre = data.genres.join();
            vinyl.date = data.released;
            vinyl.artist = data.artists[0].name;
            vinyl.title = data.title;
            vinyl.video = data.videos[0].uri;

            console.log(data.labels[0].name);
          })
      ).done(function(){
        $.when(
          // 3rd get Album ID from Deezer
          $.getJSON('http://api.deezer.com/search/album?q='+artist+' '+album+'&output=jsonp&callback=?', 
            function(result1){
              //console.log(result1);
              if(typeof result1.data[0] === 'undefined'){  // nothing was found
                albumID = 'undefined';
              }
              else{ 
                albumID = result1.data[0].id;
              }
            })
        ).done(function(){
          $.when(
            // 4th get Duration, Deezer link and Artistpic from Deezer
            $.getJSON('http://api.deezer.com/album/'+albumID+'&output=jsonp&callback=?', 
              function(data){
                if(albumID !== 'undefined'){
                  vinyl.duration = data.duration;
                  vinyl.deezerlink = data.link;
                  vinyl.artistPic = data.artist.picture;
                }
                else{
                  vinyl.duration = '';
                  vinyl.deezerlink = '';
                  vinyl.artistPic = '';
                } 
              })
          ).done(function(){
            $.when(
              // 5th get artwork, audio sample from iTunes
              $.getJSON('http://itunes.apple.com/search?term='+artist+' '+album+'&limit=1&callback=?', 
                function(data) {
                  //console.log(data);
                  vinyl.artworkUrl = data.results[0].artworkUrl100;
                  vinyl.sampleUrl = data.results[0].previewUrl;
                  vinyl.price = data.results[0].collectionPrice;
                  vinyl.itunesUrl = data.results[0].collectionViewUrl;
                })
            ).done(function(){
              console.log(vinyl);
              
              // fill input values
              $('input[name=genre]').val(vinyl.genre);
              $('input[name=label]').val(vinyl.label);
              $('input[name=artistpic]').val(vinyl.artistPic);
              $('input[name=artwork]').val(vinyl.artworkUrl);
              $('input[name=sample]').val(vinyl.sampleUrl);
              $('input[name=itunes]').val(vinyl.itunesUrl);
              $('input[name=deezer]').val(vinyl.deezerlink);
              $('input[name=release]').val(vinyl.date);
              $('input[name=price]').val(vinyl.price);
              $('input[name=duration]').val(vinyl.duration);
              $('input[name=color]').val(pickercolor);
              $('input[name=video]').val(vinyl.video);
              $('input[name=artist-corrected]').val(vinyl.artist);
              $('input[name=album-corrected]').val(vinyl.title);

              // Preview the vinyl
              _showPreview(vinyl);
   
            });
          });
        });
      });
    });
  }

  // Show preview of vinyl after search
  function _showPreview(vinyl){
    // hide search button; show submit button; show preview
    $('#searchbutton').hide();
    $('#submitbutton').fadeIn();
    $('#preview').fadeIn();

    $('#preview .artwork').html('<img src="'+vinyl.artworkUrl+'" alt="artwork" width="100" height="100">');
    $('#preview .label-release-genre').html(vinyl.label+', '+vinyl.genre+', '+vinyl.date);
    $('#preview .sample').html('<audio controls onplay="Main.audioHandler()"><source src="'+vinyl.sampleUrl+'" type="audio/mp4">Sorry. Your browser does not seem to support the m4a audio format.</audio>');
  }

  // reset the "Add Vinyl" Form
  function _resetOverlay(){
    $('#overlay').fadeOut(200, function(){
      // check which form is present and remove it
      if($('#addvinylform').length){
        $('#addvinylform').remove();
      }
      else{
        $('#editvinylform').remove();
      }
    });
  }

	return{
    init: _init,
		doAfterLogin: _doAfterLogin,
		addUserToDb: _addUserToDb,
    updateForms: _updateForms,
		getExistingData: _getExistingData,
    displayVinylData: _displayVinylData,
    audioHandler: _audioHandler,
    fetchData: _fetchData,
    showPreview: _showPreview,
    resetOverlay: _resetOverlay
	}

})();


