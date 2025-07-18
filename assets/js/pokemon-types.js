const BASE_URL = 'https://pokeapi.co/api/v2/pokemon/';


function getPokemonTypeIcon(type) {
    const availableTypes = [
        'normal', 'fire', 'water', 'grass', 'electric', 'psychic',
        'ice', 'dragon', 'dark', 'fairy', 'fighting', 'flying',
        'poison', 'ground', 'rock', 'bug', 'ghost', 'steel'
    ];

    if (availableTypes.includes(type)) {
        return `<img src="assets/svg/${type}.svg" alt="${type} type" width="24" height="24" class="type-icon-img">`;
    }

    return '';
}

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

async function displayPokemonList() {
    const pokemonIds = [1, 2, 3, 4, 5]; 
    for (const id of pokemonIds) {
        await displayPokemon(id);
    }
}

function init() {
    displayPokemonList();
}

function getDetailsHtml(pokemon) {
    return `
        <div class="pokemon-details">
            <div class="card-header">
                <span class="pokemon-id">#${pokemon.id}</span>
                <span class="pokemon-name">${pokemon.name}</span>
            </div>
            <div class="pokemon-image">
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            </div>
            <div class="pokemon-types">
                ${pokemon.types.map(type => `<span class="type-icon ${type.type.name}">${getPokemonTypeIcon(type.type.name)} ${type.type.name}</span>`).join('')}
            </div>
            <div class="tabs">
                <button class="tab info active" onclick="showTab('info', ${pokemon.id})">Info</button>
                <button class="tab stats" onclick="showTab('stats', ${pokemon.id})">Stats</button>
                <button class="tab evo-chain" onclick="showTab('evo-chain', ${pokemon.id})">evo chain</button>
            </div>
            <div class="pokemon-info" id="info-content">
                <p>Height: ${pokemon.height}</p>
                <p>Weight: ${pokemon.weight}</p>
                <p>Base Experience: ${pokemon.base_experience}</p>
                <p>Abilities: ${pokemon.abilities.map(ability => ability.ability.name).join(', ')}</p>
            </div>
        </div>
    `;
}

function showDetails(pokemonId) {
    fetchPokemonData(pokemonId).then(pokemon => {
        if (pokemon) {
            const detailsContainer = document.getElementById('details-container');
            detailsContainer.innerHTML = getDetailsHtml(pokemon);
            detailsContainer.style.display = 'block';
        }
    });
}

function showTab(tabName, pokemonId) {
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.classList.remove('active');
    });

    contents.forEach(content => {
        content.style.display = 'none';
    });

    document.querySelector(`.tab.${tabName}`).classList.add('active');

    fetchPokemonData(pokemonId).then(pokemon => {
        if (pokemon) {
            renderTabContent(tabName, pokemon);
        }
    });
}

function renderTabContent(tabName, pokemon) {
    const infoContent = document.getElementById('info-content');
    switch (tabName) {
        case 'info':
            infoContent.innerHTML = getInfoContent(pokemon);
            break;
        case 'stats':
            infoContent.innerHTML = getStatsContent(pokemon);
            break;
        case 'evo-chain':
            infoContent.innerHTML = getEvoChainContent(pokemon);
            break;
    }
}

function getInfoContent(pokemon) {
    return `
        <p>Height: ${pokemon.height}</p>
        <p>Weight: ${pokemon.weight}</p>
        <p>Base Experience: ${pokemon.base_experience}</p>
        <p>Abilities: ${pokemon.abilities.map(ability => ability.ability.name).join(', ')}</p>
    `;
}

function getStatsContent(pokemon) {
    return `
        <p>HP: ${pokemon.stats.find(stat => stat.stat.name === 'hp').base_stat}</p>
        <p>Attack: ${pokemon.stats.find(stat => stat.stat.name === 'attack').base_stat}</p>
        <p>Defense: ${pokemon.stats.find(stat => stat.stat.name === 'defense').base_stat}</p>
        <p>Speed: ${pokemon.stats.find(stat => stat.stat.name === 'speed').base_stat}</p>
    `;
}

function getEvoChainContent(pokemon) {
    // Fetch and display the evolution chain for the Pokémon
    return `
        <p>Evolution Chain:</p>
        <ul id="evo-chain-list"></ul>
    `;
}


