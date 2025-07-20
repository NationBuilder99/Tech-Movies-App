const API_KEY = '2ddc4e61534d49235dccbac01c4bb650';
const API_LINK = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}&page=1`;
const IMG_PATH = 'https://image.tmdb.org/t/p/w500';
const SEARCH_API = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=`;

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const loader = document.getElementById("loader");
const toggleMode = document.getElementById("toggle-mode");
const genreButtons = document.querySelectorAll("#genre-filter button");

let darkMode = true;

// Toggle theme
toggleMode.addEventListener("click", () => {
    darkMode = !darkMode;
    document.body.classList.toggle("light-theme", !darkMode);
});

// Show loader
function showLoader() {
    loader.style.display = "block";
}

// Hide loader
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

                movieEl.innerHTML = `
                    <img class="image" src="${movie.poster_path ? IMG_PATH + movie.poster_path : 'https://via.placeholder.com/500x750?text=No+Image'}" alt="${movie.title}">
                    <h3 class="movie-title">${movie.title}</h3>
                    <div class="watch-options">
                        <button class="free-watch">Watch Free</button>
                        <button class="premium-watch">Premium</button>
                    </div>
                `;

                main.appendChild(movieEl);

                const freeBtn = movieEl.querySelector(".free-watch");
                const premiumBtn = movieEl.querySelector(".premium-watch");

                freeBtn.addEventListener("click", () => {
                    window.location.href = `https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title)}+full+movie`;
                });

                premiumBtn.addEventListener("click", () => {
                    window.open(`https://www.amazon.com/s?k=${encodeURIComponent(movie.title)}+movie`, '_blank');
                });


                
            });
        })
        .catch(() => {
            main.innerHTML = '<p>Error loading movies. Try again later.</p>';
        })
        .finally(hideLoader);
}

// Search functionality
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchTerm = search.value.trim();
    if (searchTerm) {
        returnMovies(SEARCH_API + encodeURIComponent(searchTerm));
        search.value = "";
    }
});

// Genre filtering
genreButtons.forEach(button => {
    button.addEventListener("click", () => {
        genreButtons.forEach(btn => btn.classList.remove("active-genre"));
        button.classList.add("active-genre");

        const genreId = button.getAttribute("data-genre");
        const url = genreId 
            ? `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`
            : API_LINK;

        returnMovies(url);
    });
});

// Initial fetch
returnMovies(API_LINK);
