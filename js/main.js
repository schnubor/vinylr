/* === Global Actions =========== */

$(document).ready(function(){
  console.log('document ready!');

  // Options for the "Add Vinyl" Ajax call
  var options = { 
    //target: '#response',   // target element(s) to be updated with server response 
    success: displayAddedVinyl,  // post-submit callback 
    //clearForm: true,        // clear all form fields after successful submit
    resetForm: true        // reset the form after successful submit 

    // other available options: 
    //url:       url         // override for form's 'action' attribute 
    //type:      type        // 'get' or 'post', override for form's 'method' attribute 
    //dataType:  null        // 'xml', 'script', or 'json' (expected server response type) 
    

    // $.ajax options can be used here too, for example: 
    //timeout:   3000 
  };

  // Submit Add Vinyl Form and send Ajax request with form data
  $('#addvinylform').ajaxForm(options);

  function displayAddedVinyl(response){

    // if .footable is hidden, show it
    $('.footable:hidden').show();
    // redraw the whole table
    $('.footable').trigger('footable_initialize');

    var footable = $('.footable').data('footable');

    // Display added vinyl
    if(response.length){
      latestVinyl = $.parseJSON(response);
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
      row += '<td class="itunes"><a href="'+latestVinyl[0].iTunes+'" title="buy digital version of '+latestVinyl[0].Artist+' - '+latestVinyl[0].Album+'">iTunes</a></td>';
      row += '<td class="price">'+latestVinyl[0].Price+'</td>';
      row += '<td class="sample"><audio controls onplay="Main.audioHandler()"><source src="'+latestVinyl[0].Sample+'" type="audio/mp4">Sorry. Your browser does not seem to support the m4a audio format.</audio></td>';
      row += '<td class="artistpic"><img src="'+latestVinyl[0].Artistpic+'" alt="'+latestVinyl[0].Artist+'"></td>';
      row += '<td class="genre">'+latestVinyl[0].Genre+'</td>';
      row += '<td><span class="delete fa fa-trash-o fa-fw"></span><span class="edit fa fa-pencil fa-fw"></span></td>';
      row += '</tr>';
    }

    // reset the form / overlay
    Main.resetOverlay();

    // Redraw the table
    footable.appendRow(row);
    footable.redraw();

    // Update the vinyl count
    vinylcount = vinylcount+1;
    $('#vinylcount').text(vinylcount);
  }

  // === ADD VINYL OVERLAY =========================================================

  // open overlay with add vinyl form
  $('#loggedInWrapper').on('click', '#addvinyl', function(){
    $('#overlay').fadeIn(200, function(){
      $('.overlayform').load('../views/addvinyl.html', function(){
        Main.init();
        // Submit Add Vinyl Form and send Ajax request with form data
        $('#addvinylform').ajaxForm(options);
      });
    });
  });

  // === EDIT VINYL OVERLAY =========================================================

  // open overlay with add vinyl form
  $('#loggedInWrapper').on('click', '.edit', function(){

    var row = $(this);
    console.log(row);

    $('#overlay').fadeIn(200, function(){
      $('.overlayform').load('../views/editvinyl.html', function(){
        Main.init();
      });
    });
  });

  // close overlay
  $('#overlay').on('click', '.close', function(){
    Main.resetOverlay();
  });

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