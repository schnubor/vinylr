// === Globals ======================

var VINYLS = [];
var sortedVinyls = [];
var paginationVinyls = [];
var latestVinyl = null;
var vinylcount = 0;
var pageSize = 15;
var currentPage = 1;
var pages = 0;
var footable_initiliazed = false;

// === Main actions =================

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
    _init();
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
            _displayVinylData(VINYLS, 'artist'); // display the resceived data and sort by artist / price / title / color
          }
          else{ // no vinyls in DB yet
            console.log("no vinyls yet");
            $('.footable').hide();
            vinylcount = 0;
            $('#vinylcount').text(vinylcount);
          }
    		},
    		error: function () {
      		console.warn('there is some error in the getuservinyls ajax request');
    		}
  	});
	}

  // Build actual Vinyl List and display it
  function _displayVinylData(vinyls, sortKey){
    //console.log("call _displayVinylData");

    var sortingFilter = '';

    // if footable is invisible, show it
    if(!$('.footable').is(':visible')){
      $('.footable').show();
    }

    // get sorting order
    var ascending = true;
    $('.sort-toggle').hasClass('asc') ? ascending=true : ascending=false;

    switch(sortKey)
    {
      case 'artist':
        console.log("sort by artist!");
        sortingFilter = "sorted by artist.";
        // Sort by artist
        if(ascending){
          vinyls.sort(function(a,b){
            if(a.Artist.toUpperCase() < b.Artist.toUpperCase()) return -1;
            if(a.Artist.toUpperCase() > b.Artist.toUpperCase()) return 1;
            return 0;
          });
        }
        else{ // desscending
          vinyls.sort(function(a,b){
            if(a.Artist.toUpperCase() > b.Artist.toUpperCase()) return -1;
            if(a.Artist.toUpperCase() < b.Artist.toUpperCase()) return 1;
            return 0;
          });
        }
        break;
      case 'title':
        console.log("sort by title!");
        sortingFilter = "sorted by title.";
        // Sort by title
        if(ascending){
          vinyls.sort(function(a,b){
            if(a.Album.toUpperCase() < b.Album.toUpperCase()) return -1;
            if(a.Album.toUpperCase() > b.Album.toUpperCase()) return 1;
            return 0;
          });
        }
        else{ // desscending
          vinyls.sort(function(a,b){
            if(a.Album.toUpperCase() > b.Album.toUpperCase()) return -1;
            if(a.Album.toUpperCase() < b.Album.toUpperCase()) return 1;
            return 0;
          });
        }
        break;
      case 'label':
        console.log("sort by label!");
        sortingFilter = "sorted by label.";
        // Sort by title
        if(ascending){
          vinyls.sort(function(a,b){
            if(a.Label.toUpperCase() < b.Label.toUpperCase()) return -1;
            if(a.Label.toUpperCase() > b.Label.toUpperCase()) return 1;
            return 0;
          });
        }
        else{ // desscending
          vinyls.sort(function(a,b){
            if(a.Label.toUpperCase() > b.Label.toUpperCase()) return -1;
            if(a.Label.toUpperCase() < b.Label.toUpperCase()) return 1;
            return 0;
          });
        }
        break;
      case 'price':
        console.log("sort by price!");
        sortingFilter = "sorted by price.";
        // Sort by price
        if(ascending){
          vinyls.sort(function(a,b){
            if(parseFloat(a.Price) < parseFloat(b.Price)) return -1;
            if(parseFloat(a.Price) > parseFloat(b.Price)) return 1;
            return 0;
          });
        }
        else{
          vinyls.sort(function(a,b){
            if(parseFloat(a.Price) > parseFloat(b.Price)) return -1;
            if(parseFloat(a.Price) < parseFloat(b.Price)) return 1;
            return 0;
          });
        }
        break;
      case 'color':
        console.log("sort by color!");
        sortingFilter = "sorted by color.";
        // Sort by artist
        if(ascending){
          vinyls.sort(function(a,b){
            if(a.Color.toUpperCase() < b.Color.toUpperCase()) return -1;
            if(a.Color.toUpperCase() > b.Color.toUpperCase()) return 1;
            return 0;
          });
        }
        else{
          vinyls.sort(function(a,b){
            if(a.Color.toUpperCase() > b.Color.toUpperCase()) return -1;
            if(a.Color.toUpperCase() < b.Color.toUpperCase()) return 1;
            return 0;
          });
        }
        break;
      default:
        console.log("sort by artist!");
        sortingFilter = "sorted by artist.";
        // Sort by artist
        vinyls.sort(function(a,b){
          if(a.Artist.toUpperCase() < b.Artist.toUpperCase()) return -1;
          if(a.Artist.toUpperCase() > b.Artist.toUpperCase()) return 1;
          return 0;
        });
    }

    // default = sorted artists alphabetically descending
    sortedVinyls = vinyls;

    // Display 15 initial Vinyls
    if(vinyls.length > pageSize){
      var content = _createVinylRows(0,pageSize,sortedVinyls);
    }
    else{ // if less than pageSize display them all
      var content = _createVinylRows(0,sortedVinyls.length,sortedVinyls);
    }

    $('#tablecontent').html('').append(content);

    // redraw the whole table -> too much to handle in big data sets
    if(footable_initiliazed){
      $('.footable').trigger('footable_redraw');
    }
    else{
      $('.footable').trigger('footable_initialize');
      footable_initiliazed = true;
    }

    // update vinyl count
    vinylcount = sortedVinyls.length;
    $('#vinylcount').text(vinylcount);

    // update display status
    $('.sort-status').find('.result-count').text(sortedVinyls.length);
    $('.sort-status').find('.sorting-filter').text(sortingFilter);

    // update pagination
    _updatePagination(sortedVinyls);
  }

  // show/hide pagination if needed and reset to default state page 1
  function _updatePagination(vinyldata){

    paginationVinyls = vinyldata;
    // show pagination arrows
    if(paginationVinyls.length > pageSize){ // Do you actually need pages?
      pages = Math.ceil(paginationVinyls.length / pageSize);
      currentPage = 1;

      // restore buttons
      $('#pagination').find('.prev-page').removeClass('active');
      $('#pagination').find('.next-page').addClass('active');

      // check if pagination container is present
      if(!$('#pagination').length){
        $('footer').before('<div id="pagination"><div class="prev-page"><i class="fa fa-angle-left"></i></div><div class="current-page"><span>Page </span> '+currentPage+' / '+pages+'</div><div class="next-page active"><i class="fa fa-angle-right"></i></div></div>')
      }
      else{
        $('#pagination').find('.current-page').html('<span>Page </span> '+currentPage+' / '+pages);
      }
    }
    else{ // no pagination needed
      if($('#pagination').length){
        $('#pagination').remove();
      }
    }
  }

  // get vinyls from VINYL obj and return as table rows
  function _createVinylRows(start,end,vinyls){
    // console.log('call _createVinylRows');
    var content = '';

    for(var index=start; index<end; index++){
      content += '<tr class="vinyl">';
      content += '<td><div class="vinyl-artwork"><img src="'+vinyls[index].Artwork+'" alt="'+vinyls[index].Artist+' - '+vinyls[index].Album+'"></div></td>'
      content += '<td class="vinyl-id">'+vinyls[index].VinylID+'</td>';
      content += '<td class="vinyl-artist">'+vinyls[index].Artist+'</td>';
      content += '<td class="vinyl-name">'+vinyls[index].Album+'</td>';
      content += '<td class="label">'+vinyls[index].Label+'</td>';
      content += '<td class="format">'+vinyls[index].Format+' '+vinyls[index].Type+'</td>';
      content += '<td class="count">'+vinyls[index].Count+'</td>'
      content += '<td class="color"><div class="circle" style="background-color:'+vinyls[index].Color+';">'+vinyls[index].Color+'</div></td>'
      content += '<td class="date">'+vinyls[index].Releasedate+'</td>';
      content += '<td class="date">'+vinyls[index].Catalog+'</td>';
      content += '<td class="itunes"><a href="'+vinyls[index].iTunes+'" title="buy digital version of '+vinyls[index].Artist+' - '+vinyls[index].Album+'">iTunes</a></td>';
      content += '<td class="price">'+vinyls[index].Price+'</td>';
      content += '<td class="sample"><audio controls onplay="Main.audioHandler()"><source src="'+vinyls[index].Sample+'" type="audio/mp4">Sorry. Your browser does not seem to support the m4a audio format.</audio></td>';
      content += '<td class="artistpic"><img src="'+vinyls[index].Artistpic+'" alt="'+vinyls[index].Artist+'"></td>';
      // Video
      if(vinyls[index].Video != '-'){
        //content += '<td class="video">'+vinyls[index].Video.replace(/(?:http:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g, '<iframe width="300" height="170" src="http://www.youtube.com/embed/$1" frameborder="0" allowfullscreen style="vertical-align: middle;"></iframe>')+'</td>';
        content += '<td class="video"><a href="'+vinyls[index].Video+'" target="_blank">'+vinyls[index].Video+'</a></td>';
      }
      else{
        content += '<td class="video">-</td>';
      }
      // Tracklist
      var tracklist = vinyls[index].Tracklist.split(";");
      content += '<td class="tracklist">'+tracklist[0]+'<br/>'
      for(var i=1; i<tracklist.length; i++){
        content += tracklist[i]+'<br/>'
      }
      content += '</td>';

      content += '<td class="genre">'+vinyls[index].Genre+'</td>';
      content += '<td><span class="delete fa fa-trash-o fa-fw"></span><span class="edit fa fa-pencil fa-fw"></span></td>';
      content += '</tr>';
    }

    return content;
  }

  // pause all other audio players when another audio is playing
  function _audioHandler(){
    console.log("playing!");
    // TODO: stop all others audio players..
  }

  // Add vinyl to footable
  function _addVinylToTable(vinyl){
    // parse json
    latestVinyl = $.parseJSON(vinyl);

    // get footable
    var footable = $('.footable').data('footable');

    // push latest vinyl to existing VINYLS obj
    VINYLS.push(latestVinyl[0]); // seems enough, no idea why...
    sortedVinyls.sort(function(a,b){
      if(a.Artist.toUpperCase() < b.Artist.toUpperCase()) return -1;
      if(a.Artist.toUpperCase() > b.Artist.toUpperCase()) return 1;
      return 0;
    });

    // Update Pagination
    _updatePagination(sortedVinyls);

    // Update Vinylcount
    vinylcount = vinylcount + 1;
    $('#vinylcount').text(vinylcount);
  }

  // on search button click
  function _searchVinyl(){
    $('#searchbutton').hide();
    $('#searching').show();
    $('#searching .loading-text').text("Loading ...");
    $('#searching .progressbar').css('width','0%');

    var pickercolor = $("#colorpicker").spectrum("get").toHexString();
    $('input[name=color]').val(pickercolor);
    console.log(pickercolor);

    var artist = $('input[name=artist]').val();
    var album = $('input[name=title]').val();

    // start search
    _fetchData(artist,album, function(vinyl){
      $('#searching .loading-text').text("Done!");
      $('#searching .progressbar').css('width','100%');
      
      // fill input values
      $('input[name=genre]').val(vinyl.genre);
      $('input[name=label]').val(vinyl.label);
      $('input[name=artistpic]').val(vinyl.artistPic);
      $('input[name=artwork]').val(vinyl.artworkUrl);
      $('input[name=sample]').val(vinyl.sampleUrl);
      $('input[name=itunes]').val(vinyl.itunesUrl);
      $('input[name=deezer]').val(vinyl.deezerlink);
      $('input[name=release]').val(vinyl.release);
      $('input[name=catalog]').val(vinyl.catalog);
      $('input[name=price]').val(vinyl.price);
      $('input[name=duration]').val(vinyl.duration);
      $('input[name=color]').val(pickercolor);
      $('input[name=video]').val(vinyl.video);
      //$('input[name=artist_corrected]').val(vinyl.artist);
      $('input[name=artist_corrected]').val(artist);
      $('input[name=album_corrected]').val(vinyl.title);
      $('input[name=tracklist]').val(vinyl.tracklist);

      // Preview the vinyl
      _showPreview(vinyl);
    },
    function(artist, album){
      alert("Sorry, couldn't find this vinyl ("+artist+" - "+album+"). Please try again.");
      $('#searchbutton').show();
      $('#searching').hide();
    });
  }

  // fetch vinyl Data before submitting form
  function _fetchData(artist, album, callback, error){
    console.log("calling _fetchData");

    var vinyl = {};
    var releaseID;
    var proxyURL = './php/vendor/ba-simple-proxy.php?url=http://www.discogs.com/release/';

    $.when(
      // 1st get Release ID from Discogs
      $.getJSON('http://api.discogs.com/database/search?type=release&q=title:'+album+'%20AND%20artist:'+artist+'%20AND%20format:%22vinyl%22&callback=?', 
        function(data){
          if(typeof data.data === 'undefined'){
            error(artist, album);
            return false;
          }
          else{
            if(typeof data.data.results[0] === 'undefined'){  // nothing was found
              error(artist, album);
              return false;
            }
            else{ 
              releaseID = data.data.results[0].id;
            }
          }
        })
    ).done(function(){
      $('#searching .loading-text').text("Vinyl found ...");
      $('#searching .progressbar').css('width','20%');

      // releaseID may still be undefined
      if(typeof releaseID === 'undefined'){
        return false;
      }

      $.when(
        // 2nd get Discogs Release infos
        $.getJSON('http://api.discogs.com/releases/'+releaseID, 
          function(data){
            //console.log(data);

            vinyl.label = data.labels[0].name;
            vinyl.catalog =  data.labels[0].catno;
            vinyl.genre = data.genres.join(', ');
            vinyl.release = data.released;
            vinyl.artist = artist;
            //vinyl.artist = data.artists[0].name;
            vinyl.title = data.title;
            if(typeof data.images != 'undefined'){
              vinyl.artworkUrl = data.images[0].uri150.replace("http://api.discogs.com","http://s.pixogs.com");
            }
            else{
              vinyl.artworkUrl = 'img/vinyl_PH.svg';
            }
            vinyl.duration = '-'; // TODO
            vinyl.deezerlink = '-'; // TODO
            vinyl.artistPic = 'img/artist_PH.svg'; // TODO

            // check if tracklist is found
            if(typeof data.videos != 'undefined'){
              vinyl.tracklist = data.tracklist[0].position+". ";
              vinyl.tracklist += data.tracklist[0].title;
              vinyl.tracklist += " "+data.tracklist[0].duration+";"

              for(var i=1; i<data.tracklist.length; i++){
                vinyl.tracklist += data.tracklist[i].position+". ";
                vinyl.tracklist += data.tracklist[i].title;
                vinyl.tracklist += " "+data.tracklist[i].duration+";"
              }
            }
            else{
              vinyl.tracklist = '-';
            }
            // check if videos are found
            if(typeof data.videos != 'undefined'){
              vinyl.video = data.videos[0].uri;
            }
            else{ // found videos
              vinyl.video = '-';
            }

            //console.log(data.labels[0].name);
          })
      ).done(function(){
        $('#searching .loading-text').text("Fetching iTunes Data ...");
        $('#searching .progressbar').css('width','70%');
        $.when(
          // 5th get artwork, audio sample from iTunes
          $.getJSON('http://itunes.apple.com/search?term='+artist+' '+vinyl.title+'&limit=1&callback=?', 
            function(data) {
              //console.log("iTunes data:");
              //console.log(data);
              if(data.results.length != 0){
                //vinyl.artworkUrl = data.results[0].artworkUrl100;
                vinyl.sampleUrl = data.results[0].previewUrl;
                //vinyl.price = data.results[0].collectionPrice;
                vinyl.itunesUrl = data.results[0].collectionViewUrl;
              }
              else{ // no data found on iTunes
                //vinyl.artworkUrl = "/img/vinyl_PH.svg";
                vinyl.sampleUrl = "no sample available";
                vinyl.price = "not found";
                vinyl.itunesUrl = "not found";
              }
            })
        ).done(function(){
          $('#searching .loading-text').text("Fetching Discogs Data ...");
          $('#searching .progressbar').css('width','90%');
          $.when(
            // 6th get price
            $.ajax({
              type: "GET",
              url: proxyURL+releaseID,
              data: {},
              success: function(data){
                var tempDiv = $('<div></div>').hide().html(data.contents);
                var priceString = $(tempDiv).find('.price').text();
                vinyl.price = priceString.substring(1);
                $(tempDiv).remove();
              }
            })
          ).done(function(){
            callback(vinyl)
          });
        });
      });
    });
  }

  // Show preview of vinyl after search
  function _showPreview(vinyl){
    // hide search button; show submit button; show preview
    $('#searchbutton, #searching').hide();
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
        $('#profileform').remove();
        $('#importform').remove();
      }
    });
  }

  // crawl array and return array with unique elements ([0]) and another array with their occurances ([1])
  function _crawlArray(arr) {

    if(arr.length == 0)
      return null;

    var a = [], b = [], prev;
    var modeMap = {};
    var maxEl = arr[0], maxCount = 1;
    
    // find element that occured most often
    for(var i = 0; i < arr.length; i++)
    {
      var el = arr[i];
      if(modeMap[el] == null)
        modeMap[el] = 1;
      else
        modeMap[el]++;  
      if(modeMap[el] > maxCount)
      {
        maxEl = el;
        maxCount = modeMap[el];
      }
    }

    // remove duplicates and count occurances
    arr.sort();
    for ( var i = 0; i < arr.length; i++ ) {
        if ( arr[i] !== prev ) {
            a.push(arr[i]);
            b.push(1);
        } else {
            b[b.length-1]++;
        }
        prev = arr[i];
    }
    
    return [a, b, maxEl];
  }


	return{
    init: _init,
		doAfterLogin: _doAfterLogin,
		addUserToDb: _addUserToDb,
    updateForms: _updateForms,
		getExistingData: _getExistingData,
    displayVinylData: _displayVinylData,
    updatePagination: _updatePagination,
    createVinylRows: _createVinylRows,
    audioHandler: _audioHandler,
    fetchData: _fetchData,
    showPreview: _showPreview,
    resetOverlay: _resetOverlay,
    crawlArray: _crawlArray,
    searchVinyl: _searchVinyl,
    addVinylToTable: _addVinylToTable
	}

})();


