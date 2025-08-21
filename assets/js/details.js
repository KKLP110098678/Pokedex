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
                evolutionHtml += getEvolutionStageTemplate(pokemonData);
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

