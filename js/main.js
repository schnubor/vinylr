/* === Landing Page Stuff ============ */

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

$(document).click(function(){
  $(window).trigger('scroll'); // fixes the fixed footer bug
});

$(document).ready(function(){
  console.log('document ready!');

  // === Footable Events ===========================================================

  $('.footable').bind('footable_redrawn', function(){
    console.log('footable redrawn!');
  });

  $('.footable').bind('footable_initialized', function(){
    console.log('footable initialized!');
  });

  $('.footable').bind('footable_row_expanded', function(){
    console.log('footable row expanded!');

    // Tracking
    mixpanel.track("Click: Expand Vinyl row");
  });

  // === Options for the "Add Vinyl" Ajax call =====================================
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
  $('header').on('click', '.addvinyl', function(){
    // Tracking
    mixpanel.track("Click: Add Vinyl");

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
    // Tracking
    mixpanel.track("Click: Edit Vinyl");

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
    // Tracking
    mixpanel.track("Click: Delete Vinyl");

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

  $('header').on('click', '.stats', function(){
    // Tracking
    mixpanel.track("Click: Stats");

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

  $('header').on('click', '.import', function(){
    // Tracking
    mixpanel.track("Click: Import");

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

  // === Show Dropdown Menu ==================================

  $('header').on('click','#currentuser', function(){
    $('#dropdown-menu').toggle();
  });

  // === Pagination Position =================================

  $(window).scroll(function(event) {
    
    // height of the document (total height)
    var d = $(document).height();
    
    // height of the window (visible page)
    var w = $(window).height();
    
    // scroll level
    var s = $(this).scrollTop();
    
    // bottom bound - or the width of your 'big footer'
    var bottomBound = 97;
    
    // are we beneath the bottom bound?
    if(d - (w + s) < bottomBound) {
        // if yes, start scrolling our own way, which is the
        // bottom bound minus where we are in the page
        $('#pagination').css({
            bottom: bottomBound - (d - (w + s))
        });
    } else {
        // if we're beneath the bottom bound, then anchor ourselves
        // to the bottom of the page in traditional footer style
        $('#pagination').css({
            bottom: 0
        });            
    }
  });

  // === Pagination - NEXT ===================================

  $(document).on('click','.next-page.active', function(){
    // Tracking
    mixpanel.track("Click: Next page");
    var start = pageSize * currentPage;
    var end = start + pageSize;

    // last page
    if(end > paginationVinyls.length){
      end = paginationVinyls.length;
    }

    // get next vinyls and show them
    var content = Main.createVinylRows(start,end,paginationVinyls);
    $('#tablecontent').html('').append(content);
    $('.footable').trigger('footable_redraw');

    // update page counter
    currentPage += 1;
    $('.current-page').html('<span>Page </span> '+currentPage+' / '+Math.ceil(pages));

    // hide/show page controls
    $('.prev-page').addClass('active');
    if(currentPage == pages){
      $('.next-page').removeClass('active');
    }
  });

  // === Pagination - PREV ===================================

  $(document).on('click','.prev-page.active', function(){
    // Tracking
    mixpanel.track("Click: Previous page");

    var start = pageSize * (currentPage - 2);
    var end = start + pageSize;

    // get prev vinyls and show them
    var content = Main.createVinylRows(start,end,paginationVinyls);
    $('#tablecontent').html('').append(content);
    $('.footable').trigger('footable_redraw');

    // update page counter
    currentPage -= 1;
    $('.current-page').html('<span>Page </span> '+currentPage+' / '+Math.ceil(pages));

    // hide/show page controls
    $('.next-page').addClass('active');
    if(currentPage == 1){
      $('.prev-page').removeClass('active');
    }
  });

  // === Filter / Search =====================================

  var typeTimer;

  $('#filter').bind('input', function () {

    var key = $('#filter').val().toLowerCase();
    var found = [];

    clearTimeout(typeTimer);

    typeTimer = setTimeout(function(){
      // Tracking
      mixpanel.track("Filter Vinyls");

      $.each(sortedVinyls, function(i){
        var entry = sortedVinyls[i];

        if(entry.Artist.toLowerCase().indexOf(key) != -1 || entry.Album.toLowerCase().indexOf(key) != -1 || entry.Label.toLowerCase().indexOf(key) != -1 || entry.Catalog.toLowerCase().indexOf(key) != -1 || entry.Genre.toLowerCase().indexOf(key) != -1 || entry.Releasedate.toLowerCase().indexOf(key) != -1){
          found.push(entry);
        }
      })

      // Update Pagination
      Main.updatePagination(found);

      //console.log(found);
      if(found.length > pageSize){
        var content = Main.createVinylRows(0,pageSize,paginationVinyls);
      }
      else{
        var content = Main.createVinylRows(0,found.length,paginationVinyls);
      }
      $('#tablecontent').html('').append(content);
      $('.footable').trigger('footable_redraw');

      // update display status
      $('.sort-status').find('.result-count').text(found.length);
      $('.sort-status').find('.sorting-filter').text('containing \''+key+'\'');
      
    }, 500);

  });

  // === Sort / Search Events =================================
  $('#sorting-filter').change(function(){
  
    var key = $(this).val();

    // Tracking
    mixpanel.track("Sort Vinyl by "+key);

    // reset search
    $('#filter').val('');

    // display vinyls
    Main.displayVinylData(VINYLS,key);
  });

  // === Toggle Ascending/Descending ==========================

  $(document).on('click','.sort-toggle', function(){
    if($('.sort-toggle').hasClass('asc')){
      $('.sort-toggle').html('<i class="fa fa-sort-amount-desc"></i>');
      $('.sort-toggle').removeClass('asc').addClass('desc');
    }
    else{
      $('.sort-toggle').html('<i class="fa fa-sort-amount-asc"></i>');
      $('.sort-toggle').removeClass('desc').addClass('asc');
    }

    var key = $('#sorting-filter').val();

    Main.displayVinylData(paginationVinyls,key);
  });

});