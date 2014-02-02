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
      content = '<tr>';
      content += '<td><div class="vinyl-artwork"></div></td>'
      content += '<td class="vinyl-id">'+vinyls[index].VinylID+'</td>';
      content += '<td>'+vinyls[index].Artist+'</td>';
      content += '<td>'+vinyls[index].Album+'</td>';
      content += '<td>'+vinyls[index].Label+'</td>';
      content += '<td>'+vinyls[index].Format+' '+vinyls[index].Type+'</td>';
      content += '<td>'+vinyls[index].Year+'</td>';
      content += '<td>'+vinyls[index].Price+' €</td>';
      content += '<td>'+vinyls[index].Catalog+'</td>';
      content += '<td>'+vinyls[index].Genre+'</td>';
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

    // get Vinyl Artworks
    _getVinylArtwork(vinyls);
  }

  // Get all Vinyl Artworks from Google
  function _getVinylArtwork(vinyls){

    var count = 0;
    var index = 0;

    $.each(vinyls, function(){
      console.log("calling getJSON with index="+index);
      $.getJSON('https://ajax.googleapis.com/ajax/services/search/images?q='+vinyls[index].Artist+' '+vinyls[index].Album+'&v=1.0&callback=?', 
      function(data) {
        console.log(data.responseData.results[0].unescapedUrl);
        console.log(vinyls, count);
        $('#tablecontent').find('.vinyl-artwork').eq(count).html('<img src="'+data.responseData.results[0].unescapedUrl+'" alt="cover" width="60px" height="60px">');
        count += 1;
      });

      index += 1;
    });
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

	return{
		doAfterLogin: _doAfterLogin,
		addUserToDb: _addUserToDb,
    updateForms: _updateForms,
		getExistingData: _getExistingData,
    displayVinylData: _displayVinylData,
    getVinylArtwork: _getVinylArtwork,
    isScrolledIntoView: _isScrolledIntoView
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
      var row = '<tr>';
      row += '<td><div class="vinyl-artwork"></div></td>';
      row += '<td class="vinyl-id">'+latestVinyl[0].VinylID+'</td>';
      row += '<td>'+latestVinyl[0].Artist+'</td>';
      row += '<td>'+latestVinyl[0].Album+'</td>';
      row += '<td>'+latestVinyl[0].Label+'</td>';
      row += '<td>'+latestVinyl[0].Format+' '+latestVinyl[0].Type+'</td>';
      row += '<td>'+latestVinyl[0].Year+'</td>';
      row += '<td>'+latestVinyl[0].Price+' €</td>';
      row += '<td>'+latestVinyl[0].Catalog+'</td>';
      row += '<td>'+latestVinyl[0].Genre+'</td>';
      row += '<td><span class="delete fa fa-trash-o fa-fw"></span><span class="edit fa fa-pencil fa-fw"></span></td>';
      row+= '</tr>';
    }

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


