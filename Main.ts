import { Consumer } from "./consumer/Consumer.js";
import { CandidatoModel } from "./model/CandidatoModel.js";
import { EmpleadoModel } from "./model/EmpleadoModel.js";
import { GerenteContratacionStrategy } from "./Strategy/GerenteContratacionStrategy.js";
import { NominaEstrategia } from "./Strategy/NominaEstrategia.js";
import { RecursosHumanosEstrategia } from "./Strategy/RecursosHumanosEstrategia.js";
import { ReclutadorEstrategia } from "./Strategy/ReclutadorEstrategia.js";

// Datos externos al software
const reclutador = new EmpleadoModel("Carlos", "Perez", "carlos@test.com", "Reclutador", new ReclutadorEstrategia());
const rrhh = new EmpleadoModel("Marta", "Lopez", "marta@test.com", "Recursos Humanos", new RecursosHumanosEstrategia());
const nomina = new EmpleadoModel("Ana", "Gomez", "ana@test.com", "Nomina", new NominaEstrategia());
const gerente = new EmpleadoModel("Jorge", "Mora", "jorge@test.com", "Gerente de Contratación", new GerenteContratacionStrategy());
const laura = new CandidatoModel("Laura", "Ruiz", "laura@test.com", new Date("1995-04-12"), "Ingeniera");
const pedro = new CandidatoModel("Pedro", "Sanz", "pedro@test.com", new Date("1990-08-23"), "Analista");

const consumer = new Consumer();
consumer.registrarEmpleado("e1", reclutador);
consumer.registrarEmpleado("e2", rrhh);
consumer.registrarEmpleado("e3", nomina);
consumer.registrarEmpleado("e4", gerente);
consumer.registrarCandidato("c1", laura);
consumer.registrarCandidato("c2", pedro);
consumer.iniciar();
