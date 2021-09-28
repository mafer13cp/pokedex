import '../css/styles.css';
import pokemonDefault from '../assets/pokeDefault.png';

const typeColors = {
    flying: "#98bcec",
    steel: "#5095a4",
    rock: "#cdbb8b",
    grass: "#6cbc5b",
    dark: "#585661",
    ghost: "#4f6fbc",
    water: "#369edf",
    fairy: "#ec93e5",
    poison:"#af66cf",
    normal: "#a0a29f",
    fighting: "#d6435d",
    ground: "#de7c4d",
    fire: "#ffa44d",
    psychic: "#ff8582",
    bug: "#9bbc31",
    ice: "#74d0c3",
    electric: "#fcd850",
    dragon: "#016dc9"
};

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

function getClassifications() {
    const apiUrl = new URL('https://pokemon-bedu.herokuapp.com/v1/classification');
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
    if (!pokemon.imageUrl) {
        imageControl.src = pokemonDefault;
    }
    else
        imageControl.src = pokemon.imageUrl;
    // Name
    setTextChild(nameControl, pokemon.name);
    // Pokedex number
    setTextChild(pokedexNumberControl, pokemon.pokedexNumber ?? '#');
    // Generation
    if (!pokemon.gen){
        setTextChild(genControl, "? - ???");
    }
    else {
        getGeneration(pokemon.gen).then(gen => {
            const generationText = `${pokemon.gen} - ${gen.name}`
            setTextChild(genControl, generationText ?? '#');
        })
    }
    // Classification
    setTextChild(categoryControl, pokemon.classification);
    // Types
    setTextArrayChild(typesContainer, pokemon.types, 'typeInfo', true);
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

function setTextArrayChild(parentComponent, textArray, className, type = false) {
    // Remove children if children exist
    if (parentComponent.hasChildNodes()) {
        deleteChildren(parentComponent);
    }

    // Add each text in array
    for (const text of textArray) {
        const textNode = document.createTextNode(text);
        const paragraphElement = document.createElement('p');
        if (!type){
            paragraphElement.style.backgroundColor = typeColors[text];
        }
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
    getClassifications().then(classifications => {
        const catContainer = document.getElementById('catList');
        
        const catNames = classifications.map(classification => classification.name);
        setTextArrayChild(catContainer, catNames);
    })
}

function searchPokemon() {
    const searchInputControl = document.getElementById('searchTxt');
    const search = searchInputControl.value;
    getPokemons().then(pokemons => {
        const regex = new RegExp(search, 'i');
        const searchResults = pokemons.filter(
            pokemon => regex.test(pokemon.name.toLowerCase())
        );
        if (searchResults[0]) {
            populatePokemonFromData(searchResults[0]);
            currentPokemonId = searchResults[0].pokedexNumber;
        } else {
            //alert('La pokebúsqueda no ha tenido éxito con el poketérmino: ' + search);
            const notFound = 
            {   name: "Not found",
                pokedexNumber: "???",
                classification: "---",
                abilities: ["---"],
                types: ["---"]
            };
            populatePokemonFromData(notFound);
        }
    });
}


//Accordion
var acc = document.getElementsByClassName("accordion");

var genElement = document.getElementById('genAcc');
genElement.addEventListener("click", genAcc);
var typeElement = document.getElementById('typesAcc');
typeElement.addEventListener("click", typesAcc);
var catElement = document.getElementById('catAcc');
catElement.addEventListener("click", catAcc);

function genAcc () {
    var panel = document.getElementById('genList');
    moveAccordion (genElement, panel);
}
function typesAcc () {
    var panel = document.getElementById('typeList');
    moveAccordion (typeElement, panel);
}
function catAcc () {
    var panel = document.getElementById('catList');
    moveAccordion (catElement, panel);
}

function moveAccordion (accElement,panel) {
    const display = panel.style.display;
    closeAll();
    if (display === "flex") {
        panel.style.display = "none";
        accElement.children[0].innerText = "expand_more";
      }
    else {
        panel.style.display = "flex";
        accElement.children[0].innerText = "expand_less";
    }
}

function closeAll () {
    for (var i = 0; i < acc.length; i++) {
        var panel = acc[i].nextElementSibling;
        panel.style.display = "none";
        acc[i].children[0].innerText = "expand_more";
      }
}


let currentPokemonId = 1;
setButtonsBehavior();
populatePokemonFromAPI(currentPokemonId);
populateSideBar();
closeAll();