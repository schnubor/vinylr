/* === Global Actions =========== */

$(document).ready(function(){
  console.log('document ready!');

  // Options for the "Add Vinyl" Ajax call
  var addOptions = { 
    success: displayAddedVinyl,  // post-submit callback 
    resetForm: true        // reset the form after successful submit
    //target: '#debug-response'   // target element(s) to be updated with server response 
    //clearForm: true,        // clear all form fields after successful submit
    // other available options: 
    //url:       url         // override for form's 'action' attribute 
    //type:      type        // 'get' or 'post', override for form's 'method' attribute 
    //dataType:  null        // 'xml', 'script', or 'json' (expected server response type) 
    // $.ajax options can be used here too, for example: 
    //timeout:   3000 
  };

  // Options for the "Add Vinyl" Ajax call
  var editOptions = {  
    success: displayEditedVinyl,  // post-submit callback 
    resetForm: true        // reset the form after successful submit 
  };

  // Add vinyl callback after ajax success
  function displayAddedVinyl(response){

    // if .footable is hidden, show it
    $('.footable:hidden').show();
    // redraw the whole table
    $('.footable').trigger('footable_initialize');

    var footable = $('.footable').data('footable');

    // Display added vinyl
    if(response.length){
      if(response != "already exists!"){
        latestVinyl = $.parseJSON(response);

        // push latest vinyl to existing VINYLS obj
        VINYLS.push(latestVinyl[0]);

        // Create new table row
        var row = '<tr class="vinyl">';
        row += '<td><div class="vinyl-artwork"><img src="'+latestVinyl[0].Artwork+'" alt="'+latestVinyl[0].Artist+' - '+latestVinyl[0].Album+'"></div></td>'
        row += '<td class="vinyl-id">'+latestVinyl[0].VinylID+'</td>';
        row += '<td class="vinyl-artist">'+latestVinyl[0].Artist+'</td>';
        row += '<td class="vinyl-name">'+latestVinyl[0].Album+'</td>';
        row += '<td class="label">'+latestVinyl[0].Label+'</td>';
        row += '<td class="format">'+latestVinyl[0].Format+' '+latestVinyl[0].Type+'</td>';
        row += '<td class="count">'+latestVinyl[0].Count+'</td>'
        row += '<td class="color"><div class="circle" style="background-color:'+latestVinyl[0].Color+';">'+latestVinyl[0].Color+'</div></td>'
        row += '<td class="date">'+latestVinyl[0].Releasedate+'</td>';
        row += '<td class="catalog">'+latestVinyl[0].Catalog+'</td>';
        row += '<td class="itunes"><a href="'+latestVinyl[0].iTunes+'" title="buy digital version of '+latestVinyl[0].Artist+' - '+latestVinyl[0].Album+'">iTunes</a></td>';
        row += '<td class="price">'+latestVinyl[0].Price+'</td>';
        row += '<td class="sample"><audio controls onplay="Main.audioHandler()"><source src="'+latestVinyl[0].Sample+'" type="audio/mp4">Sorry. Your browser does not seem to support the m4a audio format.</audio></td>';
        row += '<td class="artistpic"><img src="'+latestVinyl[0].Artistpic+'" alt="'+latestVinyl[0].Artist+'"></td>';
        // Video
        if(latestVinyl[0].Video != '-'){
          //row += '<td class="video">'+latestVinyl[0].Video.replace(/(?:http:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g, '<iframe width="300" height="170" src="http://www.youtube.com/embed/$1" frameborder="0" allowfullscreen style="vertical-align: middle;"></iframe>')+'</td>';
          row += '<td class="video"><a href="'+latestVinyl[0].Video+'" target="_blank">'+latestVinyl[0].Video+'</a></td>';
        }
        else{
          row += '<td class="video">-</td>';
        }
        // Tracklist
        var tracklist = latestVinyl[0].Tracklist.split(";");
        row += '<td class="tracklist">'+tracklist[0]+'<br/>'
        for(var i=1; i<tracklist.length; i++){
          row += tracklist[i]+'<br/>'
        }
        row += '</td>';

        row += '<td class="genre">'+latestVinyl[0].Genre+'</td>';
        row += '<td><span class="delete fa fa-trash-o fa-fw"></span><span class="edit fa fa-pencil fa-fw"></span></td>';
        row += '</tr>';
      
        // Redraw the table
        footable.appendRow(row);
        footable.redraw();

        // Update the vinyl count
        vinylcount = vinylcount+1;
        $('#vinylcount').text(vinylcount);

        // reset the form / overlay
        Main.resetOverlay();
      }
      else{
        alert("This vinyl is already in your collection!");
        // reset the form / overlay
        Main.resetOverlay();
      }
    }
  }

  // Edit vinyl callback after ajax success
  function displayEditedVinyl(response){
    
    var editedVinyl = $.parseJSON(response);

    $('tbody').find('.editing').find('.count').text(editedVinyl[0].Count);
    $('tbody').find('.editing').find('.circle').text(editedVinyl[0].Color);
    $('tbody').find('.editing').find('.format').text(editedVinyl[0].Format+" "+editedVinyl[0].Type);
    $('tbody').find('.editing').find('.circle').css('background-color', editedVinyl[0].Color);
    $('tbody').find('.editing').removeClass('editing');

    $('.footable').trigger('footable_redraw');

    Main.resetOverlay();
  }

  // === Add Vinyl Overlay =========================================================

  // open overlay with add vinyl form
  $('#loggedInWrapper').on('click', '.addvinyl', function(){
    $('#overlay').fadeIn(200, function(){
      $('.overlayform').load('../views/addvinyl.html', function(){ // load add vinyl form
        Main.init(); // init select boxes and colorpicker
        Main.updateForms(FBDATA.id); // IMPORTANT: add FB id to form
        // assign ajaxForm to add vinyl form
        $('#addvinylform').ajaxForm(addOptions);
      });
    });
  });

  // === Edit Vinyl Overlay =========================================================

  // open overlay with add vinyl form
  $('#loggedInWrapper').on('click', '.edit', function(){

    var count = $(this).parent().parent().find('.count').text();
    var color = $(this).parent().parent().find('.circle').text();
    var vinylid = $(this).parent().parent().find('.vinyl-id').text();
    var row = $(this).parent().parent().addClass('editing');

    console.log(row);

    $('#overlay').fadeIn(200, function(){
      $('.overlayform').load('../views/editvinyl.html', function(){ // load edit vinyl form
        Main.init(); // init select boxes and colorpicker
        Main.updateForms(FBDATA.id); // IMPORTANT: add FB id to form
        $('#editvinylform').prepend('<input type="hidden" name="vinylid" value="'+vinylid+'">'); // add vinyl id as hidden input
        $('#colorpicker').spectrum('set', color); // set color
        $('#editvinylform').ajaxForm(editOptions); // assign ajaxForm to add vinyl form -> on submit -> displayEditedVinyl()
      });
    });
  });

  // === Close Overlay ==============================================================

  // close overlay
  $('#overlay').on('click', '.close', function(){
    Main.resetOverlay();
  });

  // === Delete Vinyl ===============================================================

  $('#loggedInWrapper').on('click', '.delete', function(){
    // get Vinly ID from DOM
    var id = $(this).parent().siblings('.vinyl-id').text();
    var row = $(this).parents('tr:first');

    // confirm delete
    var r=confirm("Do you really want to delete this vinyl?");
    if (r==true)
    {
      // Remove from VINYLS obj
      for(var i=0; i<VINYLS.length; i++){
        if(VINYLS[i].VinylID == id){
          VINYLS.splice(i,1);
        }
      }

      // Remove from DB
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
  
  // === Display Profile ===============================================================

  $('#loggedInWrapper').on('click', '.stats', function(){
    $('#overlay').fadeIn(200, function(){
      $('.overlaycontent').load('../views/userprofile.html', function(){ // load user profile

        var price = 0;
        var vinylGenres = [];
        var uniqueGenres = [];
        var labels = [];
        var topLabel = "";
        var artists = [];
        var topArtist = "";

        var genreSource = [
          //{ genre: 'Africa', value: 20.2 },
        ];

        // Add up prices and fill artist/label array
        for(var i=0; i<VINYLS.length; i++){

          // get labels
          labels[i] = VINYLS[i].Label;

          // get artists
          artists[i] = VINYLS[i].Artist;

          // get genres
          var singleVinylGenre = VINYLS[i].Genre.split(", ");
          vinylGenres[i] = singleVinylGenre[0];

          // get prices
          var vinylPrice = parseFloat(VINYLS[i].Price);
          //console.log(vinylPrice.toFixed(2));
          price = price + +vinylPrice.toFixed(2);
          price = +price.toFixed(2);
          console.log(price);
        }

        // round price to 2 digits after comma
        price = +price.toFixed(2);

        // remove duplicates from artists[] and labels[] and count appearances
        var crawledArtist = Main.crawlArray(artists);
        topArtist = crawledArtist[2];

        // remove duplicates from artists[] and labels[] and count appearances
        var crawledLabel = Main.crawlArray(labels);
        topLabel = crawledLabel[2];

        // remove duplicates from vinylGenres array and count appeareances
        var genres = Main.crawlArray(vinylGenres); // genres[0] = unique genres; genres[1] = genre appearences
        uniqueGenres = genres[0];

        // generate pie chart data
        for(var i=0; i<genres[0].length; i++){
          var tmpObj = '{ "genre": "' + genres[0][i] + '", "value": ' + genres[1][i] + ' }';
          console.log(tmpObj);
          var obj = eval('(' + tmpObj + ')');
          genreSource.push(obj);
        }

        // Render Pie Chart
        $("#genrePieChart").dxPieChart({
          dataSource: genreSource,
          series: {
              argumentField: 'genre',
              valueField: 'value',
              border: {
                visible: true,
                color: '#fafafa',
                width: 1
              },
              label: { 
                visible: true,
                connector: { visible: true },
                customizeText: function(arg) {
                  return arg.valueText + " ( " + arg.percentText + ")";
                }
              }
          },

          tooltip: { enabled: true }
        });

        // Display Data
        $('.user-pic').html('<img src="https://graph.facebook.com/'+FBDATA.username+'/picture?width=120&height=120" alt="'+FBDATA.name+'" width="100px" height="100px"/>');
        $('.user-name').html(FBDATA.name+'<span class="user-location">'+FBDATA.location.name+'</span>');
        $('.vinyl-count').html('<p>vinyls:</p><span>'+VINYLS.length+'</span>');
        $('.price-value').html('<p>worth:</p><span>'+price+'$</span>');
        $('.top-label').html('<p>Top label:</p><span>'+topLabel+'</span>');
        $('.top-artist').html('<p>Top artist:</p><span>'+topArtist+'</span>');
      });
    });
  });

});