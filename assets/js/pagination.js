let currentPage = 1;

function updatePagination(page, customTotal) {
    let totalCount = typeof customTotal !== 'undefined' ? customTotal : (window.filteredAndSearchedPokemon ? window.filteredAndSearchedPokemon.length : window.TOTAL_POKEMON);
    const pageSize = POKEMON_PER_PAGE || 32;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    currentPage = page;
    let paginationContainer = document.getElementById('pagination-container');
    if (!paginationContainer) {
        paginationContainer = document.createElement('div');
        paginationContainer.id = 'pagination-container';
        paginationContainer.className = 'pagination-container';
        document.body.appendChild(paginationContainer);
    }
    let paginationHtml = '<div class="pagination">';
    if (page > 1) {
        paginationHtml += `<button class="pagination-btn" onclick="goToPage(${page - 1})">« Previous</button>`;
    }
    const startPage = Math.max(1, page - 2);
    const endPage = Math.min(totalPages, page + 2);
    if (startPage > 1) {
        paginationHtml += `<button class="pagination-btn" onclick="goToPage(1)">1</button>`;
        if (startPage > 2) {
            paginationHtml += '<span class="pagination-dots">...</span>';
        }
    }
    for (let i = startPage; i <= endPage; i++) {
        const activeClass = i === page ? 'active' : '';
        paginationHtml += `<button class="pagination-btn ${activeClass}" onclick="goToPage(${i})">${i}</button>`;
    }
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHtml += '<span class="pagination-dots">...</span>';
        }
        paginationHtml += `<button class="pagination-btn" onclick="goToPage(${totalPages})">${totalPages}</button>`;
    }
    if (page < totalPages) {
        paginationHtml += `<button class="pagination-btn" onclick="goToPage(${page + 1})">Next »</button>`;
    }
    paginationHtml += '</div>';
    paginationHtml += `<div class=\"page-info\">Page ${page} of ${totalPages} (${totalCount} Pokemon total)</div>`;
    paginationContainer.innerHTML = paginationHtml;
}

function goToPage(page) {
    let totalCount = window.filteredAndSearchedPokemon ? window.filteredAndSearchedPokemon.length : window.TOTAL_POKEMON;
    const pageSize = (typeof window.POKEMON_PER_PAGE !== 'undefined') ? window.POKEMON_PER_PAGE : 32;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    if (page < 1 || page > totalPages) {
        return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.filteredAndSearchedPokemon) {
        if (typeof onPaginationPageChange === 'function') {
            onPaginationPageChange(page);
        }
    } else {
        displayPokemonList(page);
    }
}
