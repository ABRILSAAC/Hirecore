// Las rutas de importación son aproximadas según la estructura original de los paquetes
import { EmpleadoModel } from '../model/EmpleadoModel.js';
import { FichaContratacionModel } from '../model/FichaContratacionModel.js';
import { IEtapaState } from '../State/Interface/IEtapaState.js';

export interface IEventListener {
    update(evento: string, ficha: FichaContratacionModel, actor: EmpleadoModel, etapaAnterior: IEtapaState): void;
}