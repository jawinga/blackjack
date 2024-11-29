//OBSERVACIONES
//He tenido problemas a la hora de mostrar la imagen de las cartas.
//He aprendido como usar serTimeOut, el objeto Promise para mejor funcionalidad

function crearBaraja() {
  const baraja = [];
  const palos = ["C", "T", "R", "D"];

  for (let palosIndex = 0; palosIndex < palos.length; palosIndex++) {
    for (let i = 1; i <= 13; i++) {
      if (i === 11) {
        baraja.push(new Carta("J" + palos[palosIndex]));
      } else if (i === 12) {
        baraja.push(new Carta("Q" + palos[palosIndex]));
      } else if (i === 13) {
        baraja.push(new Carta("K" + palos[palosIndex]));
      } else {
        baraja.push(new Carta(i + palos[palosIndex]));
      }
    }
  }

  return baraja;
}
let puntosJugador = 0;
let puntosBanca = 0;
const baraja = crearBaraja();
const barajaMezclada = _.shuffle(baraja);

const jugador1 = document.querySelector("#jugador");
const banca1 = document.querySelector("#banca");
const cartasBanca = document.querySelector(".card-container-banca");
const cartasJugador = document.querySelector(".card-container-jugador");

function mostrarPuntosJugador() {
  jugador1.innerText += `El jugador tiene ${puntosJugador} puntos.\n`;
}

function mostrarPuntosBanca() {
  banca1.innerText += `La banca tiene ${puntosBanca} puntos.\n`;
}

let pedirCartaBanca = document.querySelector("#banca");

function pedirCarta(jugador) {
  const cartaPedida = barajaMezclada.pop();
  const img = document.createElement("img");
  img.src = cartaPedida.imagen;
  img.alt = `Carta ${cartaPedida.representacion}`;

  if (jugador === "jugador") {
    puntosJugador += cartaPedida.valor;
    cartasJugador.appendChild(img);
    jugador1.innerText += `Sacando carta: ${cartaPedida}\nValor de la carta: ${cartaPedida.valor}\n`;
    mostrarPuntosJugador();
    comprobarPasarse("Jugador", puntosJugador);
  } else if (jugador === "banca") {
    puntosBanca += cartaPedida.valor;
    cartasBanca.appendChild(img);
    banca1.innerText += `Sacando carta: ${cartaPedida}\nValor de la carta: ${cartaPedida.valor}\n`;
    mostrarPuntosBanca();
  }
  return cartaPedida.valor;
}

function pedirMasCartas(resolve) {
  if (puntosBanca < 17) {
    setTimeout(() => {
      pedirCarta("banca");
      pedirMasCartas(resolve);
    }, 1000);
  } else {
    banca1.innerText += `La banca se planta con ${puntosBanca} puntos.\n`;
    resolve();
  }
}

function banca() {
  return new Promise((resolve) => {
    if (puntosBanca < 17) {
      setTimeout(() => {
        pedirCarta("banca");
        pedirMasCartas(resolve);
      }, 1000);
    } else {
      resolve();
    }
  });
}

function comprobarPasarse(jugador, puntos) {
  if (puntos > 21) {
    jugador1.innerText += `${jugador} ha perdido porque se ha pasado de 21 con ${puntos} puntos!!!\n`;
    deshabilitarBotones();
  }
}

function plantarJugadorAction() {
  jugador1.innerText += `El jugador se planta con ${puntosJugador} puntos.\n`;

  // Turno de la banca
  if (puntosBanca < 17) {
    banca().then(() => {
      comprobarGanador();
    });
  } else {
    banca1.innerText += `La banca se planta con ${puntosBanca} puntos.\n`;
    comprobarGanador();
  }
}

function comprobarGanador() {
  if (puntosJugador > 21) {
    jugador1.innerText += `El jugador se ha pasado. La banca gana.\n`;
  } else if (puntosBanca > 21) {
    jugador1.innerText += `La banca se ha pasado. El jugador gana.\n`;
  } else if (puntosJugador > puntosBanca) {
    jugador1.innerText += `El jugador gana con ${puntosJugador} puntos contra ${puntosBanca} de la banca.\n`;
  } else if (puntosJugador < puntosBanca) {
    jugador1.innerText += `La banca gana con ${puntosBanca} puntos contra ${puntosJugador} del jugador.\n`;
  } else {
    jugador1.innerText += `Es un empate con ${puntosJugador} puntos.\n`;
  }
  deshabilitarBotones();
}

function deshabilitarBotones() {
  document.querySelector("#botonPedir").setAttribute("disabled", true);
  document.querySelector("#botonPlantar").setAttribute("disabled", true);
}

function jugadorInicio() {
  console.log("Ahora es turno del jugador!");
  pedirCarta("jugador");
  pedirCarta("jugador");

  const botonPedir = document.querySelector("#botonPedir");
  const botonPlantar = document.querySelector("#botonPlantar");

  botonPedir.addEventListener("click", () => pedirCarta("jugador"));
  botonPlantar.addEventListener("click", () => plantarJugadorAction());
}

function iniciarJuego() {
  const botonComenzar = document.querySelector("#botonComenzar");

  botonComenzar.addEventListener("click", () => {
    botonComenzar.setAttribute("disabled", true);
    botonComenzar.classList.add("disabled");

    banca().then(() => {
      console.log("La banca ha terminado su turno.");
      jugadorInicio();
    });
  });
}

iniciarJuego();
