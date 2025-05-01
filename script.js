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

// Vull que la barra faci scroll i que vagi sincronitzada amb el nav fent servir la rodeta del ratolí! 
function handleWheel(event) {
  event.preventDefault();  // Evita el desplaçament predefinit per la pagina ja que sinó hi hauria conflicte y no funcionaria el que vull jo

  let scrollAmount = event.deltaY;  // event.deltaY forma part de l'event wheel, que s'activa quan fem servir la rodeta, fa referencia a quant s'ha desplaçat verticalment (Y) la rodeta 
                                    // agafarà la quantitat de desplaçament de l'eix Y, 100px positius puja si és negatiu baixa
 
// ajustar la posició del nav i la barra del scroll
  const navHeight = nav.scrollHeight - nav.clientHeight;  // altura total del contenidor del nav, per on es pot moure la barra y no sobrepassar,
                                                          // per tant resto l'altura total del nav(inclòs el que no es veu) per la que pot veure el client a la pagina(la que es sempre visible en aquell moment).
  const scrollbarHeight = containerScrollbar.clientHeight - scrollbar.clientHeight;  //faig el mateix per l'altura máxima del contenidor de la barra 
  
  const scrollRatio = nav.scrollTop / navHeight;  // la propietat scrollTop representa quants pixels s'ha desplaçat verticalemtn el contingut desdel seu top , es una propietat de js , la puc llegir o assignar-li un valor
                                                  // per tant agafant el que s'ha mogut i divintla per el total de la const navHeight farà que vagin en sincronia
  
// moure la barra amb sincronia del nav i que la barra no desapareixi ni sobrepassi el que veiem
  let scrollbarTop = scrollRatio * scrollbarHeight;  // calcula la posició de la barra de scroll en funció de la proporció del desplaç del nav
                                                    // multiplico el porcentatge per l'altura maxima per on es pot moure. en plan el contingut del nav s'ha mogut un 50% 
                                                    //(ratio= 0.5, 0 es l'inici, 1 el final) i el maxim que s'ha mogut es de 200px, scrollbarTop 0.5*200 fa 100 per tant la barra es posa a 100px del seu top, que seria a la metiat del contingut , i es veu igual que el contingut del nav
  scrollbar.style.top = `${scrollbarTop}px`;// per que es mogui la barra, convertim el resultat descrollbarTop a pixels

 // moure el contingut del nav 
  nav.scrollTop = nav.scrollTop + scrollAmount  // estem sumant l'scrolltop amb els pixels que hem generat al moure la rodeta aixis es moure en sincronia amb el nav
}

//posar l'event wheel al container del scroll i al nav
containerScrollbar.addEventListener('wheel', handleWheel); // event predefinit perque interactuii quan fem servir la rodeta
nav.addEventListener('wheel', handleWheel);
