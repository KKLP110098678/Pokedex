function searchPokemon(query) {
    console.log(window.allPokemonList);
    // Suche in window.allPokemonList
    const results = window.allPokemonList.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) || String(p.id).includes(query)
    );
    // Zeige die gefundenen Pokémon an
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = '';
    results.forEach(pokemon => {
        // Hole die vollständigen Daten aus window.allPokemonData
        const fullData = window.allPokemonData.find(d => d.id === pokemon.id);
        if (fullData) {
            mainContent.innerHTML += getCardTemplate(fullData);
        }
    });
}

function handleSearch(event) {
    if (event.key === 'Enter') {
        handleSearchButton();
    }
}

function handleSearchButton() {
    const searchInput = document.getElementById('search-input');
    const query = searchInput.value.trim();
    
    if (query === '') {
        clearSearch();
        return;
    }
    searchPokemon(query);
    // Pagination bleibt immer sichtbar und wird aktualisiert
    const paginationContainer = document.getElementById('pagination-container');
    if (paginationContainer) {
        paginationContainer.style.display = 'flex';
    }
    // Optional: Pagination auf Seite 1 und Anzahl der Suchergebnisse
    if (typeof updatePagination === 'function') {
        const results = window.allPokemonList.filter(p =>
            p.name.toLowerCase().includes(query.toLowerCase()) || String(p.id).includes(query)
        );
        updatePagination(1, results.length);
    }
}

function clearSearch() {
    const searchInput = document.getElementById('search-input');
    searchInput.value = '';

    const pokemonCards = document.querySelectorAll('.pokemon-card');
    pokemonCards.forEach(card => {
        card.style.display = 'block';
    });

    const paginationContainer = document.getElementById('pagination-container');
    if (paginationContainer) {
        paginationContainer.style.display = 'flex';
    }
}

