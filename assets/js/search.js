function searchPokemon(query) {
    const results = window.allPokemonList.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) || String(p.id).includes(query)
    );
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = '';
    results.forEach(pokemon => {
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

    const paginationContainer = document.getElementById('pagination-container');
    if (paginationContainer) {
        paginationContainer.style.display = 'none';
    }
}

function clearSearch() {
    const searchInput = document.getElementById('search-input');
    searchInput.value = '';
    displayPokemonList(1);
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.style.display = 'flex';
}

