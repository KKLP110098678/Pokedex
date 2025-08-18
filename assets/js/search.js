function searchPokemon(query) {
    const pokemonCards = document.querySelectorAll('.pokemon-card');
    
    pokemonCards.forEach(card => {
        const pokemonName = card.querySelector('h2').textContent.toLowerCase();
        const pokemonId = card.querySelector('.pokemon-id')?.textContent || '';
        
        if (pokemonName.includes(query.toLowerCase()) || pokemonId.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
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

    const pokemonCards = document.querySelectorAll('.pokemon-card');
    pokemonCards.forEach(card => {
        card.style.display = 'block';
    });

    const paginationContainer = document.getElementById('pagination-container');
    if (paginationContainer) {
        paginationContainer.style.display = 'flex';
    }
}

