var VINYLS = null;

var Main = (function()
{

  // this is where stuff happens
	function _doAfterLogin(name, fbid, token){
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

  	function _getExistingData(fbid){
  		$.ajax({
      		type: 'POST',
      		url: './php/getuservinyls.php',
      		data: {
        		facebookid: fbid
     		},
      		success: function (response) {
            VINYLS = $.parseJSON(response);
            _displayVinylData(VINYLS);
      		},
      		error: function () {
        		console.log('there is some error');
      		}
    	});
  	}

    function _displayVinylData(vinyls){
      console.log(vinyls);
      $('#currentuser > span').append(', you got '+vinyls.length+' vinyls in your collections right now. Keep on going!');
      $('#loggedInWrapper').append('<ul id="vinyldata"></ul>');
      index = 0;
      $.each(vinyls, function(){
        content = '<li>';
        content += '<span class="vinylid">'+VINYLS[index].VinylID+'</span>';
        content += '<span class="artist">'+VINYLS[index].Artist+'</span>';
        content += '</li>';
        $('#vinyldata').append(content);
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
