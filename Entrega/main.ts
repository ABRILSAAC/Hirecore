import { GestorCandidato } from "./Contenedor/GestorCandidato";
import { EstadoAplicado } from "./Estados/EstadoAplicado";

const candidato = new GestorCandidato( "Diana Carolina", new EstadoAplicado());

/* ---- Aplicado-Entrevista-Oferta ----*/

console.log(candidato.Obtener()); // Avanza

candidato.Avanzar();
console.log(candidato.Obtener()); // Entrevista

candidato.Avanzar();
console.log(candidato.Obtener()); // Oferta

/* ---- Aplicado-Entrevista-Rechazado ----*/

// console.log(candidato.Obtener()); // Aplicado

// candidato.Avanzar();
// console.log(candidato.Obtener()); // Entrevista

// candidato.Rechazar();
// console.log(candidato.Obtener()); // Rechazado

/* ---- Aplicado-Rechazado ----*/

// console.log(candidato.Obtener()); // Aplicado

// candidato.Rechazar();
// console.log(candidato.Obtener()); // Rechazado
