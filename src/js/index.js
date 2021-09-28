import '../css/styles.css';
import pokemon from '../assets/pokeDefault.png';

function getPokemon(id) {
    const apiUrl = new URL(`https://pokemon-bedu.herokuapp.com/v1/pokemons/${id}`);
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

function populatePokemonData(id) {
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
    for(const text of textArray) {
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
    const prevButton = document.getElementById('btnPrev');
    prevButton.addEventListener('click', prevPokemon);
    const nextButton = document.getElementById('btnNext');
    nextButton.addEventListener('click', nextPokemon);
}

function nextPokemon() {
    if(currentPokemonId < 150) {
        populatePokemonData(++currentPokemonId);
    }
}

function prevPokemon() {
    if(currentPokemonId > 1) {
        populatePokemonData(--currentPokemonId);
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
        // deleteChildren(gensContainer);
        // for(const gen of gens) {
        //     const genText = `${gen.genNumber} - ${gen.name}`;
        //     setTextChild(gensContainer, genText, false);
        // }
    })
}

var currentPokemonId = 1;
setButtonsBehavior();
populatePokemonData(currentPokemonId);
populateSideBar();