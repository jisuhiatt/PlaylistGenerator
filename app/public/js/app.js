  var songQuery;
  var artistQuery;
  var artistID;
  var artistGenre;
  var songID;

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
     + artistQuery + "&title=" + songQuery + "&bucket=id:7digital-US&bucket=audio_summary&bucket=tracks",
    dataType: "json",
    success: function(data){

      songID = data.response.songs[0].id;
      console.log(songID);
      artistID = data.response.songs[0].artist_id;
      console.log(artistID);
      $('#coverImage').attr('src', data.response.songs[0].tracks[0].release_image);
      $('#songtitle').text(data.response.songs[0].title + " by " + data.response.songs[0].artist_name);
      $('#preview').append('<embed id="embed_player" src="http://previews.7digital.com/clip/3326" autostart="true" hidden="true"></embed>');
      searchArtistGenre(artistID);
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


//Generate playlist by artist or similar artists


$('#byArtist').on("click", function(){
  generateByArtist(songQuery, artistQuery)
  $('#newPlaylistCard').slideDown();
});

function generateByArtist(artistQuery){
  $.ajax({
    url: "http://developer.echonest.com/api/v4/playlist/basic?api_key=QBOPBWZSCBCKJI768&artist="
     + artistQuery + "&format=json&results=20&type=artist-radio&bucket=id:7digital-US&bucket=tracks&limit=true",
    dataType: "json",
    success: function(data){

      $.each(data.response.songs,function(i){

          console.log(data.response.songs[i].title);
          console.log(data.response.songs[i].artist_name);
          $("#newPlaylistCard").append('<div class="divider"></div><div class="section hoverable"><h5 id="newSong">' 
            + data.response.songs[i].title 
            + '</h5><p id="newArtist"></p>' 
            + data.response.songs[i].artist_name 
            + '</div>');

      });

    }
  });
};

//Generate playlist by artist genre

$('#byGenre').on("click", function(){
  generateByGenre(artistGenre)
  $('#newPlaylistCard').slideDown();
});

function generateByGenre(artistGenre){
  $.ajax({
    url: "http://developer.echonest.com/api/v4/playlist/basic?api_key=QBOPBWZSCBCKJI768&genre="
     + artistGenre + "&format=json&results=20&type=genre-radio&bucket=id:7digital-US&bucket=tracks&limit=true",
    dataType: "json",
    success: function(data){

      $.each(data.response.songs,function(i){

          console.log(data.response.songs[i].title);
          console.log(data.response.songs[i].artist_name);
          $("#newPlaylist").append('<div class="divider"></div><div class="section hoverable"><h5 id="newSong">' 
            + data.response.songs[i].title 
            + '</h5><p id="newArtist"></p>' 
            + data.response.songs[i].artist_name 
            + '</div>');

      });
    }
  });
};

//Generate playlist by song or similar songs

$('#bySong').on("click", function(){
  generateBySong(songQuery, artistQuery)
  $('#newPlaylistCard').slideDown();
});

function generateBySong(songQuery){
  $.ajax({
    url: "http://developer.echonest.com/api/v4/playlist/basic?api_key=QBOPBWZSCBCKJI768&song_id="
     + songID + "&format=json&results=20&type=song-radio&bucket=id:7digital-US&bucket=tracks&limit=true",
    dataType: "json",
    success: function(data){

      $.each(data.response.songs,function(i){

          console.log(data.response.songs[i].title);
          console.log(data.response.songs[i].artist_name);
          $("#newPlaylist").append('<div class="divider"></div><div class="section hoverable"><h5 id="newSong">' 
            + data.response.songs[i].title 
            + '</h5><p id="newArtist"></p>' 
            + data.response.songs[i].artist_name 
            + '</div>');

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


      (function() {
        /**
         * Obtains parameters from the hash of the URL
         * @return Object
         */
        function getHashParams() {
          var hashParams = {};
          var e, r = /([^&;=]+)=?([^&;]*)/g,
              q = window.location.hash.substring(1);
          while ( e = r.exec(q)) {
             hashParams[e[1]] = decodeURIComponent(e[2]);
          }
          return hashParams;
        }
        var userProfileSource = document.getElementById('user-profile-template').innerHTML,
            userProfileTemplate = Handlebars.compile(userProfileSource),
            userProfilePlaceholder = document.getElementById('user-profile');
        var oauthSource = document.getElementById('oauth-template').innerHTML,
            oauthTemplate = Handlebars.compile(oauthSource),
            oauthPlaceholder = document.getElementById('oauth');
        var params = getHashParams();
        var access_token = params.access_token,
            refresh_token = params.refresh_token,
            error = params.error;
        if (error) {
          alert('There was an error during the authentication');
        } else {
          if (access_token) {
            // render oauth info
            oauthPlaceholder.innerHTML = oauthTemplate({
              access_token: access_token,
              refresh_token: refresh_token
            });
            $.ajax({
                url: 'https://api.spotify.com/v1/me',
                headers: {
                  'Authorization': 'Bearer ' + access_token
                },
                success: function(response) {
                  userProfilePlaceholder.innerHTML = userProfileTemplate(response);
                  $('#login').hide();
                  $('#loggedin').show();
                }
            });
          } else {
              // render initial screen
              $('#login').show();
              $('#loggedin').hide();
          }
          document.getElementById('obtain-new-token').addEventListener('click', function() {
            $.ajax({
              url: '/refresh_token',
              data: {
                'refresh_token': refresh_token
              }
            }).done(function(data) {
              access_token = data.access_token;
              oauthPlaceholder.innerHTML = oauthTemplate({
                access_token: access_token,
                refresh_token: refresh_token
              });
            });
          }, false);
        }
      })();


