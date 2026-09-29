// Las rutas de importación son aproximadas según la estructura original de los paquetes
import { EmpleadoModel } from '../model/EmpleadoModel.js';
import { FichaContratacionModel } from '../model/FichaContratacionModel.js';
import { IEtapaState } from '../State/Interface/IEtapaState.js';
import { IEventListener } from './IEventListener.js';
import { EmpleadorSelector } from '../factory/EmpleadorSelector.js';

// En vez de un correo fijo, el destinatario se resuelve en cada evento: es quien tenga
// el cargo encargado de la etapa en la que quedó la ficha (ficha.getEtapa() ya es la etapa
// nueva cuando se dispara el evento). Así, el mismo listener cubre tanto "ETAPA_AVANZADA"
// (avisa al encargado de la siguiente etapa) como "CANDIDATO_RECHAZADO" (avisa a quien
// tenga el cargo encargado de EstadoRechazado).
//
// "salida" es a dónde va el mensaje simulando el envío del correo (Consumer la conecta
// con el panel de notificaciones de la página).
export class EmailNotificationListener implements IEventListener {
    constructor(
        private readonly empleados: EmpleadorSelector,
        private readonly salida: (mensaje: string) => void
    ) {}

    public update(evento: string, ficha: FichaContratacionModel, actor: EmpleadoModel, etapaAnterior: IEtapaState): void {
        const destinatariosUnicos = new Map<string, EmpleadoModel>();

        const cargoEncargado = ficha.getEtapa().encargado();

        const cargosAProcesar = Array.isArray(cargoEncargado) ? cargoEncargado : [cargoEncargado];

        for (const cargo of cargosAProcesar) {
            const encontrados = this.empleados.porCargo(cargo);
            for (const emp of encontrados) {
                destinatariosUnicos.set(emp.getEmail(), emp);
            }
        }

        const reclutadorFicha = ficha.getReclutador(); 
        if (reclutadorFicha) {
            destinatariosUnicos.set(reclutadorFicha.getEmail(), reclutadorFicha);
        }

        for (const destinatario of destinatariosUnicos.values()) {
            this.salida(
                `[EMAIL a ${destinatario.getEmail()}] ${evento}:${ficha.getCandidato().getNombreCompleto()} ` +
                `${etapaAnterior.nombre()} ->${ficha.getEtapa().nombre()} ` +
                `(por ${actor.getNombreCompleto()})`
            );
        }
    }
}
