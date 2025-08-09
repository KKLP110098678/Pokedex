
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
- `assets/svg/`: Original SVG files (now embedded in JS).

## API
Uses [PokéAPI](https://pokeapi.co/) for all Pokémon and type data.

## How Type Filtering Works
- When types are selected, the app fetches all Pokémon for each type from the API.
- If multiple types are selected, only Pokémon matching all selected types are shown.
- For each matching Pokémon, full details are fetched and rendered using the card template.

## Maintainers
GitHub Copilot