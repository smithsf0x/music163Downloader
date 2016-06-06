/*
* @Author: f0x
* @Date:   2016-06-04 16:29:59
* @Last Modified by:   Simon Schmidt
* @Last Modified time: 2016-06-06 23:56:46
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
}


function showArtists(data){
	data = JSON.parse(data).data;
	var view = {
    	artists : data.artists
    };
    $.get('http://localhost:8888/templates/search_artist.html', function(template, textStatus, jqXhr) {
    	var output = Mustache.render(template, view);
    	$("#result").html(output);
    });
}

function showArtist(data){
	data = JSON.parse(data).data;
    var view = {
    	albums : data
    };
    $.get('http://localhost:8888/templates/artist.html', function(template, textStatus, jqXhr) {
    	var output = Mustache.render(template, view);
    	$("#result").html(output);
    });
}

function showAlbum(data){
	data = JSON.parse(data).data.album;
	var view = {
    	id : data.id,
    	name : data.name,
    	picUrl : data.picUrl,
    	songs : data.songs
    };
    $.get('http://localhost:8888/templates/album.html', function(template, textStatus, jqXhr) {
    	var output = Mustache.render(template, view);
    	$("#result").html(output);
    });
}

function openArtist(id){
	$("#result").html("Loading");
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080',
        data: {
          	"a":"artist",
          	"id":id
        },
        success: function(data) {
        	$("#result").html("");
            showArtist(data);
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
        	showAlbum(data);
        }
    });
};

function downloadSong(id, name){
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080',
        data: {
          	"a":"dsong",
          	"id":id,
          	"name": name
        },
        success: function(data) {
        }
    });
}

function downloadAlbum(id, quality){
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080',
        data: {
          	"a":"dalbum",
          	"id":id,
            "q":quality
        },
        success: function(data) {
        }
    });
    return ;
}

