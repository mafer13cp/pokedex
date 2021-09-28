import '../css/styles.css';
// import pokemon from '../assets/pokeDefault.png';

function getPokemon(id) {
    const apiUrl = new URL(`https://pokemon-bedu.herokuapp.com/v1/pokemons/${id}`);
    return fetch(apiUrl)
        .then(response => response.json());
}

function getPokemons() {
    const apiUrl = new URL('https://pokemon-bedu.herokuapp.com/v1/pokemons');
    return fetch(apiUrl)
        .then(response => response.json());
}

function getGeneration(id) {
    const apiUrl = new URL(`https://pokemon-bedu.herokuapp.com/v1/gens/${id}`);
    return fetch(apiUrl)
        .then(response => response.json());
}

function getGenerations() {
    const apiUrl = new URL('https://pokemon-bedu.herokuapp.com/v1/gens');
    return fetch(apiUrl)
        .then(response => response.json());
}

function getTypes() {
    const apiUrl = new URL('https://pokemon-bedu.herokuapp.com/v1/types');
    return fetch(apiUrl)
        .then(response => response.json());
}

function populatePokemonFromAPI(id) {
    const imageControl = document.getElementById('pokemonImg');
    const nameControl = document.getElementById('nameInfo');
    const pokedexNumberControl = document.getElementById('numInfo');
    const genControl = document.getElementById('genInfo');
    const categoryControl = document.getElementById('catInfo');
    const typesContainer = document.getElementById('types');
    const abilitiesContainer = document.getElementById('abilities');

    getPokemon(id).then(pokemon => {
        // Image
        imageControl.src = pokemon.imageUrl;
        // Name
        setTextChild(nameControl, pokemon.name);
        // Pokedex number
        setTextChild(pokedexNumberControl, pokemon.pokedexNumber ?? '#');
        // Generation
        getGeneration(pokemon.gen).then(gen => {
            const generationText = `${pokemon.gen} - ${gen.name}`
            setTextChild(genControl, generationText ?? '#');
        })
        // Classification
        setTextChild(categoryControl, pokemon.classification);
        // Types
        setTextArrayChild(typesContainer, pokemon.types, 'typeInfo');
        // Abilities
        setTextArrayChild(abilitiesContainer, pokemon.abilities, 'pokemonData');
    });
}

function populatePokemonFromData(pokemon) {
    const imageControl = document.getElementById('pokemonImg');
    const nameControl = document.getElementById('nameInfo');
    const pokedexNumberControl = document.getElementById('numInfo');
    const genControl = document.getElementById('genInfo');
    const categoryControl = document.getElementById('catInfo');
    const typesContainer = document.getElementById('types');
    const abilitiesContainer = document.getElementById('abilities');

    // Image
    imageControl.src = pokemon.imageUrl;
    // Name
    setTextChild(nameControl, pokemon.name);
    // Pokedex number
    setTextChild(pokedexNumberControl, pokemon.pokedexNumber ?? '#');
    // Generation
    getGeneration(pokemon.gen).then(gen => {
        const generationText = `${pokemon.gen} - ${gen.name}`
        setTextChild(genControl, generationText ?? '#');
    })
    // Classification
    setTextChild(categoryControl, pokemon.classification);
    // Types
    setTextArrayChild(typesContainer, pokemon.types, 'typeInfo');
    // Abilities
    setTextArrayChild(abilitiesContainer, pokemon.abilities, 'pokemonData');
}

function setTextChild(parentComponent, text, replace = true) {
    const textNode = document.createTextNode(text);
    // Remove children if children exist
    if (replace && parentComponent.hasChildNodes()) {
        deleteChildren(parentComponent);
    }
    // Add text
    parentComponent.appendChild(textNode);
}

function setTextArrayChild(parentComponent, textArray, className) {
    // Remove children if children exist
    if (parentComponent.hasChildNodes()) {
        deleteChildren(parentComponent);
    }

    // Add each text in array
    for (const text of textArray) {
        const textNode = document.createTextNode(text);
        const paragraphElement = document.createElement('p');

        // Nest text in paragraph
        paragraphElement.appendChild(textNode);
        paragraphElement.className = className;

        // Add paragraph
        parentComponent.appendChild(paragraphElement);
    }
}

function deleteChildren(parentComponent) {
    while (parentComponent.firstChild) {
        parentComponent.removeChild(parentComponent.firstChild);
    }
}

function setButtonsBehavior() {
    // Previous button
    const prevButton = document.getElementById('btnPrev');
    prevButton.addEventListener('click', prevPokemon);
    // Next button
    const nextButton = document.getElementById('btnNext');
    nextButton.addEventListener('click', nextPokemon);
    // Search button
    const searchButton = document.getElementById('searchBtn');
    searchButton.addEventListener('click', searchPokemon);
}

function nextPokemon() {
    if (currentPokemonId <= 151) {
        populatePokemonFromAPI(++currentPokemonId);0
    }
}

function prevPokemon() {
    if (currentPokemonId > 1) {
        populatePokemonFromAPI(--currentPokemonId);
    }
}

function populateSideBar() {
    // Generations
    getGenerations().then(gens => {
        const gensContainer = document.getElementById('genList');
        // Order array
        const orderedGens = gens.sort((g1, g2) => g1.genNumber - g2.genNumber);
        const genNames = orderedGens.map(gen => `${gen.genNumber} - ${gen.name}`);
        setTextArrayChild(gensContainer, genNames);
    })

    // Types
    getTypes().then(types => {
        const typesContainer = document.getElementById('typeList');
        // Remove children
        deleteChildren(typesContainer);
        // Populate types
        for (const type of types) {
            // Create elements
            const container = document.createElement('div');
            const paragraphElement = document.createElement('p');
            const textNode = document.createTextNode(type.type);
            const imageElement = document.createElement('img');

            // Set content
            container.className = 'typeElement';
            imageElement.src = type.imageUrl;
            imageElement.className = 'iconType';

            // Nest elements
            paragraphElement.appendChild(textNode);
            container.appendChild(paragraphElement);
            container.appendChild(imageElement);

            // Add paragraph
            typesContainer.appendChild(container);
        }
    })
}

function searchPokemon() {
    const searchInputControl = document.getElementById('searchTxt');
    const search = searchInputControl.value;
    getPokemons().then(pokemons => {
        const regex = new RegExp(search);
        const searchResults = pokemons.filter(
            pokemon => regex.test(pokemon.name.toLowerCase())
        );
        if (searchResults[0]) {
            populatePokemonFromData(searchResults[0]);
            currentPokemonId = searchResults[0].pokedexNumber;
        } else {
            alert('La pokebúsqueda no ha tenido éxito con el poketérmino: ' + search);
        }
    });
}


let currentPokemonId = 1;
setButtonsBehavior();
populatePokemonFromAPI(currentPokemonId);
populateSideBar();