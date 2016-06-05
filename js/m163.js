/*
* @Author: f0x
* @Date:   2016-06-04 13:53:34
* @Last Modified by:   Simon Schmidt
* @Last Modified time: 2016-06-05 20:36:55
*/

var http = require('http');
var util = require('util');
var fs = require('fs');
var request = require('request');
var querystring = require('querystring');
var PythonShell = require('python-shell');



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
        //console.log(body);
        body = JSON.parse(body);
        return callback(body);
    });
  },
	download: function(url, name, path, callback){
    console.log("Download");
    var file = fs.createWriteStream(path + name + ".mp3");
    var req = http.get(url, function(res) {
      res.pipe(file);
    });
    return callback(url, name, path);
	},
  downloadAlbum: function(albumID, path, callback ){
    request({
        headers: {
          'Cookie': 'appver=2.0.2',
          'Referer': 'http://music.163.com'
        },
        uri: 'http://music.163.com/api/album/'+albumID+'/',
        method: 'GET'
      }, function (err, res, body) {
        //console.log(body);
        data = JSON.parse(body);
        data = data.album;

        var name = data.name;
        var songs = data.songs;
        path = path + name + "/";
        //console.log(songs);
        if (!isDirSync(path)) {
          fs.mkdirSync(path);
        }

        for(var i = 0; i < songs.length; i++){
          var song = songs[i];

          var file = fs.createWriteStream(path + song.name + ".mp3");
          var req = http.get(song.mp3Url, function(res) {
            res.pipe(file);
            console.log("FINISHED: " + song.name);
          });


        }

        return callback();
    });
  },
  generateLink: function(id, callback){
    var options = {
      mode: 'text',
      args: [id]
    };
    try{
      PythonShell.run('song_encrypt.py', options, function (err, results) {
        if (err) throw err;
        encrypted_song_id = results[0];
        url = "http://p1.music.126.net/"+encrypted_song_id+"/"+id+".mp3"
        return callback(url);
      });
    }catch(err){
      console.log(err);
    }

    //


  }
};