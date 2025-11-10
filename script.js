const API_KEY = "60f5ab3eebeb84d6563693d6d3bb97b1";

const nappi = document.getElementById("nappiHae");
const input = document.getElementById("artistiHaku");
const albumsDiv = document.getElementById("albums");

//Napista haetaan artistin albumit
nappi.addEventListener("click", () => {
  const artisti = input.value;
  if (artisti) {
    haeAlbumit(artisti);  //Haetaan albuit
  } else {
    albumsDiv.innerHTML = "Kirjoita artistin nimi";   //Jos kenttä tyhjä
  }
});

//Artistit haetaan lastFM:n API:sta
async function haeAlbumit(artisti) {
  try { //Api pyyntö
    const url = `https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${artisti}&api_key=${API_KEY}&format=json`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.topalbums && data.topalbums.album) { //Löytyykö
      const albumit = data.topalbums.album.slice(0, 10);  //10 top albumia
      näytäAlbumit(artisti, albumit); //Näytetään albumit
    }} catch {
    albumsDiv.innerHTML = "Tietojen haku epäonnistui."; //Jos ei toimi
  }
}

//Näyttää albumit
async function näytäAlbumit(artisti, albumit) {
  albumsDiv.innerHTML = ""; //Poistetaan vanhat haut, että uudet ei tule listaan perälle

  for (const album of albumit) {
    const kuva =  //Kuvahaku
      album.image?.find((img) => img.size === "large")?.["#text"];

    const albumDiv = document.createElement("div"); //Tehdään html-elementit
    albumDiv.className = "albumi";
    albumDiv.innerHTML = `
      <img src="${kuva}" alt="${album.name}">
      <h3>${album.name}</h3>
      <p><strong>Artisti:</strong> ${artisti}</p>
      <p><a href="${album.url}" target="_blank">Avaa Last.fm:ssä</a></p>
      <div class="kappaleet">Ladataan...</div>
    `;
    albumsDiv.appendChild(albumDiv);  //Albumi 

    const kappaleetDiv = albumDiv.querySelector(".kappaleet");  //Ladataan kappaleet
    const kappaleet = await haeKappaleet(artisti, album.name);

    kappaleetDiv.innerHTML = `
      <p><strong>Kappaleet:</strong></p>
      <ul>${kappaleet.map((k) => `<li>${k}</li>`).join("")}</ul>
    `;
  }
}

//Kappaleet albumille
async function haeKappaleet(artisti, albuminNimi) { //Api pyyntö
    const url = `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${API_KEY}&artist=${artisti}&album=${albuminNimi}&format=json`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.album && data.album.tracks && data.album.tracks.track) {   //
      const kappaleet = data.album.tracks.track.map((t) => t.name);
      return kappaleet.slice(0, 50);  //Laittaa max 50 kappaletta albumista
    }
    return [];
    }
