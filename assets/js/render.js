function buildAllPokemonList() {
    window.allPokemonList = window.allPokemonData.map(p => ({
        name: p.name,
        id: p.id
    }));
}
const BASE_URL = 'https://pokeapi.co/api/v2/pokemon/';
const POKEMON_PER_PAGE = 8;
const TOTAL_POKEMON = 1025;
window.POKEMON_PER_PAGE = POKEMON_PER_PAGE;
window.TOTAL_POKEMON = TOTAL_POKEMON;

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
        mainContent.innerHTML += getCardTemplate(pokemon);
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
                mainContent.innerHTML += getCardTemplate(pokemon);
            }
        });
        updatePagination(page);
    } catch (error) {
        console.error('Error loading Pokemon list:', error);
        mainContent.innerHTML = '<div class="error">Error loading Pokemon. Please try again.</div>';
    }
}

async function fetchAllPokemonData() {
    const promises = [];
    for (let id = 1; id <= TOTAL_POKEMON; id++) {
        promises.push(fetchPokemonData(id));
    }
    try {
        const allData = await Promise.all(promises);
        window.allPokemonData = allData.filter(p => !!p);
    } catch (error) {
        console.error('Fehler beim Laden aller Pokémon-Daten:', error);
        window.allPokemonData = [];
    }
}

async function init() {
    await fetchAllPokemonData(); // fetches and sets window.allPokemonData
    buildAllPokemonList();       // now safe to call, data is loaded
    displayPokemonList(1);
    displayPokemonTypes();
}