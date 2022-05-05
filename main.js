const URL = 'https://api.lyrics.ovh/suggest/hero'


function fetchSongs() {
  fetch(URL)
  .then(response => response.json())
  .then(data => console.log(data))
}
