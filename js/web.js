/*
* @Author: f0x
* @Date:   2016-06-04 16:29:59
* @Last Modified by:   f0x
* @Last Modified time: 2016-06-05 19:50:19
*/
function init(){
	$("#searchButton").click(function(){
		$("#result").html("");
		$("#result").html("Loading");
	    var searchType = $("#searchType").val();
	    var searchText = $("#searchText").val();
	    $.ajax({
	        type: 'GET',
	        url: 'http://localhost:8080',
	        data: {
	          	"a":"s",
	          	"s":searchText,
	        	"t":searchType
	        },
	        success: function(data) {
	            $("#result").html("");
	        	showArtists(data);
	        }
	    });
	});
	console.log("init");
}


function showArtists(data){
	data = JSON.parse(data).data;
	$.each(data.artists, function( index, value ) {
		// get album count from this below and use it as
		//  "how often do we need to fetch albums"
		// console.log(value);

		$("#result").append(drawArtistTile(value.name, value.picUrl, value.id ));
	});
}

function showAlbums(data){
	data = JSON.parse(data).data;
    $.each(data, function( index, value ) {
		$("#result").append(drawAlbumTile(value.name, value.picUrl, value.id ));
	});
}

function showAlbum(data){
	data = JSON.parse(data).data.album;
	//console.log(data);
	$("#result").append(drawSingleAlbum(data.id, data.name, data.picUrl, data.songs ));
}

function openArtist(id){
	console.log(id);
	$("#result").html("Loading");
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080',
        data: {
          	"a":"aa",
          	"id":id
        },
        success: function(data) {
        	$("#result").html("");
            showAlbums(data);

        }
    });
};

function openAlbum(id){
	console.log(id);
	$("#result").html("Loading");
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080',
        data: {
          	"a":"album",
          	"id":id
        },
        success: function(data) {
        	$("#result").html("");
        	//console.log(data);
            showAlbum(data);

        }
    });
};

function drawArtistTile(name, url, id){
	var string = "";
	string += '<div onclick="openArtist('+id+')" class="artistTile" data-id="'+id+'">';
	string += '<img src="'+url+'"  width="80" height="80" alt="'+name+'">';
	string += '<b>'+name+'</b>';
	string += '</div>';
	return string;
}

function drawAlbumTile(name, url, id){
	var string = "";
	string += '<div onclick="openAlbum('+id+')" class="albumTile"  data-id="'+id+'">';
	string += '<img src="'+url+'" width="64" height="64" alt="'+name+'">';
	string += '<b>'+name+'</b>';
	string += '</div>';
	return string;
}

function drawSingleAlbum(id, name, url, songs){
	var string = "";
	string += '<div class="singleAlbum">';
	string += '<img src="'+url+'" width="250" height="250" alt="'+name+'">';
	string += '<br><button onclick="downloadAlbum('+id+')">Download Album</button><br>'
	string += '<br><b>'+name+'</b>';
	string += '<ul>';

	$.each(songs, function( index, song ) {
		console.log(song);
		string += '<li>';
		string += '<b>'+song.name+'</b>';
		string += '<button onclick="downloadSongDirect('+"'"+song.mp3Url+"', '"+song.name+"'"+')" ">direct MP3</button>';
		string += '<button onclick="downloadSong('+"'"+song.id+"', '"+song.name+"'"+')" ">320kb/s MP3</button>';
		string += '<button onclick="downloadSong('+"'"+song.id+"', '"+song.name+"'"+')" ">160kb/s MP3</button>';
		string += '<button onclick="downloadSong('+"'"+song.id+"', '"+song.name+"'"+')" "> 96kb/s MP3</button>';
		string += '</li>';
	});

	string += '</ul>';
	string += '</div>';
	return string;
}

function downloadSongDirect(url, name){
	url = url.substring(9);
	url = "http://" + "p1" + url;
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080',
        data: {
          	"a":"d",
          	"url":url,
          	"name": name
        },
        success: function(data) {
        }
    });
    return;
}

function downloadSong(id){
	url = url.substring(9);
	url = "http://" + "p1" + url;
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080',
        data: {
          	"a":"ds",
          	"url":url,
          	"name": name
        },
        success: function(data) {
        }
    });
}

function downloadAlbum(id){

    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080',
        data: {
          	"a":"dalbum",
          	"id":id
        },
        success: function(data) {


        }
    });

    return ;

}