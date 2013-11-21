  $(document.body).prepend('<div id="fb-root"></div>');

  var FBDATA = {
    id : '',
    accessToken : '',
    profilepic : '',
    name : ''
  }

  function displayControls() {
      $('#loading').fadeOut();
      $('#loggedOutWrapper').fadeOut();

      FB.api('/me/picture', function(response){
          console.log(response.data.url);
          FBDATA.profilepic = response.data.url;
          displayFacebookData(FBDATA.profilepic,FBDATA.name);
      });

      FB.api('/me', function(response) {
          FBDATA.name = response.name;
          displayFacebookData(FBDATA.profilepic,FBDATA.name);
      });
  }

  function displayFacebookData(pic,name){
      if(pic && name){
          //console.log(FBDATA);
          $('#fb-button').fadeOut(function(){
              $('header').animate({
                  height: '170px'
              }, 1000, 'easeInOutCubic');
              if(!$('#currentuser').length > 0){
                $('#loggedInWrapper').append('<div id="currentuser"><img src="'+pic+'" alt="'+name+'"/><span>'+name+'</span></div>');
                Main.doAfterLogin(FBDATA.name, FBDATA.id, FBDATA.accessToken);
              }
          });
            
      }
  }

  function hideControls(){
      $('#wrapper').fadeOut(function(){
          $('header').animate({
              height: '370px',
              padding: '0'
          }, 1000, 'easeInOutCubic');
      });
  }

  function displayFacebookButton() {
      console.log("_call displayFacebookButton");
      $('#loading').fadeOut(function(){
          $('#fb-button').fadeIn();
      });
  }

  // Additional JS functions here
  window.fbAsyncInit = function() {
    FB.init({
      // Production
      //appId      : '289597984498582', // App ID
      //channelUrl : '//vinylr.chko.org', // Channel File

      // Development
      appId      : '178518429016660', // Dev App ID
      channelUrl : '//localhost:9000/channel.html', // Channel File
      
      status     : true, // check login status
      cookie     : true, // enable cookies to allow the server to access the session
      xfbml      : true  // parse XFBML
    });

    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        // the user is logged in and has authenticated your
        // app, and response.authResponse supplies
        // the user's ID, a valid access token, a signed
        // request, and the time the access token 
        // and signed request each expire
        FBDATA.id = response.authResponse.userID;
        FBDATA.accessToken = response.authResponse.accessToken;
      } else if (response.status === 'not_authorized') {
        // the user is logged in to Facebook, 
        // but has not authenticated your app
        displayFacebookButton();
      } else {
        // the user isn't logged in to Facebook.
        displayFacebookButton();
      }
    });

    // Here we subscribe to the auth.authResponseChange JavaScript event. This event is fired
    // for any authentication related change, such as login, logout or session refresh. This means that
    // whenever someone who was previously logged out tries to log in again, the correct case below 
    // will be handled. 
    FB.Event.subscribe('auth.authResponseChange', function(response) {
      // Here we specify what we do with the response anytime this event occurs. 
      if (response.status === 'connected') { // all coo, go ahead
        displayControls();
      } else if (response.status === 'not_authorized') { // logged into facebook but not into the app
        hideControls();
        displayFacebookButton();
      } else { // not logged into facebook
        hideControls();
        displayFacebookButton();
      }
    });
  };

  // Load the SDK asynchronously
  (function(d){
    var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement('script'); js.id = id; js.async = true;
    js.src = "//connect.facebook.net/en_US/all.js";
    ref.parentNode.insertBefore(js, ref);
  }(document));
