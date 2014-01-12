var VINYLS = null;

var Main = (function()
{

  // this is where stuff happens
	function _doAfterLogin(name, fbid){
		_addUserToDb(name, fbid);
		_getExistingData(fbid);
	}

	// Add username with his fb id to db
  	function _addUserToDb(name, fbid){
    	console.log('calling ajax with '+name+' and '+fbid);
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
        		console.log('there is some error');
      		}
    	});
  	}

    // After logged in, get users vinyl Data and display it on success
  	function _getExistingData(fbid){
      console.log("calling _getExistingData");
  		$.ajax({
      		type: 'POST',
      		url: './php/getuservinyls.php',
      		data: {
        		facebookid: fbid
     		},
      		success: function (response) {
            console.log(response);
            if(response.length){
              VINYLS = $.parseJSON(response);
              _displayVinylData(VINYLS);
            }
      		},
      		error: function () {
        		console.log('there is some error');
      		}
    	});
  	}

    // Build actual Vinyl List and display it
    function _displayVinylData(vinyls){
      console.log(vinyls);
      $('#vinylcount').text(vinyls.length);
      index = 0;
      $.each(vinyls, function(){
        content = '<tr>';
        content += '<td>'+VINYLS[index].VinylID+'</td>';
        content += '<td>'+VINYLS[index].Artist+'</td>';
        content += '<td>'+VINYLS[index].Album+'</td>';
        content += '<td>'+VINYLS[index].Label+'</td>';
        content += '<td>'+VINYLS[index].Format+' '+VINYLS[index].Type+'</td>';
        content += '<td>'+VINYLS[index].Year+'</td>';
        content += '<td>'+VINYLS[index].Price+' €</td>';
        content += '<td>'+VINYLS[index].Catalog+'</td>';
        content += '<td>'+VINYLS[index].Genre+'</td>';
        content += '</tr>';
        
        $('#tablecontent').append(content);
        index += 1;
      });

    }

  	return{
  		doAfterLogin: _doAfterLogin,
  		addUserToDb: _addUserToDb,
  		getExistingData: _getExistingData,
      displayVinylData: _displayVinylData
  	}

})();

/* === Global Actions =========== */

$(document).ready(function(){
  console.log('document ready!');

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

  function successCallback(){
    alert('Success!');
  }

  // Submit Add Vinyl Form and send Ajax request
  $('#addvinylform').ajaxForm(options, function() { 
    alert("Thank you!"); 
  });


});


