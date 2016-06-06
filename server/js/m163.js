/*
* @Author: f0x
* @Date:   2016-06-04 13:53:34
* @Last Modified by:   Simon Schmidt
* @Last Modified time: 2016-06-07 00:33:10
*/

var http = require('http');
var util = require('util');
var fs = require('fs');
var request = require('request');
var querystring = require('querystring');
var PythonShell = require('python-shell');
var crypto = require('crypto');



var S_ARTIST = 100;
var S_ALBUM = 10;
var S_SONG = 1;

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

// M163.js
// ========
module.exports = {
	search: function (searchText, searchType, callback){
		var form = {
		    	's': searchText,
		    	'type': searchType,
		    	'offset': '0',
		    	'sub': 'false',
		    	'limit': '100'
			};

		var formData = querystring.stringify(form);
		var contentLength = formData.length;
		request({
		    headers: {
		      'Content-Length': contentLength,
		      'Content-Type': 'application/x-www-form-urlencoded',
		      'Cookie': 'appver=2.0.2',
		      'Referer': 'http://music.163.com'
	    	},
	    	uri: 'http://music.163.com/api/search/get',
	    	body: formData,
	    	method: 'POST'
	  	}, function (err, res, body) {
	  		body = JSON.parse(body);
	  		if(body.code == 200){
	  			return callback(body.result);
	  		}else{
	  			return callback(-1);
	  		}
	  });
	},
  artist: function (artistID, callback){
    albums = [];
    offset = 0;
      request({
          headers: {
            'Cookie': 'appver=2.0.2',
            'Referer': 'http://music.163.com'
          },
          uri: 'http://music.163.com/api/artist/albums/'+artistID+'?offset='+offset+'&limit=50',
          method: 'GET'
        }, function (err, res, body) {
          //console.log(body);
          body = JSON.parse(body);
          return callback(body['hotAlbums']);
      });
  },
  album: function (albumID, callback){
    request({
        headers: {
          'Cookie': 'appver=2.0.2',
          'Referer': 'http://music.163.com'
        },
        uri: 'http://music.163.com/api/album/'+albumID+'/',
        method: 'GET'
      }, function (err, res, body) {
        body = JSON.parse(body);
        return callback(body);
    });
  },
	download: function(url, name, path, callback){
    console.log("Download "+name+" to "+path);
    var file = fs.createWriteStream(path + name + ".mp3");
    var req = http.get(url, function(res) {
      res.pipe(file);
    });
    return callback(url, name, path);
	},
  downloadSong: function(id, name, path, callback){
    module.exports.generateLink(id, function(url){
      module.exports.download(url, name, path, function(url, name, path){
        return callback();
      });
    });
  },
  downloadAlbum: function(albumID, quality, path, callback ){
    module.exports.album(albumID, function(body){
      data = body.album;
      var name = data.name;
      var songs = data.songs;
      path = path + name + "/";
      if (!isDirSync(path)) {
        fs.mkdirSync(path);
      }
      for(var i = 0; i < songs.length; i++){
        var song = songs[i];
        id = song.mMusic.id;
        if(quality == "high"){ id = song.hMusic.id; }
        if(quality == "med"){ id = song.mMusic.id; }
        if(quality == "low"){ id = song.lMusic.id; }
        module.exports.downloadSong(id, song.name, path, function(){

        });
      }
      return callback();
    });
  },
  generateLink: function(id, callback){
    encrypted_song_id = module.exports.encryptSongId(id);
    url = "http://p1.music.126.net/"+encrypted_song_id+"/"+id+".mp3"
    return callback(url);

  },
  encryptSongId: function(id){
    byte1 = new Buffer('3go8&$8*3*3h0k(2)2');
    byte2 = new Buffer(id);
    var byte1_len = byte1.length;
    var byte2_len = byte2.length;
    for(var i = 0; i<byte2_len; i++){
      byte2[i] = byte2[i]^byte1[i%byte1_len];
    }
    var md5 = crypto.createHash('md5').update(byte2).digest();
    var result = new Buffer(md5).toString('base64');
    result = result.replace("/","_");
    result = result.replace("+","-");
    return result;
  }
};