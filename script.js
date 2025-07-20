document.addEventListener("DOMContentLoaded", () => {
  const API_KEY = '2ddc4e61534d49235dccbac01c4bb650';
  const API_LINK = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`;
  const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
  const SEARCH_API = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=`;

  const main = document.getElementById("main");
  const form = document.getElementById("form");
  const search = document.getElementById("search");
  const loader = document.getElementById("loader");
  const toggleMode = document.getElementById("toggle-mode");
  const genreButtons = document.querySelectorAll("#genre-filter button[data-genre]");
  const freeMoviesBtn = document.getElementById("free-movies-btn");

  toggleMode.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
  });

  function showLoader() {
    loader.style.display = "block";
    main.innerHTML = "";
  }

  function hideLoader() {
    loader.style.display = "none";
  }

  function getMovies(url) {
    showLoader();
    fetch(url)
      .then(res => res.json())
      .then(data => {
        hideLoader();
        displayMovies(data.results);
      })
      .catch(() => {
        hideLoader();
        main.innerHTML = "<p>Error loading movies.</p>";
      });
  }

  function displayMovies(movies) {
    main.innerHTML = '';
    movies.forEach(movie => {
      const el = document.createElement("div");
      el.classList.add("card");
      el.innerHTML = `
        <img src="${movie.poster_path ? IMG_PATH + movie.poster_path : 'https://via.placeholder.com/300x450?text=No+Image'}" alt="${movie.title}">

        <h3>${movie.title}</h3>
      `;
      main.appendChild(el);
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const term = search.value.trim();
    if (term) {
      getMovies(SEARCH_API + term);
      search.value = '';
    }
  });

  genreButtons.forEach(button => {
    button.addEventListener("click", () => {
      genreButtons.forEach(btn => btn.classList.remove("active-genre"));
      button.classList.add("active-genre");
      const genre = button.getAttribute("data-genre");
      const url = genre ? `${API_LINK}&with_genres=${genre}` : API_LINK;
      getMovies(url);
    });
  });

  freeMoviesBtn.addEventListener("click", () => {
    genreButtons.forEach(btn => btn.classList.remove("active-genre"));
    freeMoviesBtn.classList.add("active-genre");
    main.innerHTML = "";
    const freeList = {
      "The Matrix": "https://www.youtube.com/watch?v=vKQi3bBA1y8",
      "Kung Fury": "https://www.youtube.com/watch?v=bS5P_LAqiVg"
    };
    Object.entries(freeList).forEach(([title, url]) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
        <h3>${title}</h3>
        <a href="${url}" target="_blank" class="watch-free-button">🎬 Watch Free</a>
      `;
      main.appendChild(card);
    });
  });

  // Load popular on start
  getMovies(API_LINK);
});

