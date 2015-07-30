//Define all variables, objects, arrays

  var songQuery;
  var artistQuery;
  var artistID;
  var artistGenre;
  var songID;
  var trackImage;
  var spotifyTrackID;
  var spotifyTrackID2;
  var duration;
  var previewURL;

  var currentSong = {};
  var newSong = {};
  var playlist = [];

  //audio summary
  var energy;
  var tempo;
  var loudness;
  var danceability;
  var duration 

//Play audio on cover image click

$('#coverImagePreview').on('click', function() {
      $("#preview")[0].play();
    });


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

      energy = data.response.songs[0].audio_summary.energy;
      tempo = data.response.songs[0].audio_summary.tempo;
      loudness = data.response.songs[0].audio_summary.loudness;
      danceability = data.response.songs[0].audio_summary.danceability;
      duration = data.response.songs[0].audio_summary.duration;
      


      $('#as_energy').text("Energy: " + energy);
      $('#as_tempo').text("Tempo: " + tempo);
      $('#as_loudness').text("Loudness: " + loudness);
      $('#as_danceability').text("Danceability: " + danceability);

      $('#songtitle').text(data.response.songs[0].title + " by " + data.response.songs[0].artist_name);
      searchArtistGenre(artistID);
      searchTrackImage(spotifyTrackID2)
      searchPreviewURL(spotifyTrackID2);
      },
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

function searchTrackImage(spotifyTrackID2){
  $.ajax({
    url: "https://api.spotify.com/v1/tracks/" + spotifyTrackID2,
    dataType: "json",
    success: function(data){
      trackImage = data.album.images[0].url
      $('#coverImage').attr('src', trackImage);
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
      $('#preview').attr('src', previewURL);

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
          var newSpotifyTrackID = data.response.songs[i].tracks[0].foreign_id;
          var newSpotifyTrackID2 = newSpotifyTrackID.split("track:").pop();

          console.log(newSong);
          console.log(newArtist);
          console.log(newSpotifyTrackID);
          console.log(newSpotifyTrackID2);


          $.ajax({
            url: "https://api.spotify.com/v1/tracks/" + newSpotifyTrackID2,
            dataType: "json",
            success: function(data){
            newPreviewURL= data.preview_url;
            newTrackImage = data.album.images[0].url;
            console.log(newPreviewURL);
            console.log(newTrackImage);

            $("#PlaylistCardContent").append('<div class="section hoverable"><img src="'+ newTrackImage +'" alt="trackImage" height="60" width="60"><h5 class="newSong">' 
            + newSong
            + '</h5><p class="newArtist"></p>' 
            + newArtist
            + '<audio id="newPreview" controls><source src="'
            + newPreviewURL
            + '"></audio></div><div class="divider"></div>');

            $('.section').on('click', function() {
              console.log("I'm clicking!")
              $("#newPreview")[i].play();
            });


            }
          });

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
          var newSpotifyTrackID = data.response.songs[i].tracks[0].foreign_id;
          var newSpotifyTrackID2 = newSpotifyTrackID.split("track:").pop();

          console.log(newSong);
          console.log(newArtist);
          console.log(newSpotifyTrackID);
          console.log(newSpotifyTrackID2);


          $.ajax({
            url: "https://api.spotify.com/v1/tracks/" + newSpotifyTrackID2,
            dataType: "json",
            success: function(data){
            newPreviewURL= data.preview_url;
            newTrackImage = data.album.images[0].url;
            console.log(newPreviewURL);
            console.log(newTrackImage);

            $("#PlaylistCardContent").append('<div class="section hoverable"><img src="'+ newTrackImage +'" alt="trackImage" height="60" width="60"><h5 class="newSong">' 
            + newSong
            + '</h5><p class="newArtist"></p>' 
            + newArtist
            + '<audio controls><source id="newPreview" src="'
            + newPreviewURL
            + '"></audio></div><div class="divider"></div>');

            }
          });

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
          var newSpotifyTrackID = data.response.songs[i].tracks[0].foreign_id;
          var newSpotifyTrackID2 = newSpotifyTrackID.split("track:").pop();

          console.log(newSong);
          console.log(newArtist);
          console.log(newSpotifyTrackID);
          console.log(newSpotifyTrackID2);


          $.ajax({
            url: "https://api.spotify.com/v1/tracks/" + newSpotifyTrackID2,
            dataType: "json",
            success: function(data){
            newPreviewURL= data.preview_url;
            newTrackImage = data.album.images[0].url;
            console.log(newPreviewURL);
            console.log(newTrackImage);

            $("#PlaylistCardContent").append('<div class="section hoverable"><img src="'+ newTrackImage +'" alt="trackImage" height="60" width="60"><h5 class="newSong">' 
            + newSong
            + '</h5><p class="newArtist"></p>' 
            + newArtist
            + '<audio controls><source id="newPreview" src="'
            + newPreviewURL
            + '"></audio></div><div class="divider"></div>');

            }
          });

      });
    }
  });
};


//Play each song in playlist




$('').on("click", function (){
      playPlaylistSong();
    }
);



//Get started

$('#getStartedButton').on("click", function (){
      $('.intro').slideUp();
      $('#search').slideDown();
    }
);


