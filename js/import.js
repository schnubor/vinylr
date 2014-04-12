var importData = {};

var Importer = (function()
{
	function _isAPIAvailable() {
    // Check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      // Great success! All the File APIs are supported.
      return true;
    } else {
      // source: File API availability - http://caniuse.com/#feat=fileapi
      // source: <output> availability - http://html5doctor.com/the-output-element/
      document.writeln('The HTML5 APIs used in this form are only available in the following browsers:<br />');
      // 6.0 File API & 13.0 <output>
      document.writeln(' - Google Chrome: 13.0 or later<br />');
      // 3.6 File API & 6.0 <output>
      document.writeln(' - Mozilla Firefox: 6.0 or later<br />');
      // 10.0 File API & 10.0 <output>
      document.writeln(' - Internet Explorer: Not supported (partial support expected in 10.0)<br />');
      // ? File API & 5.1 <output>
      document.writeln(' - Safari: Not supported<br />');
      // ? File API & 9.2 <output>
      document.writeln(' - Opera: Not supported');
      return false;
    }
  }

  function _handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    var file = files[0];

    // read the file metadata
    var output = ''
        output += '<span style="font-weight:bold;">' + escape(file.name) + '</span><br />\n';
        output += ' - FileType: ' + (file.type || 'n/a') + '<br />\n';
        output += ' - FileSize: ' + file.size + ' bytes<br />\n';
        output += ' - LastModified: ' + (file.lastModifiedDate ? file.lastModifiedDate.toLocaleDateString() : 'n/a') + '<br />\n';

    if(file.type === "text/csv"){
    	// read the file contents
    	_csvToObject(file);
    	// show file details
    	// $('#filedetails').append(output);
    }
    else{
    	alert("Please select a CSV File!");
    }
  }

  // fetch vinyl data and add to database
  function _csvToObject(file) {
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(event){
      var csv = event.target.result;
      importData = $.csv.toObjects(csv);
      $('.overlayform').hide();
      $('#filedetails').html('<span>Found '+importData.length+' Vinyls</span><button class="button" id="startimport">Import Vinyls now</button>');
    };
    reader.onerror = function(){ alert('Unable to read ' + file.fileName); };
  }

  // fetch vinyl data from imported vinyls
  function _importVinyls(data){
    $('#filedetails, #inputs, .description, #startimport').remove();
    $('#importform').append('<div class="importprogress"><div class="fa fa-refresh fa-spin"></div><p class="status"><span class="counter"></span><br><br><span class="vinylname"></span><br><span class="dbstatus"></span></p><div class="progress"><div class="progressbar"></div></div></div>');

    var count = 0;
    var added = 0;
    var exists = 0; 
    var failed = 0;
    var width = 0;
    $('.status .counter').text('...');
    $('.status .vinylname').text('initiating');

    // Loop through CSV data
    for(var i=0; i < data.length; i++){
      
      var artist = data[i].artist;
      var title = data[i].title;

      // fetch Data
      Main.fetchData(artist, title, function(vinyl){ // vinyl found
        console.log(vinyl);

        // Add to DB
        $.ajax({
          type: 'POST',
          url: './php/importvinyl.php',
          data: {
            facebookid: FBDATA.id,
            vinyldata: JSON.stringify(vinyl)
          },
          success: function (response) {
            console.log(response);
            if(response != "already exists!"){
              // update status text
              $('.status .dbstatus').text("added!");
              // add vinyl to table
              Main.addVinylToTable(response);
              added = added + 1;
            }
            else{
              $('.status .dbstatus').text("already exists!");
              exists = exists + 1;
            }

            // update status
            count = count + 1;
            width = count*(100/data.length);
            $('.status .counter').text(count+'/'+data.length);
            $('.status .vinylname').text(vinyl.artist+' - '+vinyl.title);
            $('.importprogress .progressbar').css('width', width+'%');

            // Check if import is done.
            if(count == data.length){
              console.log("import done. ajax success");
              $('.importprogress').remove();
              if($('#importreport').length){
                $('#importreport').remove();
                $('#importform').append('<div id="importreport"><div class="success-title">success!</div><div class="report"><span class="success">'+added+'</span> imported, <span class="exists">'+exists+'</span> already exists, <span class="not-found">'+failed+'</span> not found<button class="button done">Done!</button></div>');
              }
              else{
                $('#importform').append('<div id="importreport"><div class="success-title">success!</div><div class="report"><span class="success">'+added+'</span> imported, <span class="exists">'+exists+'</span> already exists, <span class="not-found">'+failed+'</span> not found<button class="button done">Done!</button></div>');
              }
              
            }
          },
          error: function () {
            console.warn('could not import vinyl - ajax error');
            $('.status .dbstatus').text("ajax DB error!");
            failed = failed + 1;

            // update status
            count = count + 1;
            width = count*(100/data.length);
            $('.status .counter').text(count+'/'+data.length);
            $('.status .vinylname').text(vinyl.artist+' - '+vinyl.title);
            $('.importprogress .progressbar').css('width', width+'%');

            // Check if import is done.
            if(count == data.length){
              console.log("import done. ajax error");
              $('.importprogress').remove();
              if($('#importreport').length){
                $('#importreport').remove();
                $('#importform').append('<div id="importreport"><div class="success-title">success!</div><div class="report"><span class="success">'+added+'</span> imported, <span class="exists">'+exists+'</span> already exists, <span class="not-found">'+failed+'</span> not found<button class="button done">Done!</button></div>');
              }
              else{
                $('#importform').append('<div id="importreport"><div class="success-title">success!</div><div class="report"><span class="success">'+added+'</span> imported, <span class="exists">'+exists+'</span> already exists, <span class="not-found">'+failed+'</span> not found<button class="button done">Done!</button></div>');
              }
            }
          }
        });
      },
      function(artist, album){  // vinyl not found
        console.log("couldn't find vinyl: "+artist+" - "+album);

        // update status
        count = count + 1;
        width = count*(100/data.length);
        $('.status .counter').text(count+'/'+data.length);
        $('.status .vinylname').text(artist+' - '+title);
        $('.importprogress .progressbar').css('width', width+'%');

        $('.status .dbstatus').text("not found!");
        failed = failed + 1;

        // Check if import is done.
        if(count == data.length){
          console.log("import done. fail");
          $('.importprogress').remove();
          if($('#importreport').length){
            $('#importreport').remove();
            $('#importform').append('<div id="importreport"><div class="success-title">success!</div><div class="report"><span class="success">'+added+'</span> imported, <span class="exists">'+exists+'</span> already exists, <span class="not-found">'+failed+'</span> not found<button class="button done">Done!</button></div>');
          }
          else{
            $('#importform').append('<div id="importreport"><div class="success-title">success!</div><div class="report"><span class="success">'+added+'</span> imported, <span class="exists">'+exists+'</span> already exists, <span class="not-found">'+failed+'</span> not found<button class="button done">Done!</button></div>');
          }
        }

        // wait 1s for discogs
        setTimeout(function(){
          return;
        },2000);
      });
    }
  }

  return{
    isAPIAvailable: _isAPIAvailable,
    handleFileSelect: _handleFileSelect,
    csvToObject: _csvToObject,
    importVinyls: _importVinyls
	}

})()