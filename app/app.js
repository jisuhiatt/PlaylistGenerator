<script>
$('button').click(function(){
  var search = $('input').val();
  searchAPI(search);
});

function searchAPI(query){
  $.ajax({
    url: "https://api.spotify.com/v1/search?q=" + query + "&type=artist&limit=1",
    dataType: "json",
    success: function(data){
      $('img').attr('src', data.artists.items[0].images[0].url);
    }
  });
};
</script>