var VINYLS = null;
var latestVinyl = null;
var vinylcount = 0;

var Main = (function()
{

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
    if(!$('#hiddenfbidinput').length){ // if not already present
      $('#addvinylform').prepend('<input type="hidden" id="hiddenfbidinput" name="fbid" value="'+fbid+'">');
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
      content += '<td class="format">'+vinyls[index].Count+'x '+vinyls[index].Format+' '+vinyls[index].Type+' '+vinyls[index].Color+'</td>';
      content += '<td class="date">'+vinyls[index].Releasedate+'</td>';
      content += '<td class="itunes"><a href="'+vinyls[index].iTunes+'" title="buy digital version of'+vinyls[index].Artist+' - '+vinyls[index].Album+'">iTunes</a></td>';
      content += '<td class="price">'+vinyls[index].Price+'</td>';
      content += '<td class="sample"><audio controls onplay="Main.audioHandler()"><source src="'+vinyls[index].Sample+'" type="audio/mp4">Sorry. Your browser does not seem to support the m4a audio format.</audio></td>';
      content += '<td class="artistpic"><img src="'+vinyls[index].Artistpic+'" alt="'+vinyls[index].Artist+'"></td>';
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

  // check if element is in viewport or not (maybe used later)
  function _isScrolledIntoView(elem){
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom)
      && (elemBottom <= docViewBottom) &&  (elemTop >= docViewTop) );
  }

  // pause all other audio players when another audio is playing
  function _audioHandler(){
    console.log("playing!");
    // TODO: stop all others audio players..
  }

  // fetch vinyl Data before submitting form
  function _fetchData(){
    console.log("calling _fetchData");

    artist = $('input[name=artist]').val();
    album = $('input[name=title]').val();

    vinyl = {};

    $.when(

    // 1st get Label, Duration, artist pic and deezerlink from Deezer
    $.getJSON('http://api.deezer.com/search/album?q='+artist+' '+album+'&output=jsonp&callback=?', 
      function(result1){
        //console.log(data);
        albumID = result1.data[0].id;
        
        $.getJSON('http://api.deezer.com/album/'+albumID+'&output=jsonp&callback=?', 
        function(data){
            //console.log(data);
            vinyl.label = data.label;
            vinyl.duration = data.duration;
            vinyl.deezerlink = data.link;
            vinyl.artistPic = data.artist.picture;
        });
      }),

    // 2nd get artwork, audio sample and genre from iTunes
    $.getJSON('http://itunes.apple.com/search?term='+artist+' '+album+'&limit=1&callback=?', 
      function(data) {
        //console.log('http://itunes.apple.com/search?term='+artist+' '+album+'&limit=1&callback=?');
        //console.log(data);
        vinyl.artworkUrl = data.results[0].artworkUrl100;
        vinyl.sampleUrl = data.results[0].previewUrl;
        vinyl.genre = data.results[0].primaryGenreName;
        vinyl.price = data.results[0].collectionPrice;
        vinyl.itunesUrl = data.results[0].collectionViewUrl;
        vinyl.date = data.results[0].releaseDate.substring(0, 10); // truncate the time
      })
    ).done(function(){
      console.log(vinyl);
      $('#searchresult').text('Vinyl found!');

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

      // hide search button; show submit button
      $('#searchbutton').hide();
      $('input[type=submit]').css('display','inline-block');
    });

  }

	return{
		doAfterLogin: _doAfterLogin,
		addUserToDb: _addUserToDb,
    updateForms: _updateForms,
		getExistingData: _getExistingData,
    displayVinylData: _displayVinylData,
    isScrolledIntoView: _isScrolledIntoView,
    audioHandler: _audioHandler,
    fetchData: _fetchData
	}

})();

/* === Global Actions =========== */

$(document).ready(function(){
  console.log('document ready!');

  // Options for the "Add Vinyl" Ajax call
  var options = { 
    target:        '#response',   // target element(s) to be updated with server response 
    success:       successCallback,  // post-submit callback 
    clearForm:     true        // clear all form fields after successful submit 

    // other available options: 
    //url:       url         // override for form's 'action' attribute 
    //type:      type        // 'get' or 'post', override for form's 'method' attribute 
    //dataType:  null        // 'xml', 'script', or 'json' (expected server response type) 
    //resetForm: true        // reset the form after successful submit 

    // $.ajax options can be used here too, for example: 
    //timeout:   3000 
  };

  // Submit Add Vinyl Form and send Ajax request with form data
  $('#addvinylform').ajaxForm(options, function() { 
    alert("Thank you!"); 
  });

  function successCallback(response){
    var footable = $('.footable').data('footable');

    // Display added vinyl
    if(response.length){
      latestVinyl = $.parseJSON(response);
      var row = '<tr class="vinyl">';
      row += '<td><div class="vinyl-artwork"></div></td>';
      row += '<td class="vinyl-id">'+latestVinyl[0].VinylID+'</td>';
      row += '<td class="vinyl-artist">'+latestVinyl[0].Artist+'</td>';
      row += '<td class="vinyl-name">'+latestVinyl[0].Album+'</td>';
      row += '<td class="label"></td>';
      row += '<td class="format">'+latestVinyl[0].Format+' '+latestVinyl[0].Type+'</td>';
      row += '<td class="date"></td>';
      row += '<td class="itunes"></td>';
      row += '<td class="price"></td>';
      row += '<td class="sample"></td>';
      row += '<td class="artistpic"></td>';
      row += '<td class="genre"></td>';
      row += '<td><span class="delete fa fa-trash-o fa-fw"></span><span class="edit fa fa-pencil fa-fw"></span></td>';
      row+= '</tr>';
    }

    // Redraw the table
    footable.appendRow(row);
    footable.redraw();

    // Update the vinyl count
    vinylcount = vinylcount+1;
    $('#vinylcount').text(vinylcount);

    // TODO: get vinyl data...
  }

  // === ADD VINYL OVERLAY =========================================================

  // open overlay with add vinyl form
  $('#loggedInWrapper').on('click', '#addvinyl', function(){
    $('#overlay').fadeIn(200, function(){
      $(this).append('');
    });
  });

  // close overlay
  $('#overlay').on('click', '.close', function(){
    //$('#addVinylForm').remove();
    $('#overlay').fadeOut(200);
  })

  // === DELETE VINYL =====================================================

  $('#loggedInWrapper').on('click', '.delete', function(){
    // get Vinly ID from DOM
    var id = $(this).parent().siblings('.vinyl-id').text();
    var row = $(this).parents('tr:first');

    // confirm delete
    var r=confirm("Do you really want to delete this vinyl?");
    if (r==true)
    {
      $.ajax({
        type: 'POST',
        url: './php/deletevinyl.php',
        data: {
          facebookid: FBDATA.id,
          vinylid: id
        },
        success: function (response) {
          // remove vinyl from table
          var footable = $('.footable').data('footable');
          footable.removeRow(row);

          // update vinyl count
          vinylcount = vinylcount - 1;
          $('#vinylcount').text(vinylcount);
        },
        error: function () {
          console.warn('could not delete vinyl, ajax request failed');
        }
      });
    }
  });
  
});


