const API_KEY = '2ddc4e61534d49235dccbac01c4bb650';
const API_LINK = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}&page=1`;
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCH_API = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=`;

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const loader = document.getElementById("loader");
const toggleMode = document.getElementById("toggle-mode");
const genreButtons = document.querySelectorAll("#genre-filter button");

let darkMode = true;

// Toggle light/dark mode
function toggleTheme() {
    darkMode = !darkMode;
    document.body.style.background = darkMode ? 'linear-gradient(to right, #000428, #004e92)' : '#ffffff';
    document.body.style.color = darkMode ? 'white' : 'black';
}
toggleMode.addEventListener("click", toggleTheme);

// Show/hide loading spinner
function showLoader() {
    loader.style.display = "block";
}
function hideLoader() {
    loader.style.display = "none";
}

// Fetch and display movies
function returnMovies(url) {
    showLoader();
    fetch(url)
        .then(res => res.json())
        .then(data => {
            main.innerHTML = "";
            if (data.results.length === 0) {
                main.innerHTML = "<p>No movies found.</p>";
                return;
            }
            data.results.forEach(movie => {
                const movieEl = document.createElement("div");
                movieEl.classList.add("card");
                const amazonSearchLink = `https://www.amazon.com/s?k=${encodeURIComponent(movie.title)}&tag=technationmov-20`;
const tmdbLink = `https://www.themoviedb.org/movie/${movie.id}`;

movieEl.innerHTML = `
    <a href="${tmdbLink}" target="_blank" class="movie-link">
        <img class="image" src="${IMG_PATH + movie.poster_path}" alt="${movie.title}">
    </a>
    <a href="${amazonSearchLink}" target="_blank" class="movie-title-link">
        <h3 class="movie-title">${movie.title}</h3>
    </a>
`;

                main.appendChild(movieEl);
            });
        })
        .catch(() => {
            main.innerHTML = '<p>Failed to load movies.</p>';
        })
        .finally(hideLoader);
}

// Handle search
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchTerm = search.value;
    if (searchTerm) {
        returnMovies(SEARCH_API + searchTerm);
        search.value = "";
        clearActiveGenres();
    }
});

// Highlight selected genre and fetch filtered movies
genreButtons.forEach(button => {
    button.addEventListener("click", () => {
        const genre = button.getAttribute("data-genre");

        // Highlight the selected genre
        genreButtons.forEach(btn => btn.classList.remove("active-genre"));
        button.classList.add("active-genre");

        // Load movies by genre or all
        const url = genre
            ? `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genre}`
            : API_LINK;
        returnMovies(url);
    });
});

// Remove genre highlight when search is used
function clearActiveGenres() {
    genreButtons.forEach(btn => btn.classList.remove("active-genre"));
}

// Initial load
returnMovies(API_LINK);
