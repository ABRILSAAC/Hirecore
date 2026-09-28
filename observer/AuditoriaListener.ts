// Las rutas de importación son aproximadas según la estructura original de los paquetes
import { EmpleadoModel } from '../model/EmpleadoModel';
import { FichaContratacionModel } from '../model/FichaContratacionModel';
import { RegistroAuditoriaModel } from '../model/RegistroAuditoriaModel';
import { IEtapaState } from '../state/IEtapaState';
import { IEventListener } from './IEventListener';

// Listener del Observer dedicado a dejar constancia de cada cambio: quién, cuándo, dónde y cuál fue el cambio
export class AuditoriaListener implements IEventListener {
    private readonly registros: RegistroAuditoriaModel[] = [];

    public update(evento: string, ficha: FichaContratacionModel, actor: EmpleadoModel, etapaAnterior: IEtapaState): void {
        this.registros.push(new RegistroAuditoriaModel(
            new Date(), // Equivalente a LocalDateTime.now()
            `${actor.getNombreCompleto()} (${actor.getCargo()})`,
            `${ficha.getCandidato().getNombreCompleto()} -${ficha.getCargo()}`,
            evento,
            etapaAnterior.nombre(),
            ficha.getEtapa().nombre()
        ));
    }

    public getRegistros(): RegistroAuditoriaModel[] {
        // Retorna una copia del arreglo para proteger la lista original (equivalente a List.copyOf)
        return [...this.registros];
    }
}