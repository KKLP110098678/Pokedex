const BASE_URL = 'https://pokeapi.co/api/v2/pokemon/';
const POKEMON_PER_PAGE = 8;
const TOTAL_POKEMON = 1025;
window.POKEMON_PER_PAGE = POKEMON_PER_PAGE;
window.TOTAL_POKEMON = TOTAL_POKEMON;

function getCardHtml(pokemon) {
    return `
        <div class="pokemon-card" data-id="${pokemon.id}" onclick="showDetails(${pokemon.id})">
            <div class="pokemon-image">
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            </div>
            <div class="pokemon-info">
                <h2>${pokemon.name}</h2>
                <p>Height: ${pokemon.height}</p>
                <p>Weight: ${pokemon.weight}</p>
                <div class="pokemon-types">
                    ${pokemon.types.map(type => `<span class="type-icon ${type.type.name}">${getPokemonTypeIcon(type.type.name)}</span>`).join('')}
                </div>
            </div>
        </div>
    `;
}

async function fetchPokemonData(pokemonId) {
    try {
        const response = await fetch(`${BASE_URL}${pokemonId}`);
        if (!response.ok) {
            throw new Error(`Error fetching Pokémon data: ${response.statusText}`);
        }
        const pokemon = await response.json();
        return pokemon;
    } catch (error) {
        console.error(error);
    }
}

async function displayPokemon(pokemonId) {
    const pokemon = await fetchPokemonData(pokemonId);
    if (pokemon) {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML += getCardHtml(pokemon);
    }
}

async function displayPokemonList(page = 1) {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = '<div class="loading">Loading Pokemon...</div>';
    const startId = (page - 1) * POKEMON_PER_PAGE + 1;
    const endId = Math.min(page * POKEMON_PER_PAGE, TOTAL_POKEMON);
    mainContent.innerHTML = '';
    const promises = [];

    for (let id = startId; id <= endId; id++) {
        promises.push(fetchPokemonData(id));
    }
    
    try {
        const pokemonList = await Promise.all(promises);
        
        pokemonList.forEach(pokemon => {
            if (pokemon) {
                mainContent.innerHTML += getCardHtml(pokemon);
            }
        });
        updatePagination(page);
    } catch (error) {
        console.error('Error loading Pokemon list:', error);
        mainContent.innerHTML = '<div class="error">Error loading Pokemon. Please try again.</div>';
    }
}

function init() {
    displayPokemonList(1);
    displayPokemonTypes();
}