let currentPage = 1;

function updatePagination(page, customTotal) {
    let totalCount = typeof customTotal !== 'undefined' ? customTotal : (window.filteredAndSearchedPokemon ? window.filteredAndSearchedPokemon.length : window.TOTAL_POKEMON);
    const pageSize = POKEMON_PER_PAGE || 32;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    currentPage = page;
    let paginationContainer = getOrCreatePaginationContainer();
    paginationContainer.innerHTML = combinePaginationTemplate(page, totalPages, totalCount);
}

function combinePaginationTemplate(page, totalPages, totalCount) {
    let paginationHtml = '<div class="pagination">';
    paginationHtml += getPrevButton(page);
    paginationHtml += getStartPageButtons(page, totalPages);
    paginationHtml += getPageButtons(page, totalPages);
    paginationHtml += getEndPageButtons(page, totalPages);
    paginationHtml += getNextButton(page, totalPages);
    paginationHtml += '</div>';
    paginationHtml += getPageInfo(page, totalPages, totalCount);
    return paginationHtml;
}

function getOrCreatePaginationContainer() {
    let container = document.getElementById('pagination-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'pagination-container';
        container.className = 'pagination-container';
        document.body.appendChild(container);
    }
    return container;
}

function getPrevButton(page) {
    if (page > 1) {
        return `<button class="pagination-btn" onclick="goToPage(${page - 1})">« Previous</button>`;
    }
    return '';
}

function getStartPageButtons(page, totalPages) {
    const startPage = Math.max(1, page - 2);
    let html = '';
    if (startPage > 1) {
        html += `<button class="pagination-btn" onclick="goToPage(1)">1</button>`;
        if (startPage > 2) {
            html += '<span class="pagination-dots">...</span>';
        }
    }
    return html;
}

function getPageButtons(page, totalPages) {
    const startPage = Math.max(1, page - 2);
    const endPage = Math.min(totalPages, page + 2);
    let html = '';
    for (let i = startPage; i <= endPage; i++) {
        const activeClass = i === page ? 'active' : '';
        html += `<button class="pagination-btn ${activeClass}" onclick="goToPage(${i})">${i}</button>`;
    }
    return html;
}

function getEndPageButtons(page, totalPages) {
    const endPage = Math.min(totalPages, page + 2);
    let html = '';
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            html += '<span class="pagination-dots">...</span>';
        }
        html += `<button class="pagination-btn" onclick="goToPage(${totalPages})">${totalPages}</button>`;
    }
    return html;
}

function getNextButton(page, totalPages) {
    if (page < totalPages) {
        return `<button class="pagination-btn" onclick="goToPage(${page + 1})">Next »</button>`;
    }
    return '';
}

function getPageInfo(page, totalPages, totalCount) {
    return `<div class=\"page-info\">Page ${page} of ${totalPages} (${totalCount} Pokemon total)</div>`;
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
