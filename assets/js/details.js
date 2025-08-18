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
            const pokemonDetails = document.getElementById('pokemon-details');
            detailsContainer.innerHTML = getDetailsHtml(pokemon);
            pokemonDetails.style.display = 'block';
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
            loadEvolutionChain(pokemon.id);
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

function getEvoChainContent() {
    return `
        <p>Evolution Chain:</p>
        <div id="evo-chain-list">
            <p>Loading evolution chain...</p>
        </div>
    `;
}

async function loadEvolutionChain(pokemonId) {
    try {
        const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
        if (!speciesResponse.ok) {
            throw new Error(`Error fetching species data: ${speciesResponse.statusText}`);
        }
        const speciesData = await speciesResponse.json();
        const evolutionChainUrl = speciesData.evolution_chain.url;
        const evolutionChainId = evolutionChainUrl.split('/').slice(-2, -1)[0];
        const evolutionResponse = await fetch(`https://pokeapi.co/api/v2/evolution-chain/${evolutionChainId}`);
        if (!evolutionResponse.ok) {
            throw new Error(`Error fetching evolution chain: ${evolutionResponse.statusText}`);
        }
        const evolutionData = await evolutionResponse.json();
        const evolutionChain = parseEvolutionChain(evolutionData.chain);
        displayEvolutionChain(evolutionChain);

    } catch (error) {
        console.error('Error loading evolution chain:', error);
        document.getElementById('evo-chain-list').innerHTML = '<p>Failed to load evolution chain</p>';
    }
}

function parseEvolutionChain(chain) {
    const evolutionSteps = [];
    function traverse(chainLink) {
        evolutionSteps.push({
            name: chainLink.species.name,
            id: getPokemonIdFromUrl(chainLink.species.url)
        });

        if (chainLink.evolves_to && chainLink.evolves_to.length > 0) {
            chainLink.evolves_to.forEach(evolution => {
                traverse(evolution);
            });
        }
    }
    traverse(chain);
    return evolutionSteps;
}

function getPokemonIdFromUrl(url) {
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 2];
}

async function displayEvolutionChain(evolutionChain) {
    const evoChainContainer = document.getElementById('evo-chain-list');

    if (evolutionChain.length <= 1) {
        evoChainContainer.innerHTML = '<p>This Pokémon does not evolve.</p>';
        return;
    }

    let evolutionHtml = '<div class="evolution-chain">';
    for (let i = 0; i < evolutionChain.length; i++) {
        const pokemon = evolutionChain[i];
        try {
            const pokemonData = await fetchPokemonData(pokemon.id);
            if (pokemonData) {
                evolutionHtml += `
                    <div class="evolution-stage">
                        <div class="pokemon-evolution-card" onclick="showDetails(${pokemonData.id})">
                            <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}" width="80" height="80">
                            <p class="evolution-name">${pokemonData.name}</p>
                            <p class="evolution-id">#${pokemonData.id}</p>
                        </div>
                    </div>
                `;

                if (i < evolutionChain.length - 1) {
                    evolutionHtml += '<div class="evolution-arrow">→</div>';
                }
            }
        } catch (error) {
            console.error(`Error fetching data for ${pokemon.name}:`, error);
        }
    }
    evolutionHtml += '</div>';
    evoChainContainer.innerHTML = evolutionHtml;
}

function closeDetails() {
    const detailsContainer = document.getElementById('pokemon-details');
    detailsContainer.style.display = 'none';
}

