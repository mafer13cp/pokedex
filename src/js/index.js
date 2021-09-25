import '../css/styles.css';
import pokemon from '../assets/pokeDefault.png';

document.querySelector('#pokemonImg').src = pokemon;



//Accordion
var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");

    var panel = this.nextElementSibling;
    if (panel.style.display === "flex") {
      panel.style.display = "none";
      this.children[0].innerText = "expand_more";
    } else {
      panel.style.display = "flex";
      this.children[0].innerText = "expand_less";
    }
  });
}

//Falta que se cierren los demás al abrir otro
