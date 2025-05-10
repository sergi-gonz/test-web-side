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

// Desplegable per UserProfile

document.addEventListener("DOMContentLoaded", function() {
  const userProfile = document.querySelector(".user-profile");

  // Funció per crear el menú, he fet arrays per recorrer i poguer insertar els svg's directe, així controlo més la disposició dels elements
  function createUserMenu() {
    const userMenu = document.createElement("div");
    userMenu.id = "user-menu";
    document.body.appendChild(userMenu);

    const menuOptions = [
      {
        svgLeft: `<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" width="22px" height="22px" fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2"><path d="M32.582 370.734C15.127 336.291 5.12 297.425 5.12 256c0-41.426 10.007-80.291 27.462-114.735C74.705 57.484 161.047 0 261.12 0c69.12 0 126.836 25.367 171.287 66.793l-73.31 73.309c-26.763-25.135-60.276-38.168-97.977-38.168-66.56 0-123.113 44.917-143.36 105.426-5.12 15.36-8.146 31.65-8.146 48.64 0 16.989 3.026 33.28 8.146 48.64l-.303.232h.303c20.247 60.51 76.8 105.426 143.36 105.426 34.443 0 63.534-9.31 86.341-24.67 27.23-18.152 45.382-45.148 51.433-77.032H261.12v-99.142h241.105c3.025 16.757 4.654 34.211 4.654 52.364 0 77.963-27.927 143.592-76.334 188.276-42.356 39.098-100.305 61.905-169.425 61.905-100.073 0-186.415-57.483-228.538-141.032v-.233z"/></svg>`,
        text: "Cuenta de Google"
      },
      {
        svgLeft: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M560-520q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM320-330q45-53 108-81.5T560-440q69 0 132 28.5T800-330v-470H320v470Zm0 90q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H320ZM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80H160Zm400-520q-17 0-28.5-11.5T520-640q0-17 11.5-28.5T560-680q17 0 28.5 11.5T600-640q0 17-11.5 28.5T560-600ZM428-320h264q-29-20-63-30t-69-10q-35 0-69 10t-63 30Zm132-245Z"/></svg>`,
        text: "Cambiar de cuenta",
        svgRight: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/></svg>`
      },
      {
        svgLeft: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/></svg>`,
        text: "Cerrar sesión",
      }
    ];

    const menuOptions2 = [
      {
        svgLeft: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M444-200h70v-50q50-9 86-39t36-89q0-42-24-77t-96-61q-60-20-83-35t-23-41q0-26 18.5-41t53.5-15q32 0 50 15.5t26 38.5l64-26q-11-35-40.5-61T516-710v-50h-70v50q-50 11-78 44t-28 74q0 47 27.5 76t86.5 50q63 23 87.5 41t24.5 47q0 33-23.5 48.5T486-314q-33 0-58.5-20.5T390-396l-66 26q14 48 43.5 77.5T444-252v52Zm36 120q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>`,
        text: "Compras y suscripciones"
      },
      {
        svgLeft: `<svg fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" width="24px" height="24px"><path d="M 25 4.7265625 C 24.309 4.7265625 23.619 4.9047187 23 5.2617188 L 8.90625 13.398438 C 7.66825 14.112438 6.90625 15.434281 6.90625 16.863281 L 6.90625 33.136719 C 6.90625 34.565719 7.66825 35.885609 8.90625 36.599609 L 23 44.738281 C 23.619 45.095281 24.309 45.273438 25 45.273438 C 25.691 45.273438 26.381 45.095281 27 44.738281 L 41.09375 36.601562 C 42.33175 35.887563 43.09375 34.565719 43.09375 33.136719 L 43.09375 16.863281 C 43.09375 15.434281 42.33175 14.112438 41.09375 13.398438 L 27 5.2617188 C 26.381 4.9047188 25.691 4.7265625 25 4.7265625 z M 25 6.7265625 C 25.351 6.7265625 25.696 6.8191406 26 6.9941406 L 40.09375 15.130859 C 40.71075 15.486859 41.09375 16.151281 41.09375 16.863281 L 41.09375 33.136719 C 41.09375 33.848719 40.71075 34.511187 40.09375 34.867188 L 26 43.005859 C 25.696 43.180859 25.351 43.273438 25 43.273438 C 24.649 43.273438 24.304 43.180859 24 43.005859 L 9.90625 34.869141 C 9.28925 34.513141 8.90625 33.848719 8.90625 33.136719 L 8.90625 16.863281 C 8.90625 16.151281 9.28925 15.486859 9.90625 15.130859 L 24 6.9941406 C 24.304 6.8191406 24.649 6.7265625 25 6.7265625 z M 24.625 11.339844 C 24.092521 11.339844 23.560728 11.481615 23.087891 11.763672 L 14.212891 17.064453 C 13.308125 17.605215 12.751953 18.586246 12.751953 19.640625 L 12.751953 30.359375 C 12.751953 31.413754 13.308125 32.394785 14.212891 32.935547 L 23.087891 38.236328 C 24.033566 38.800441 25.218388 38.800441 26.164062 38.236328 L 35.039062 32.935547 C 35.943829 32.394785 36.5 31.413754 36.5 30.359375 L 36.5 19.640625 C 36.5 18.586246 35.943829 17.605215 35.039062 17.064453 L 26.164062 11.763672 C 25.691225 11.481615 25.157479 11.339844 24.625 11.339844 z M 24.625 13.337891 C 24.802255 13.337891 24.979509 13.385525 25.138672 13.480469 L 34.013672 18.78125 C 34.316906 18.962488 34.5 19.287004 34.5 19.640625 L 34.5 30.359375 C 34.5 30.712996 34.316906 31.037512 34.013672 31.21875 L 25.138672 36.519531 C 24.820952 36.709057 24.431271 36.708336 24.113281 36.519531 L 24.111328 36.519531 L 15.238281 31.21875 C 14.935047 31.037512 14.751953 30.712996 14.751953 30.359375 L 14.751953 19.640625 C 14.751953 19.287004 14.935047 18.962488 15.238281 18.78125 L 24.111328 13.480469 C 24.270491 13.385525 24.447745 13.337891 24.625 13.337891 z M 20.75 19 L 20.75 31 L 31 25 L 20.75 19 z"/></svg>`,
        text: "Youtube Studio"
      }
    ];

    const menuOptions3 = [
      {
        svgLeft: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-440q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0-80q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0 440q-139-35-229.5-159.5T160-516v-244l320-120 320 120v244q0 152-90.5 276.5T480-80Zm0-400Zm0-315-240 90v189q0 54 15 105t41 96q42-21 88-33t96-12q50 0 96 12t88 33q26-45 41-96t15-105v-189l-240-90Zm0 515q-36 0-70 8t-65 22q29 30 63 52t72 34q38-12 72-34t63-52q-31-14-65-22t-70-8Z"/></svg>`,
        text: "Tus datos en Youtube"
      },
       {
        svgLeft: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M380-160q133 0 226.5-93.5T700-480q0-133-93.5-226.5T380-800h-21q-10 0-19 2 57 66 88.5 147.5T460-480q0 89-31.5 170.5T340-162q9 2 19 2h21Zm0 80q-53 0-103.5-13.5T180-134q93-54 146.5-146T380-480q0-108-53.5-200T180-826q46-27 96.5-40.5T380-880q83 0 156 31.5T663-763q54 54 85.5 127T780-480q0 83-31.5 156T663-197q-54 54-127 85.5T380-80Zm80-400Z"/></svg>`,
        text: "Aspecto: tema del dispositivo",
        svgRight: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/></svg>`
      },
      {
        svgLeft: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m476-80 182-480h84L924-80h-84l-43-122H603L560-80h-84ZM160-200l-56-56 202-202q-35-35-63.5-80T190-640h84q20 39 40 68t48 58q33-33 68.5-92.5T484-720H40v-80h280v-80h80v80h280v80H564q-21 72-63 148t-83 116l96 98-30 82-122-125-202 201Zm468-72h144l-72-204-72 204Z"/></svg>`,
        text: "Idioma: Español",
        svgRight: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/></svg>`
      },
      {
        svgLeft:`<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M680-280q25 0 42.5-17.5T740-340q0-25-17.5-42.5T680-400q-25 0-42.5 17.5T620-340q0 25 17.5 42.5T680-280Zm0 120q31 0 57-14.5t42-38.5q-22-13-47-20t-52-7q-27 0-52 7t-47 20q16 24 42 38.5t57 14.5ZM480-80q-139-35-229.5-159.5T160-516v-244l320-120 320 120v227q-19-8-39-14.5t-41-9.5v-147l-240-90-240 90v188q0 47 12.5 94t35 89.5Q310-290 342-254t71 60q11 32 29 61t41 52q-1 0-1.5.5t-1.5.5Zm200 0q-83 0-141.5-58.5T480-280q0-83 58.5-141.5T680-480q83 0 141.5 58.5T880-280q0 83-58.5 141.5T680-80ZM480-494Z"/></svg>`,
        text: "Modod Restringido: desactivado",
        svgRight: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/></svg>`
      },
      {
        svgLeft: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-155.5t86-127Q252-817 325-848.5T480-880q83 0 155.5 31.5t127 86q54.5 54.5 86 127T880-480q0 82-31.5 155t-86 127.5q-54.5 54.5-127 86T480-80Zm0-82q26-36 45-75t31-83H404q12 44 31 83t45 75Zm-104-16q-18-33-31.5-68.5T322-320H204q29 50 72.5 87t99.5 55Zm208 0q56-18 99.5-55t72.5-87H638q-9 38-22.5 73.5T584-178ZM170-400h136q-3-20-4.5-39.5T300-480q0-21 1.5-40.5T306-560H170q-5 20-7.5 39.5T160-480q0 21 2.5 40.5T170-400Zm216 0h188q3-20 4.5-39.5T580-480q0-21-1.5-40.5T574-560H386q-3 20-4.5 39.5T380-480q0 21 1.5 40.5T386-400Zm268 0h136q5-20 7.5-39.5T800-480q0-21-2.5-40.5T790-560H654q3 20 4.5 39.5T660-480q0 21-1.5 40.5T654-400Zm-16-240h118q-29-50-72.5-87T584-782q18 33 31.5 68.5T638-640Zm-234 0h152q-12-44-31-83t-45-75q-26 36-45 75t-31 83Zm-200 0h118q9-38 22.5-73.5T376-782q-56 18-99.5 55T204-640Z"/></svg>`,
        text: "Ubicación: España",
        svgRight: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/></svg>`
      },
      {
        svgLeft: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M160-200q-33 0-56.5-23.5T80-280v-400q0-33 23.5-56.5T160-760h640q33 0 56.5 23.5T880-680v400q0 33-23.5 56.5T800-200H160Zm0-80h640v-400H160v400Zm160-40h320v-80H320v80ZM200-440h80v-80h-80v80Zm120 0h80v-80h-80v80Zm120 0h80v-80h-80v80Zm120 0h80v-80h-80v80Zm120 0h80v-80h-80v80ZM200-560h80v-80h-80v80Zm120 0h80v-80h-80v80Zm120 0h80v-80h-80v80Zm120 0h80v-80h-80v80Zm120 0h80v-80h-80v80ZM160-280v-400 400Z"/></svg>`,
        text: "Combinaciones de teclas"
      }
    ];

    const menuOptions4 = [
      {
        svgLeft: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/></svg>`,
        text: "Configuración"
      }
    ];

    const menuOptions5 = [
      {
        svgLeft: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M478-240q21 0 35.5-14.5T528-290q0-21-14.5-35.5T478-340q-21 0-35.5 14.5T428-290q0 21 14.5 35.5T478-240Zm-36-154h74q0-33 7.5-52t42.5-52q26-26 41-49.5t15-56.5q0-56-41-86t-97-30q-57 0-92.5 30T342-618l66 26q5-18 22.5-39t53.5-21q32 0 48 17.5t16 38.5q0 20-12 37.5T506-526q-44 39-54 59t-10 73Zm38 314q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>`,
        text: "Ayuda"
      },
      {
        svgLeft: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M200-120v-680h360l16 80h224v400H520l-16-80H280v280h-80Zm300-440Zm86 160h134v-240H510l-16-80H280v240h290l16 80Z"/></svg>`,
        text: "Enviar sugerencias"
      }
    ];

    const firstBlock = document.createElement("div");
    firstBlock.className = "menu-block1";
    userMenu.appendChild(firstBlock);

    menuOptions.forEach(function(option) {
      const menuItem = document.createElement("div");
      menuItem.className = "menu-item";
      menuItem.innerHTML = 
      `<div class="svg-left">${option.svgLeft}</div>
        <span class="menu-item-text">${option.text}</span>
        <div class="svg-right">${option.svgRight || ''}</div>`;
    firstBlock.appendChild(menuItem);
    });

    const separator = document.createElement("div");
    separator.className = "menu-separator";
    userMenu.appendChild(separator);

    const secondBlock = document.createElement("div");
    secondBlock.className = "menu-block1";
    userMenu.appendChild(secondBlock);

    menuOptions2.forEach(function(option) {
      const menuItem2 = document.createElement("div");
      menuItem2.className = "menu-item";
      menuItem2.innerHTML = 
        `<div class="svg-left">${option.svgLeft}</div>
        <span class="menu-item-text">${option.text}</span>
        <div class="svg-right">${option.svgRight || ''}</div>`;
      secondBlock.appendChild(menuItem2);
    });

    const separator2 = document.createElement("div");
    separator2.className = "menu-separator";
    userMenu.appendChild(separator2);

    const thirdBlock = document.createElement("div");
    thirdBlock.className = "menu-block1";
    userMenu.appendChild(thirdBlock);

    menuOptions3.forEach(function(option) {
      const menuItem3 = document.createElement("div");
      menuItem3.className = "menu-item";
      menuItem3.innerHTML =
        `<div class="svg-left">${option.svgLeft}</div>
        <span class="menu-item-text">${option.text}</span>
        <div class="svg-right">${option.svgRight || ''}</div>`;
      thirdBlock.appendChild(menuItem3);
    });

    const separator3 = document.createElement("div");
    separator3.className = "menu-separator";
    userMenu.appendChild(separator3);

    const fourthBlock = document.createElement("div");
    fourthBlock.classList = "menu-block1";
    userMenu.appendChild(fourthBlock);

    menuOptions4.forEach(function(option) {
      const menuItem4 = document.createElement("div");
      menuItem4.className = "menu-item";
      menuItem4.innerHTML =
        `<div class="svg-left">${option.svgLeft}</div>
        <span class="menu-item-text">${option.text}</span>
        <div class="svg-right">${option.svgRight || ''}</div>`;
      fourthBlock.appendChild(menuItem4);
    });

    const separator4 = document.createElement("div");
    separator4.className = "menu-separator";
    userMenu.appendChild(separator4);

    const fifthBlock = document.createElement("div");
    fifthBlock.classList = "menu-block1";
    userMenu.appendChild(fifthBlock);

    menuOptions5.forEach(function(option) {
      const menuItem5 = document.createElement("div");
      menuItem5.className = "menu-item";
      menuItem5.innerHTML = 
      `<div class="svg-left">${option.svgLeft}</div>
        <span class="menu-item-text">${option.text}</span>
        <div class="svg-right">${option.svgRight || ''}</div>`;
      fifthBlock.appendChild(menuItem5);
    });

    /*const separator5 = document.createElement("div");
    separator5.className = "menu-separator";
    userMenu.appendChild(separator5);*/  // sembla que el div separator, a mozzilla, apareix cada dos blocks, el per què? ni flapa


    return userMenu;
  }

  // Funció per alternar la visibilitat del menú
  function toggleMenu() {
    let userMenu = document.getElementById("user-menu");

    if (!userMenu) {
      userMenu = createUserMenu();
    }

    if (userMenu.style.display === "none") {
        userMenu.style.display = "block";
        } else {
        userMenu.style.display = "none";
        }
  }

  // Event listener per mostrar/ocultar el menú
  userProfile.addEventListener("click", function(event) {
    event.stopPropagation();
    toggleMenu();
  });

  // Event listener per tancar el menú si es fa clic fora
  document.addEventListener("click", function(event) {
    const userMenu = document.getElementById("user-menu");

    if (userMenu && userMenu.style.display === "block") {
      const isClickInsideMenu = userMenu.contains(event.target);
      const isClickProfile = userProfile.contains(event.target);

      if (!isClickInsideMenu && !isClickProfile) {
        userMenu.style.display = "none";
      }
    }
  });
});
