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

    // After logged in, get users vinyl Data and display it on success
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

    // Build actual Vinyl List and display it
    function _displayVinylData(vinyls){
      console.log(vinyls);
      $('#leftSidebar').append('<div id="vinylCount"><p>'+vinyls.length+'</p><span>vinyls</span>');
      $('#loggedInWrapper').append('<div id="rightContent"><ul id="vinyldata"></ul></div>');
      index = 0;
      $.each(vinyls, function(){
        content = '<li class="mix vinyl" data-vinylid="'+VINYLS[index].VinylID+
                                      '" data-artist="'+VINYLS[index].Artist+
                                      '" data-album="'+VINYLS[index].Album+
                                      '" data-label="'+VINYLS[index].Label+
                                      '" data-catalog="'+VINYLS[index].Catalog+
                                      '" data-year="'+VINYLS[index].Year+
                                      '" data-format="'+VINYLS[index].Format+
                                      '" data-type="'+VINYLS[index].Type+
                                      '">';
        content += '<div class="cover"><img src="img/nocover.jpg" alt="cover placeholder" /></div>';
        content += '<div class="vinylid">#'+VINYLS[index].VinylID+'</div>';
        content += '<div class="artist">'+VINYLS[index].Artist+'</div>';
        content += '<div class="album">'+VINYLS[index].Album+'</div>';
        content += '<div class="label">'+VINYLS[index].Label+' | '+VINYLS[index].Year+'</div>';
        content += '<div class="catalog">'+VINYLS[index].Catalog+'</div>';
        content += '<div class="format">'+VINYLS[index].Format+'</div>';
        content += '<div class="type">'+VINYLS[index].Type+'</div>';
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
