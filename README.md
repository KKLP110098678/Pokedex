
# Pokedex

## Overview
This project is a web-based Pokédex that allows users to browse, filter, and view details about Pokémon using data from the PokéAPI. It features type-based filtering, dynamic card rendering, and embedded SVG icons for each Pokémon type.

## Features
- Browse all Pokémon with detailed cards
- Filter Pokémon by one or more types
- SVG icons for each Pokémon type (embedded in JavaScript)
- Responsive UI with dynamic rendering

## Usage
1. Open `index.html` in your browser.
2. Use the type filter to select one or more Pokémon types.
3. The main content updates to show only Pokémon matching the selected types.
4. Each Pokémon card displays its image, name, and type icons.

## Code Structure
- `assets/js/pokemon-types.js`: Handles type filtering, SVG icon rendering, and filtered Pokémon display.
- `assets/js/render.js`: Contains the card rendering logic (`getCardHtml`).
- `assets/css/main.css`: Styles for the Pokédex UI.

## JavaScript Function Overview

### details.js
- Lädt und zeigt Detailinformationen zu einem ausgewählten Pokémon an.
- Funktionen: Datenabruf, Detailkarten-Rendering, UI-Interaktion für Details.

### pagination.js
- Steuert die Seitennavigation der Pokémon-Liste.
- Funktionen:
	- `updatePagination(page, customTotal)`: Aktualisiert die Paginierungsanzeige basierend auf Filter/Suche.
	- `goToPage(page)`: Wechselt die Seite und ruft die passende Anzeige-/Filterfunktion auf.

### pokemon-types.js
- Filtert Pokémon nach Typen und kombiniert Such- und Filterergebnisse.
- Funktionen:
	- `fetchPokemonTypes()`: Lädt alle verfügbaren Typen von der API.
	- `getPokemonTypeIcon(type)`: Gibt das SVG-Icon für einen Typ zurück.
	- `filterByTypes(page)`: Filtert die Pokémon-Liste nach gewählten Typen und aktualisiert die Anzeige.
	- `applyTypeFilterToList(pokemonList, selectedTypes)`: Filtert eine Liste nach Typen.
	- `displayFilteredPokemon(pokemon)`: Zeigt die gefilterten Pokémon an.
	- `resetTypeFilter()`: Setzt die Typ-Filter zurück (ohne die Suche zu beeinflussen).

### render.js
- Rendert die Hauptliste der Pokémon und initialisiert globale Variablen.
- Funktionen:
	- `getCardHtml(pokemon)`: Erstellt das HTML für eine Pokémon-Karte.
	- Initialisiert die Anzeige und bindet Filter/Suche/Paginierung zusammen.

### search.js
- Implementiert die Suchfunktion für Pokémon nach Name oder ID.
- Funktionen:
	- `searchPokemon(query)`: Filtert die angezeigten Karten nach Suchbegriff.
	- `handleSearch(event)`: Reagiert auf Eingaben im Suchfeld.
	- `handleSearchButton()`: Startet die Suche.
	- `clearSearch()`: Setzt die Suche zurück und zeigt alle Karten an.

- `assets/svg/`: Original SVG files (now embedded in JS).

## API
Uses [PokéAPI](https://pokeapi.co/) for all Pokémon and type data.

## How Type Filtering Works
- When types are selected, the app fetches all Pokémon for each type from the API.
- If multiple types are selected, only Pokémon matching all selected types are shown.
- For each matching Pokémon, full details are fetched and rendered using the card template.
