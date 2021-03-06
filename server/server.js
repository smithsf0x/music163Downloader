//https://github.com/yanunon/NeteaseCloudMusic/wiki/NetEase-cloud-music-analysis-API-%5BEN%5D
var http = require('http');
var util = require('util');
var request = require('request');
var m163 = require('./js/m163');
var fs = require('fs');
var serveStatic = require('serve-static');
var connect = require('connect');



//Lets define a port we want to listen to
const PORT=8080;
const PORT_WEB=8888;

const DL_PATH = "./../download/";

console.log('---/==========================/-');
console.log('--/ music.163.com downloader /--');
console.log('-/==========================/---');
console.log('');
if (!isDirSync(DL_PATH)) {
	console.log("Download folder created");
	console.log("");
	fs.mkdirSync(DL_PATH);
}
console.log("Open the address for the Webserver in your browser");
console.log("");


connect().use(serveStatic(__dirname)).listen(PORT_WEB, function(){
    console.log('Webserver SW listen on http://localhost:'+PORT_WEB);
});

//We need a function which handles requests and send response
function handleRequest(request, response){
    response.setHeader("Access-Control-Allow-Origin", "*");
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

			console.log('SB: Searching for "'+searchText+'" in '+(searchType==100?"Artists":"")+(searchType==10?"Albums":"")+(searchType==1?"Songs":""));
			m163.search(searchText, searchType, function(data){
				response.writeHead(200);
    			response.end('{"code":"200", "data":'+JSON.stringify(data)+'}');
			});
			break;
		// Artist
		case "artist":
			var artistID = GETdata['id'];
			console.log('Showed albums for artist ' + artistID);
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
		case "dsong":
			var songID = GETdata['id'];
			var songName = GETdata['name'];
			m163.generateLink(songID, function(url){
				m163.download(url, songName, DL_PATH, function(url, name, path){
					response.writeHead(200);

    				response.end();
				});
			});
			break;
		case "dalbum":
			var albumID = GETdata['id'];
			var quality = GETdata['q'];

		 	m163.downloadAlbum(albumID, quality, DL_PATH, function(){
		 		response.writeHead(200);

		    	response.end();
			});

			break;
		default:
			response.writeHead(200);
    		response.end('{"code":"0", "err":"wrong action"}');
    		console.log("SB: Wrong action");
		}
  	});
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log('Backendserver SB listen on http://localhost:'+PORT);
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

function isDirSync(aPath) {
  try {
    return fs.statSync(aPath).isDirectory();
  } catch (e) {
    if (e.code === 'ENOENT') {
      return false;
    } else {
      throw e;
    }
  }
}