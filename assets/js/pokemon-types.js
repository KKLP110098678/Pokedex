async function fetchPokemonTypes() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/type');
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching Pokemon types:', error);
        return [];
    }
}

function displayPokemonTypes() {
    fetchPokemonTypes().then(types => {
        const typeContainer = document.getElementById('type-filter');
        typeContainer.innerHTML = `<button class="danger" onclick="resetTypeFilter()">Reset</button>`;

        types.forEach(type => {
            typeContainer.innerHTML += `
                <label onclick="filterByTypes()">
                    <input type="checkbox" name="type" value="${type.name}">
                    ${getPokemonTypeIcon(type.name)} ${type.name.charAt(0).toUpperCase() + type.name.slice(1)}
                </label>
            `;
        });
    });
}

function toggleTypeFilter() {
    const typeFilter = document.getElementById('type-filter');
    typeFilter.classList.toggle('d-none');
}


async function fetchPokemonByTypes(selectedTypes) {
    if (!selectedTypes || selectedTypes.length === 0) {
        return [];
    }

    const allPokemonSets = await Promise.all(
        selectedTypes.map(async type => {
            try {
                const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
                if (!response.ok) return [];
                const data = await response.json();
                return data.pokemon.map(p => p.pokemon.name);
            } catch {
                return [];
            }
        })
    );


    let resultSet = allPokemonSets[0] || [];
    for (let i = 1; i < allPokemonSets.length; i++) {
        resultSet = resultSet.filter(name => allPokemonSets[i].includes(name));
    }
    return resultSet;
}

window.filteredAndSearchedPokemon = null;

async function filterByTypes(page = 1) {
    const selectedTypes = getSelectedTypes();
    let baseList = window.currentSearchResults || null;
    if (!baseList) {
        if (selectedTypes.length === 0) {
            // Reset to all Pokémon and first page
            window.filteredAndSearchedPokemon = null;
            if (typeof displayPokemonList === 'function') {
                displayPokemonList(1);
                updatePagination(1, window.TOTAL_POKEMON);
            }
            return;
        }
        return handleTypeFilter(selectedTypes, 1); // always reset to first page
    }
    return handleSearchTypeFilter(baseList, selectedTypes, 1); // always reset to first page
}

function getSelectedTypes() {
    const checkboxes = document.querySelectorAll('#type-filter input[type="checkbox"]');
    return Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);
}

async function handleNoFilter(page) {
    if (typeof displayPokemonList === 'function') return displayPokemonList(page);
    const promises = [];
    for (let id = 1; id <= PAGE_SIZE; id++) promises.push(fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(r => r.ok ? r.json() : null));
    const pokemonList = (await Promise.all(promises)).filter(Boolean);
    window.filteredAndSearchedPokemon = pokemonList;
    displayFilteredPokemon(paginateList(pokemonList, page));
    updatePagination(page, pokemonList.length);
}

async function handleTypeFilter(selectedTypes, page) {
    const basicPokemonList = await fetchPokemonByTypes(selectedTypes);
    const detailedPokemonList = await Promise.all(
        basicPokemonList.map(async p => {
            try {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${p.name || p.id || p}`);
                if (!response.ok) return null;
                return await response.json();
            } catch { return null; }
        })
    );
    const validPokemon = detailedPokemonList.filter(p => p);
    window.filteredAndSearchedPokemon = validPokemon;
    displayFilteredPokemon(paginateList(validPokemon, page));
    updatePagination(page, validPokemon.length);
}

function handleSearchTypeFilter(baseList, selectedTypes, page) {
    const filtered = applyTypeFilterToList(baseList, selectedTypes);
    window.filteredAndSearchedPokemon = filtered;
    displayFilteredPokemon(paginateList(filtered, page));
    updatePagination(page, filtered.length);
}


function paginateList(list, page) {
    const pageSize = window.POKEMON_PER_PAGE;
    const start = (page - 1) * pageSize;
    return list.slice(start, start + pageSize);
}

function onPaginationPageChange(page) {
    if (window.filteredAndSearchedPokemon) {
        displayFilteredPokemon(paginateList(window.filteredAndSearchedPokemon, page));
        updatePagination(page, window.filteredAndSearchedPokemon.length);
    } else if (typeof displayPokemonList === 'function') {
        displayPokemonList(page);
        updatePagination(page, window.TOTAL_POKEMON);
    }
}

function applyTypeFilterToList(pokemonList, selectedTypes) {
    if (!selectedTypes || selectedTypes.length === 0) return pokemonList;
    return pokemonList.filter(pokemon => {
        if (!pokemon.types) return false;
        const types = pokemon.types.map(t => t.type.name);
        return selectedTypes.every(type => types.includes(type));
    });
}

function displayFilteredPokemon(pokemon) {
    const pokemonContainer = document.getElementById('main-content');
    pokemonContainer.innerHTML = '';

    if (pokemon.length === 0) {
        pokemonContainer.innerHTML = '<p>No Pokémon found for the selected types.</p>';
        return;
    }

    pokemon.forEach(p => {
        pokemonContainer.innerHTML += getCardTemplate(p);
    });
}

function resetTypeFilter() {
    const checkboxes = document.querySelectorAll('#type-filter input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    window.filteredAndSearchedPokemon = null;
    window.currentSearchResults = null;
    displayPokemonTypes();
    // Always show first page after reset
    if (typeof displayPokemonList === 'function') {
        displayPokemonList(1);
        updatePagination(1, window.TOTAL_POKEMON);
    }
}



