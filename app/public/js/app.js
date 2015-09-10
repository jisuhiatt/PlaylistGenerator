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

// Events ------------------------------------------------------

//Play audio on cover image click
$('#coverImagePreview').on('click', function() {
  $("#preview")[0].play();
});

//Initial user query
$('#searchButton').on("click", function(){
  songQuery = $('.songQuery').val();
  artistQuery = $('.artistQuery').val();
  searchTrack(songQuery, artistQuery);
  $('#songInfoCard').slideDown();
  $('#playlistSettings').slideDown();
  $('footer').css('position', 'relative');
});

// Get started
$('#getStartedButton').on("click", function (){
  $('.intro').slideUp();
  $('#search').slideDown();
});

//Generate playlist by song or similar songs
$('#bySong').on("click", function(){
  generateBySong(songQuery, artistQuery)
  $('#newPlaylistSection').slideDown();
});

//Generate playlist by artist genre
$('#byGenre').on("click", function(){
  generateByGenre(artistGenre);
  $('#newPlaylistSection').slideDown();
});

//Generate playlist by artist or similar artists
$('#byArtist').on("click", function(){
  generateByArtist(songQuery, artistQuery)
  $('#newPlaylistSection').slideDown();
});


// API Functions -----------------------------------------------

function searchTrack(songQuery, artistQuery){
  $.ajax({
    url: "http://developer.echonest.com/api/v4/song/search?api_key=QBOPBWZSCBCKJI768&format=json&results=1&artist="
     + artistQuery + "&title=" + songQuery + "&bucket=id:7digital-US&bucket=id:spotify&bucket=audio_summary&bucket=tracks",
    dataType: "json",
    success: function(data){

      songID = data.response.songs[0].id;
      artistID = data.response.songs[0].artist_id;
      spotifyTrackID = data.response.songs[0].tracks[0].foreign_id;
      spotifyTrackID2 = spotifyTrackID.split("track:").pop()

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
      $('#preview').attr('src', previewURL);
    }
  });
};

function generateByArtist(artistQuery){
  $.ajax({
    url: "http://developer.echonest.com/api/v4/playlist/basic?api_key=QBOPBWZSCBCKJI768&artist="
     + artistQuery + "&format=json&results=20&type=artist-radio&bucket=id:spotify&bucket=tracks&limit=true",
    dataType: "json",
    success: function(data){
      generateTracks(data.response.songs);
    }
  });
};


function generateByGenre(artistGenre){
  $.ajax({
    url: "http://developer.echonest.com/api/v4/playlist/basic?api_key=QBOPBWZSCBCKJI768&genre="
     + artistGenre + "&format=json&results=20&type=genre-radio&bucket=id:spotify&bucket=tracks&limit=true",
    dataType: "json",
    success: function(data){
      generateTracks(data.response.songs);
    }
  });
};

function generateBySong(songQuery){
  $.ajax({
    url: "http://developer.echonest.com/api/v4/playlist/basic?api_key=QBOPBWZSCBCKJI768&song_id="
     + songID + "&format=json&results=20&type=song-radio&bucket=id:spotify&bucket=tracks&limit=true",
    dataType: "json",
    success: function(data){
      generateTracks(data.response.songs);
    }
  });
};

function generateTracks(tracks){
  if ($(".newSong, .newArtist").length){
    console.log("a playlist has already been generated");
    $("#PlaylistCardContent").empty();
  } else {
    console.log("new songs do not exist");
  }

  $.each(tracks,function(i){
    var newSong = tracks[i].title;{
    var newArtist = tracks[i].artist_name; 
    var newSpotifyTrackID = tracks[i].tracks[0].foreign_id;
    var newSpotifyTrackID2 = newSpotifyTrackID.split("track:").pop();}

    $.ajax({
      url: "https://api.spotify.com/v1/tracks/" + newSpotifyTrackID2,
      dataType: "json",
      success: function(data){
        newPreviewURL= data.preview_url;
        newTrackImage = data.album.images[0].url;

        $("#PlaylistCardContent").append(
          '<div class="section hoverable" data-track-id="' + newSpotifyTrackID2 + '">' + 
            '<img src="'+ newTrackImage +'" alt="trackImage" height="60" width="60">' + 
              '<h5 class="newSong">' + newSong + '</h5>' + 
              '<p class="newArtist">' + newArtist + '</p>' +
              '<audio id="' + newSpotifyTrackID2 + '" controls>' + 
                '<source src="' + newPreviewURL + '">' + 
              '</audio>' + 
          '</div>' + 
          '<div class="divider"></div>'
        );

        $('[data-track-id=' + newSpotifyTrackID2 + ']').click(function () {
          console.log('I clicked on track id ', newSpotifyTrackID2);
          // jquery requires us to put a [0] infront of the audio tag
          // before we call play on it
          // via http://stackoverflow.com/a/16093819
          $('#' + newSpotifyTrackID2)[0].play();
        });
      }
    });
  });
}