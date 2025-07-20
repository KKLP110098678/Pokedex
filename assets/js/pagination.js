let currentPage = 1;

function updatePagination(page) {
    const totalPages = Math.ceil(TOTAL_POKEMON / POKEMON_PER_PAGE);
    currentPage = page;
    
    // Create pagination container if it doesn't exist
    let paginationContainer = document.getElementById('pagination-container');
    if (!paginationContainer) {
        paginationContainer = document.createElement('div');
        paginationContainer.id = 'pagination-container';
        paginationContainer.className = 'pagination-container';
        document.body.appendChild(paginationContainer);
    }
    
    let paginationHtml = '<div class="pagination">';
    
    // Previous button
    if (page > 1) {
        paginationHtml += `<button class="pagination-btn" onclick="goToPage(${page - 1})">« Previous</button>`;
    }
    
    // Page numbers
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
    
    // Next button
    if (page < totalPages) {
        paginationHtml += `<button class="pagination-btn" onclick="goToPage(${page + 1})">Next »</button>`;
    }
    
    paginationHtml += '</div>';
    
    // Add page info
    paginationHtml += `<div class="page-info">Page ${page} of ${totalPages} (${TOTAL_POKEMON} Pokemon total)</div>`;
    
    paginationContainer.innerHTML = paginationHtml;
}

function goToPage(page) {
    const totalPages = Math.ceil(TOTAL_POKEMON / POKEMON_PER_PAGE);
    
    if (page < 1 || page > totalPages) {
        return;
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Load the new page
    displayPokemonList(page);
}