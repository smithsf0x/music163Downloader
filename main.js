


var m163 = require('./js/m163');

/*
m163.search(searchText, searchType, function(data){
	// console.log(data);
	console.log(data.artistCount + " Artists found:");
	for(i = 0; i < data.artistCount; i++){
		artist = data.artists[i];
		//console.log(artist);
		console.log("|| "+(i + 1)+": " + artist.name);
	}
});

*/
artistID = 3445869443254600
m163.generateLink(artistID, function(url){
	console.log(url);

});