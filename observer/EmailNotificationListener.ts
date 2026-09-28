// Las rutas de importación son aproximadas según la estructura original de los paquetes
import { EmpleadoModel } from '../model/EmpleadoModel';
import { FichaContratacionModel } from '../model/FichaContratacionModel';
import { IEtapaState } from '../state/IEtapaState';
import { IEventListener } from './IEventListener';

export class EmailNotificationListener implements IEventListener {
    constructor(private readonly email: string) {}

    public update(evento: string, ficha: FichaContratacionModel, actor: EmpleadoModel, etapaAnterior: IEtapaState): void {
        console.log(
            `[EMAIL a ${this.email}] ${evento}:${ficha.getCandidato().getNombreCompleto()} ` +
            `${etapaAnterior.nombre()} ->${ficha.getEtapa().nombre()} ` +
            `(por ${actor.getNombreCompleto()})`
        );
    }
}