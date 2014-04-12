/*var i = 0;

function timedCount()
{
  i = i + 1;
  $('.footable').trigger('footable_redraw');
  postMessage(i);
  setTimeout("timedCount()",500);
}

timedCount();*/

onmessage = function(event){
  var content = '';
  var vinyls = event.data;

  for(var index=20; index<vinyls.length; index++){
    content += '<tr class="vinyl">';
    content += '<td><div class="vinyl-artwork"><img src="'+vinyls[index].Artwork+'" alt="'+vinyls[index].Artist+' - '+vinyls[index].Album+'"></div></td>'
    content += '<td class="vinyl-id">'+vinyls[index].VinylID+'</td>';
    content += '<td class="vinyl-artist">'+vinyls[index].Artist+'</td>';
    content += '<td class="vinyl-name">'+vinyls[index].Album+'</td>';
    content += '<td class="label">'+vinyls[index].Label+'</td>';
    content += '<td class="format">'+vinyls[index].Format+' '+vinyls[index].Type+'</td>';
    content += '<td class="count">'+vinyls[index].Count+'</td>'
    content += '<td class="color"><div class="circle" style="background-color:'+vinyls[index].Color+';">'+vinyls[index].Color+'</div></td>'
    content += '<td class="date">'+vinyls[index].Releasedate+'</td>';
    content += '<td class="date">'+vinyls[index].Catalog+'</td>';
    content += '<td class="itunes"><a href="'+vinyls[index].iTunes+'" title="buy digital version of '+vinyls[index].Artist+' - '+vinyls[index].Album+'">iTunes</a></td>';
    content += '<td class="price">'+vinyls[index].Price+'</td>';
    content += '<td class="sample"><audio controls onplay="Main.audioHandler()"><source src="'+vinyls[index].Sample+'" type="audio/mp4">Sorry. Your browser does not seem to support the m4a audio format.</audio></td>';
    content += '<td class="artistpic"><img src="'+vinyls[index].Artistpic+'" alt="'+vinyls[index].Artist+'"></td>';
    // Video
    if(vinyls[index].Video != '-'){
      //content += '<td class="video">'+vinyls[index].Video.replace(/(?:http:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g, '<iframe width="300" height="170" src="http://www.youtube.com/embed/$1" frameborder="0" allowfullscreen style="vertical-align: middle;"></iframe>')+'</td>';
      content += '<td class="video"><a href="'+vinyls[index].Video+'" target="_blank">'+vinyls[index].Video+'</a></td>';
    }
    else{
      content += '<td class="video">-</td>';
    }
    // Tracklist
    var tracklist = vinyls[index].Tracklist.split(";");
    content += '<td class="tracklist">'+tracklist[0]+'<br/>'
    for(var i=1; i<tracklist.length; i++){
      content += tracklist[i]+'<br/>'
    }
    content += '</td>';

    content += '<td class="genre">'+vinyls[index].Genre+'</td>';
    content += '<td><span class="delete fa fa-trash-o fa-fw"></span><span class="edit fa fa-pencil fa-fw"></span></td>';
    content += '</tr>';
  }

  postMessage(content);
}