  $(document.body).prepend('<div id="fb-root"></div>');

  var FBDATA = {}

  function displayControls() {
    $('#loading').fadeOut();
    $('#loggedOutWrapper').fadeOut();

    FB.api('/me', function(response) {
      FBDATA = response;
      console.log(FBDATA);
      displayFacebookData(FBDATA.username,FBDATA.name);
    });
  }

  function displayFacebookData(username,name){
      if(username && name){
          $('#fb-button').fadeOut(function(){

              if(!$('#currentuser').length > 0){ // if not already logged in
                $('header').append('<div id="currentuser"><img id="profilepic" src="https://graph.facebook.com/'+username+'/picture?width=120&height=120" alt="'+name+'"/><span id="username">'+name+'</span><span id="logout" onclick="FB.logout();"><span class="fa fa-sign-out fa-fw"></span>Logout</span></div>');
                $('#loggedInWrapper').fadeIn();

                // Jump to main.js
                Main.doAfterLogin(FBDATA.name, FBDATA.id);
              }
          });
            
      }
  }

  function hideControls(){
      // Remove User Data 
      $('#tablecontent').html(''); // Clear table content
      $('#loggedInWrapper').fadeOut(function(){
          $('#loggedOutWrapper').fadeIn();
          $('#currentuser').remove();
          displayFacebookButton();
      });
  }

  function displayFacebookButton() {
      //console.log("_call displayFacebookButton");
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
        
        //FBDATA.id = response.authResponse.userID;
        //FBDATA.accessToken = response.authResponse.accessToken;
        displayControls();
      } else if (response.status === 'not_authorized') {
        // the user is logged in to Facebook, 
        // but has not authenticated your app
        displayFacebookButton();
        console.warn('FB: not authorized');
      } else {
        // the user isn't logged in to Facebook.
        displayFacebookButton();
        console.warn('FB: not logged in');
      }
    });

    // Here we subscribe to the auth.authResponseChange JavaScript event. This event is fired
    // for any authentication related change, such as login, logout or session refresh. This means that
    // whenever someone who was previously logged out tries to log in again, the correct case below 
    // will be handled. 
    FB.Event.subscribe('auth.authResponseChange', function(response) {
      // Here we specify what we do with the response anytime this event occurs. 
      if (response.status === 'connected') { // all cool, go ahead
        //FBDATA.id = response.authResponse.userID;
        //FBDATA.accessToken = response.authResponse.accessToken;
        displayControls();
      } else if (response.status === 'not_authorized') { // logged into facebook but not into the app
        hideControls();
        console.warn('FB: not authorized');
      } else { // not logged into facebook
        hideControls();
        console.warn('FB: not logged in');
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
