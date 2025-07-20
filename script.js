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
  const genreButtons = document.querySelectorAll("#genre-filter button");
  const freeMoviesBtn = document.getElementById("free-movies-btn");

  // Dark mode toggle
  toggleMode.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
  });

  // Fetch movies and render
  function returnMovies(url) {
    loader.style.display = 'block';
    fetch(url)
      .then(res => res.json())
      .then(data => {
        main.innerHTML = '';
        data.results.forEach(movie => {
          const movieEl = document.createElement("div");
          movieEl.classList.add("card");
          movieEl.innerHTML = `
            <img class="image" src="${IMG_PATH + movie.poster_path}" alt="${movie.title}">
            <h3 class="movie-title">${movie.title}</h3>
          `;
          main.appendChild(movieEl);
        });
      })
      .catch(() => {
        main.innerHTML = '<p>Failed to load movies.</p>';
      })
      .finally(() => loader.style.display = 'none');
  }

  // Search
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const term = search.value;
    if (term) returnMovies(SEARCH_API + term);
    search.value = '';
  });

  // Genre filtering
  genreButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      genreButtons.forEach(b => b.classList.remove("active-genre"));
      btn.classList.add("active-genre");
      const genreId = btn.getAttribute("data-genre");
      const url = genreId ? `${API_LINK}&with_genres=${genreId}` : API_LINK;
      returnMovies(url);
    });
  });

  // Free movies list
  freeMoviesBtn?.addEventListener("click", () => {
    genreButtons.forEach(b => b.classList.remove("active-genre"));
    freeMoviesBtn.classList.add("active-genre");
    main.innerHTML = '';
    const free = {
      "The Matrix": "https://www.youtube.com/watch?v=vKQi3bBA1y8"
      // Add more items...
    };
    Object.entries(free).forEach(([title, link]) => {
      const movieEl = document.createElement("div");
      movieEl.classList.add("card");
      movieEl.innerHTML = `
        <h3 class="movie-title">${title}</h3>
        <a href="${link}" target="_blank" class="watch-free-button">🎬 Watch Free</a>
      `;
      main.appendChild(movieEl);
    });
  });

  // Initial load
  returnMovies(API_LINK);
});
