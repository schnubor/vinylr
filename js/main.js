$(function(){
  $('.gallery a').click(function(e){
    e.preventDefault();

    var src = $(this).attr('href');

    $('.gallery').find('.current').removeClass();
    $(this).addClass('current');

    $('.gallery-image').attr('src',src);
  })
});

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

    // Display added vinyl
    if(response.length){
      if(response != "already exists!"){
        // Add vinyl to footable
        Main.addVinylToTable(response);

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
      $('.overlayform').show().load('../views/addvinyl.html', function(){ // load add vinyl form
        Main.init(); // init select boxes and colorpicker
        Main.updateForms(FBDATA.id); // IMPORTANT: add FB id to form
        // assign ajaxForm to add vinyl form
        $('#addvinylform').ajaxForm(addOptions);
      });
    });
  });

  $(document).on('click', '#searchbutton', function(){
    Main.searchVinyl();
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
  $('#overlay').on('click', '.close, .done', function(){
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
          if(isNaN(vinylPrice)){ // if price is empty or NaN, assume 0
            vinylPrice = 0
          }

          price = price + +vinylPrice.toFixed(2);
          price = +price.toFixed(2);
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

  // === Import Data ==================================

  $('#loggedInWrapper').on('click', '.import', function(){
    $('#overlay').fadeIn(200, function(){
      $('.overlaycontent').load('../views/import.html', function(){ // load user profile
        if(Importer.isAPIAvailable()) {
          $('#files').bind('change', Importer.handleFileSelect); // as soon as a file gets selected, run this
        }
      });
    });
  });

  $(document).on('click','#startimport', function(){
    Importer.importVinyls(importData);
  });

});