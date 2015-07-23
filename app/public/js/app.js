  var songQuery;
  var artistQuery;
  var artistID;
  var artistGenre;
  var songID;
  var spotifyTrackID;
  var spotifyTrackID2;
  var previewURL;

  var currentSong = {};
  var playlist = [];

//Initial user query

$('#searchButton').on("click", function(){
  songQuery = $('.songQuery').val();
  artistQuery = $('.artistQuery').val();
  console.log(songQuery);
  console.log(artistQuery);
  searchTrack(songQuery, artistQuery);
  $('#songInfoCard').slideDown();
  $('#playlistSettings').slideDown();
});

function searchTrack(songQuery, artistQuery){
  $.ajax({
    url: "http://developer.echonest.com/api/v4/song/search?api_key=QBOPBWZSCBCKJI768&format=json&results=1&artist="
     + artistQuery + "&title=" + songQuery + "&bucket=id:7digital-US&bucket=id:spotify&bucket=audio_summary&bucket=tracks",
    dataType: "json",
    success: function(data){

      songID = data.response.songs[0].id;
      console.log(songID);
      artistID = data.response.songs[0].artist_id;
      console.log(artistID);
      spotifyTrackID = data.response.songs[0].tracks[0].foreign_id;
      spotifyTrackID2 = spotifyTrackID.split("track:").pop()
      console.log(spotifyTrackID);
      console.log(spotifyTrackID2);
      console.log(data.response.songs[0].tracks[1].release_image)
      $('#coverImage').attr('src', data.response.songs[0].tracks[1].release_image);
      $('#songtitle').text(data.response.songs[0].title + " by " + data.response.songs[0].artist_name);
      $('#preview').append('<embed id="embed_player" src="http://previews.7digital.com/clip/3326" autostart="true" hidden="true"></embed>');
      searchArtistGenre(artistID);
      searchPreviewURL(spotifyTrackID2);
    }
  });
};

function searchArtistGenre(artistID){
  $.ajax({
    url: "http://developer.echonest.com/api/v4/artist/profile?api_key=QBOPBWZSCBCKJI768&id=" 
    + artistID + "&format=json&bucket=genre",
    dataType: "json",
    success: function(data){
      artistGenre = data.response.artist.genres[0].name;
      console.log(artistGenre);

    }
  });
};

function searchPreviewURL(spotifyTrackID2){
  $.ajax({
    url: "https://api.spotify.com/v1/tracks/" + spotifyTrackID2,
    dataType: "json",
    success: function(data){
      previewURL= data.preview_url;
      console.log(previewURL);

    }
  });
};


//Generate playlist by artist or similar artists


$('#byArtist').on("click", function(){
  generateByArtist(songQuery, artistQuery)
  $('#newPlaylistSection').slideDown();
});

function generateByArtist(artistQuery){
  $.ajax({
    url: "http://developer.echonest.com/api/v4/playlist/basic?api_key=QBOPBWZSCBCKJI768&artist="
     + artistQuery + "&format=json&results=20&type=artist-radio&bucket=id:spotify&bucket=tracks&limit=true",
    dataType: "json",
    success: function(data){

      if ($(".newSong, .newArtist").length){
            console.log("a playlist has already been generated");
            $("#PlaylistCardContent").empty();
          }
          else {
            console.log("new songs do not exist");

          }

      $.each(data.response.songs,function(i){

          var newSong = data.response.songs[i].title;
          var newArtist = data.response.songs[i].artist_name; 
          console.log(newSong);
          console.log(newArtist);

          $("#PlaylistCardContent").append('<div class="section hoverable"><h5 class="newSong">' 
            + newSong
            + '</h5><p class="newArtist"></p>' 
            + newArtist
            + '</div><div class="divider"></div>');

      });
    }
  });
};


//Generate playlist by artist genre

$('#byGenre').on("click", function(){
  generateByGenre(artistGenre)
  $('#newPlaylistSection').slideDown();
});

function generateByGenre(artistGenre){
  $.ajax({
    url: "http://developer.echonest.com/api/v4/playlist/basic?api_key=QBOPBWZSCBCKJI768&genre="
     + artistGenre + "&format=json&results=20&type=genre-radio&bucket=id:spotify&bucket=tracks&limit=true",
    dataType: "json",
    success: function(data){

     if ($(".newSong, .newArtist").length){
            console.log("a playlist has already been generated");
            $("#PlaylistCardContent").empty();
          }
          else {
            console.log("new songs do not exist");

          }

      $.each(data.response.songs,function(i){

          var newSong = data.response.songs[i].title;
          var newArtist = data.response.songs[i].artist_name; 
          console.log(newSong);
          console.log(newArtist);

          $("#PlaylistCardContent").append('<div class="section hoverable"><h5 class="newSong">' 
            + newSong
            + '</h5><p class="newArtist"></p>' 
            + newArtist
            + '</div><div class="divider"></div>');

      });
    }
  });
};

//Generate playlist by song or similar songs

$('#bySong').on("click", function(){
  generateBySong(songQuery, artistQuery)
  $('#newPlaylistSection').slideDown();
});

function generateBySong(songQuery){
  $.ajax({
    url: "http://developer.echonest.com/api/v4/playlist/basic?api_key=QBOPBWZSCBCKJI768&song_id="
     + songID + "&format=json&results=20&type=song-radio&bucket=id:spotify&bucket=tracks&limit=true",
    dataType: "json",
    success: function(data){

      if ($(".newSong, .newArtist").length){
            console.log("a playlist has already been generated");
            $("#PlaylistCardContent").empty();
          }
          else {
            console.log("new songs do not exist");

          }

      $.each(data.response.songs,function(i){

          var newSong = data.response.songs[i].title;
          var newArtist = data.response.songs[i].artist_name; 
          console.log(newSong);
          console.log(newArtist);

          $("#PlaylistCardContent").append('<div class="section hoverable"><h5 class="newSong">' 
            + newSong
            + '</h5><p class="newArtist"></p>' 
            + newArtist
            + '</div><div class="divider"></div>');

      });
    }
  });
};

$('.generateDropdownButton').dropdown({
      inDuration: 300,
      outDuration: 225,
      constrain_width: false, // Does not change width of dropdown to that of the activator
      hover: true, // Activate on hover
      gutter: 100, // Spacing from edge
      belowOrigin: true // Displays dropdown below the button
    }
  );
     
$('#getStartedButton').on("click", function (){
      $('.intro').slideUp();
      $('#search').slideDown();
    }
);

// success: function (response) {
//             for (i = 0; i < response.length; i++) {
//                 alert(response[i].class_id);
//             }

//             $("#find").dialog('close');
//             $('.remove').remove();
//             $('#find_data').before('abcccccc');

//             //location.reload();
//             return false;
//         }

