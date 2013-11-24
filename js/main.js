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
      $('#leftSidebar').append('<div id="vinylCount"><p>'+vinyls.length+'</p><span>vinyls</span>');
      $('#loggedInWrapper').append('<div id="rightContent"><ul id="vinyldata"></ul></div>');
      index = 0;
      $.each(vinyls, function(){
        content = '<li>';
        content += '<div class="cover"><img src="img/nocover.jpg" alt="cover placeholder" /></div>';
        content += '<div class="vinylid">#'+VINYLS[index].VinylID+'</div>';
        content += '<div class="artist">'+VINYLS[index].Artist+'</div>';
        content += '<div class="album">'+VINYLS[index].Album+'</div>';
        content += '<div class="label">'+VINYLS[index].Label+'</div>';
        content += '<div class="catalog">'+VINYLS[index].Catalog+'</div>';
        content += '<div class="album">'+VINYLS[index].Album+'</div>';
        content += '<div class="year">'+VINYLS[index].Year+'</div>';
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
