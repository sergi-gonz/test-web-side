  console.log("script.js carregat");

// BARRA DE SCROLL COMPORTAMENT!
// agafem el elements que conformen la barra
const nav = document.querySelector('nav');  
const containerScrollbar = document.querySelector('.container-scrollbar');  
const scrollbar = document.querySelector('.scrollbar');  

function showScrollbar() {        // funció perquè quan estiguem assobre amb el ratolí sigui visible
  scrollbar.style.opacity = '1';  
}

function hideScrollbar(event) {   // vull que la barra no sigui visible quan no tenim el ratolí assobre
  if (isDragging) return; // si estem arrastarnt para la funció, ja que vull que es mantingui visible al fer-ho
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

//variable per el control de la barra 
let isDragging = false; // posem en false perquè vull que aquesta variable sigui per quan fem click i arrastrem, al principi com que no la clicko estarà en fals
let startY; //posició del ratolí en vertical
let startTop; // la posició de la barra 

// Fem que funcioni al clicar i arrastrar la barra 
scrollbar.addEventListener('mousedown', function(event) { // mousedown s'actica amb el clik del ratolí sobre un element
  isDragging = true;
  startY = event.clientY;  // aqui guardem la posició vertical del ratolí al fer click
  startTop = scrollbar.offsetTop;  // guardem la posició vertcial actual de la barra dins el seu div , per saber on s'està moguent i després sumar-ho amb el moviment el ratolí
  document.body.style.userSelect = 'none';  // es posa per evitar que mentres arrastres si pases per sobre de text no el seleccionis o hi facis res
});

// per netejar el body.style usersSelect i que entengui que passa quan deixem de clickar
document.addEventListener('mouseup', function() { // mouseup s'activa quan l'usuari deixa de fer click en qualsevol lloc de la pagina no només a la barra
  isDragging = false;                             // no fem servir event tot i que mouseup ho és perquè no accedeix a cap event, simplement deixem de fer click, per tant és com sinó fós un event
  document.body.style.userSelect = '';  // perque es pugui tornar a seleccionar o agafar el text, ho deixem en blanc i es queda com al principi
});

// mentres arrastro la barra 
document.addEventListener('mousemove', function(event) { // mousemove s'activa cada cop que es mou el ratolí dins l'area que li diem o durant un event que li hem especificat
  if (isDragging) {
    scrollbar.style.opacity = '1';  // afegim això per que sigui visible la barra mentres estem arrastrant
  }
  if (!isDragging) return; // posem això per fer que s'activi només quan estem fent dragging, osigui arrastrant amb el ratolí

  let offset = event.clientY - startY;  // poso offset perquè en javascript o posen per descriure moviment o diferencia a partir d'un punt de referencia, aqui guardem la diferencia en px entre la posicio actual del ratolí i la posició de quan hem fet click en donarà un resultat positiu o negatiu
  let newTop = startTop + offset;  // aqui sumem la posicio inicial de la barra més el que s'ha mogut el ratolí desde que s'ha començat a desplaçar, això ens dona la posició de la barra per aquell moment

  // limitar el moviment de la barra perquè no sobresurti
  const maxTop = containerScrollbar.clientHeight - scrollbar.clientHeight; // delimitem per on es pot moure restant l'altura visible del contenidor de la barra menys l'altura del que ocupa la barra
                                                                           // en plan maxTop = 300px que fa el contenidor - 50px de la barra, = 250px, per tant la barra es pot moure 250px desdel top del container
  if (newTop < 0) newTop = 0;           // si la posició de la barra és més petita de 0 vol dir que ha sobresurtit dels limits del top, per tant ho ajustem perquè sigui 0 i no es mogui a la part no visible                                            
  if (newTop > maxTop) newTop = maxTop; // aqui fem el mateix per el bottom del cotainer, si és més gran que maxTop que és el limit d'abaix, newTop passarà a ser el resultat de maxTop.


  scrollbar.style.top = `${newTop}px`; //modifico l'estil del scrollbar, determinant els pixels del top , aixis conseguim el valor perque es mogui, basicament passem el numero a pixels que és el que necessito

  // sincronitzar el moviment de la barra amb el moviment del nav 
  const navHeight = nav.scrollHeight - nav.clientHeight; // aquesta resta ens dona l'altura total desplaçable dins el contingut del nav (1000px del total del nav menys 400px del que es veu = 600px desplaçables dins el nav)
  const scrollbarHeight = containerScrollbar.clientHeight - scrollbar.clientHeight; // aqui fem el mateix per saber quan pot recorre la barra dins el seu container
  nav.scrollTop = (newTop / scrollbarHeight) * navHeight; //sincronitzem el que es mou el nav amb la scrollbar
                                                          // newTop que es la posicio actual de la barra divida entre la dist max que la barra pot recorre, ens dona la proporció de desplaçament de la barra respecte la distancia max que es pot moure
});                                                       // llavors ho multipliquem per l'altura total desplaçable del nav, el que ens donarà quan s'ha de moure el nav respecte la posició de la barra


// Menu header , ocultar el nav inicial quan fem click 
//toggle el que fà és cambiar de classes en css , les treu o les posa segons li diguis, en aquest cas ho faig a través del clik del ratolí
document.querySelector(".menu-header").addEventListener("click", function () {
  const nav = document.querySelector("nav");
  const scrollbarContainer = document.querySelector(".container-scrollbar");
  const subMenu = document.querySelector(".sub-menu");

  nav.classList.toggle("reduced-mode");
  scrollbarContainer.classList.toggle("reduced-mode");
  subMenu.classList.toggle("reduced-mode");
});
