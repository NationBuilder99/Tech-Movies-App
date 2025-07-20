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
const freeMoviesBtn = document.getElementById("free-movies-btn");

let darkMode = true;

function toggleTheme() {
    darkMode = !darkMode;
    document.body.style.background = darkMode ? 'linear-gradient(to right, #000428, #004e92)' : '#ffffff';
    document.body.style.color = darkMode ? 'white' : 'black';
}
toggleMode.addEventListener("click", toggleTheme);

function showLoader() {
    loader.style.display = "block";
}
function hideLoader() {
    loader.style.display = "none";
}

function returnMovies(url) {
    showLoader();
    fetch(url)
        .then(res => res.json())
        .then(data => {
            main.innerHTML = "";
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
        .finally(hideLoader);
}

// 🔍 SEARCH
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchTerm = search.value;
    if (searchTerm) {
        returnMovies(SEARCH_API + searchTerm);
        search.value = "";
    }
});

// 🎯 GENRE BUTTONS
genreButtons.forEach(button => {
    button.addEventListener("click", () => {
        // Remove highlight from all
        genreButtons.forEach(btn => btn.classList.remove("active-genre"));

        // Add highlight to clicked
        button.classList.add("active-genre");

        const genre = button.getAttribute("data-genre");
        const url = genre ? `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genre}` : API_LINK;
        returnMovies(url);
    });
});

// 🎬 FREE MOVIES
if (freeMoviesBtn) {
    freeMoviesBtn.addEventListener("click", () => {
        genreButtons.forEach(btn => btn.classList.remove("active-genre")); // remove active from others
        freeMoviesBtn.classList.add("active-genre"); // optional: highlight free tab

        const freeMovies = {
            "The Matrix": "https://www.youtube.com/watch?v=vKQi3bBA1y8",
            "Plan 9 from Outer Space": "https://www.youtube.com/watch?v=2NoE1nU1WwA"
        };

        main.innerHTML = "";
        Object.keys(freeMovies).forEach(title => {
            const movieEl = document.createElement("div");
            movieEl.classList.add("card");
            movieEl.innerHTML = `
                <img class="image" src="https://via.placeholder.com/200x300?text=${encodeURIComponent(title)}" alt="${title}">
                <h3 class="movie-title">${title}</h3>
                <div class="movie-buttons">
                    <a href="${freeMovies[title]}" target="_blank" class="watch-free-button">🎬 Watch Free</a>
                </div>
            `;
            main.appendChild(movieEl);
        });
    });
}

returnMovies(API_LINK);
