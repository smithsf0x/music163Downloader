//Lets require/import the HTTP module
var http = require('http');
var util = require('util');
var request = require('request');
var m163 = require('./js/m163');
var fs = require('fs');


//Lets define a port we want to listen to
const PORT=8080;

//We need a function which handles requests and send response
function handleRequest(request, response){
    var body = "";
  	request.on('data', function (chunk) {
    	body += chunk;
  	});
  	request.on('end', function () {
  		var GETdata = parseURLParams(request.url);
  		var resData = "";
  		if(GETdata.a == null){
  			resData = '{"code":"-1", "err", "no action command"}';
  			response.writeHead(200);
    		response.end("rest" + resData);
  		}
  		switch(GETdata['a']){
		// Search
		case "s":
			var searchType = GETdata['t'];
			var searchText = GETdata['s'];
			m163.search(searchText, searchType, function(data){
				response.writeHead(200);
    			response.end('{"code":"200", "data":'+JSON.stringify(data)+'}');
			});
			break;
		// ArtistAlbums
		case "aa":
			var artistID = GETdata['id'];
			m163.artist(artistID, function(data){
				response.writeHead(200);
    			response.end('{"code":"200", "data":'+JSON.stringify(data)+'}');
			});
			break;
		case "album":
			var albumID = GETdata['id'];
			m163.album(albumID, function(data){
				response.writeHead(200);
    			response.end('{"code":"200", "data":'+JSON.stringify(data)+'}');
			});
			break;
		case "d":
			var songURL = GETdata['url'];
			var songName = GETdata['name']
			m163.download(songURL, songName, "./download/", function(url, name, path){
				response.writeHead(200);

    			response.end();
			});
			break;
		case "ds":
			var songID = GETdata['id']
			m163.download(songURL, songName, "./download/", function(url, name, path){
				response.writeHead(200);

    			response.end();
			});
			break;
		case "dalbum":
			var albumID = GETdata['id'];
			console.log("dalbum");
			m163.downloadAlbum(albumID, "./download/", function(){
				response.writeHead(200);

    			response.end();
			});
			break;
		default:
			response.writeHead(200);
    		response.end('{"code":"0", "err":"wrong action"}');
		}

    	console.log('GETed: ' + util.inspect(GETdata, false, null)  );



  	});

}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});

function parseURLParams(query) {
  query = query.substr(2);
  var result = {};
  query.split("&").forEach(function(part) {
    var item = part.split("=");
    result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
}
