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
        content += '<span class="vinylid">'+VINYLS[index].VinylID+'</span>';
        content += '<span class="artist">'+VINYLS[index].Artist+'</span>';
        content += '<span class="album">'+VINYLS[index].Album+'</span>';
        content += '<span class="label">'+VINYLS[index].Label+'</span>';
        content += '<span class="catalog">'+VINYLS[index].Catalog+'</span>';
        content += '<span class="album">'+VINYLS[index].Album+'</span>';
        content += '<span class="year">'+VINYLS[index].Year+'</span>';
        content += '<span class="format">'+VINYLS[index].Format+'</span>';
        content += '<span class="type">'+VINYLS[index].Type+'</span>';
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
