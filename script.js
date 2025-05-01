  console.log("script.js carregat");

// Barra del scroll!
// agafem el elements que conformen la barra
const nav = document.querySelector('nav');  
const containerScrollbar = document.querySelector('.container-scrollbar');  
const scrollbar = document.querySelector('.scrollbar');  

//variable per el control de la barra 
let isDragging = false; // posem en false perquè vull que aquesta variable sigui per quan fem click i arrastrem, al principi com que no la clicko estarà en fals
let startY;
let startTop;

function showScrollbar() {        // funció perquè quan estiguem assobre amb el ratolí sigui visible
  scrollbar.style.opacity = '1';  
}

function hideScrollbar(event) {   // vull que la barra no sigui visible quan no tenim el ratolí assobre
  if (!containerScrollbar.contains(event.relatedTarget) && !nav.contains(event.relatedTarget)) {    //event.relatedTarget  hem serveix per veure si el ratolí està entrant en un lloc fora de certs elements, 
    scrollbar.style.opacity = '0';                                                                  // i si és així , els ocultem. per fer-ho fem servir els evenets addEveentlistener mouse enter i mouse leave d'abaix
  }
}

nav.addEventListener('mouseenter', showScrollbar);
containerScrollbar.addEventListener('mouseenter', showScrollbar); //  quan el ratolí entra ( enter) en l'element, s'activa la funció de show

nav.addEventListener('mouseleave', hideScrollbar);
containerScrollbar.addEventListener('mouseleave', hideScrollbar); // quan el ratolí surt ( leave) de l'element, s'activa la funció de hide
