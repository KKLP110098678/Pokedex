function fetchPokemonTypes() {
    return fetch('https://pokeapi.co/api/v2/type')
        .then(response => response.json())
        .then(data => data.results)
        .catch(error => {
            console.error('Error fetching Pokemon types:', error);
            return [];
        });
}

function displayPokemonTypes() {
    fetchPokemonTypes().then(types => {
        const typeContainer = document.getElementById('type-filter');
        typeContainer.innerHTML = `<label for="type-all">
            <input type="checkbox" name="type" value="all">All</label>`; // Clear existing types

        types.forEach(type => {
            typeContainer.innerHTML += `
                <label>
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