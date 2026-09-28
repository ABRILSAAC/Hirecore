// Las rutas de importación son aproximadas según la estructura original de los paquetes
import { EmpleadoModel } from '../model/EmpleadoModel.js';
import { FichaContratacionModel } from '../model/FichaContratacionModel.js';
import { IEtapaState } from '../State/Interface/IEtapaState.js';
import { IEventListener } from './IEventListener.js';

export class EventManager {
    private readonly listeners: Map<string, IEventListener[]> = new Map();

    public subscribe(evento: string, listener: IEventListener): void {
        if (!this.listeners.has(evento)) {
            this.listeners.set(evento, []);
        }
        // Usamos "!" (non-null assertion) porque garantizamos en las líneas anteriores que el arreglo existe
        this.listeners.get(evento)!.push(listener);
    }

    public unsubscribe(evento: string, listener: IEventListener): void {
        const suscritos = this.listeners.get(evento);
        if (suscritos && suscritos.length > 0) {
            const index = suscritos.indexOf(listener);
            if (index !== -1) {
                suscritos.splice(index, 1);
            }
        }
    }

    public notifyEvent(evento: string, ficha: FichaContratacionModel, actor: EmpleadoModel, etapaAnterior: IEtapaState): void {
        // Obtenemos los listeners del evento o un arreglo vacío por defecto
        const suscritos = this.listeners.get(evento) || [];
        
        // Se utiliza el operador spread [...] para hacer una copia del arreglo.
        // Esto previene errores si un listener se desuscribe durante el ciclo de notificación.
        for (const listener of [...suscritos]) {
            listener.update(evento, ficha, actor, etapaAnterior);
        }
    }
}