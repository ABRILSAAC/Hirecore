// Las rutas de importación son aproximadas según la estructura original de los paquetes
import { EmpleadoModel } from '../model/EmpleadoModel';
import { FichaContratacionModel } from '../model/FichaContratacionModel';
import { IEtapaState } from '../state/IEtapaState';

export interface IEventListener {
    update(evento: string, ficha: FichaContratacionModel, actor: EmpleadoModel, etapaAnterior: IEtapaState): void;
}