import { EmpleadoModel } from '../model/EmpleadoModel';
import { FichaContratacionModel } from '../model/FichaContratacionModel';
import { EventManager } from '../observer/EventManager';
import { FichaContratacionPolicy } from '../policyObject/FichaContratacionPolicy';
import { IEtapaState } from '../state/IEtapaState';
import { AvanzarEtapaCommand } from './AvanzarEtapaCommand';
import { RechazarEtapaCommand } from './RechazarEtapaCommand';

export class FichaContratacionController {
    constructor(private readonly eventManager: EventManager) {}

    public avanzarEtapa(empleado: EmpleadoModel, ficha: FichaContratacionModel): void {
        const policy = this.crearPolitica(empleado, ficha);
        ficha.getHistorial().ejecutar(new AvanzarEtapaCommand(policy, ficha));
    }

    public rechazarEtapa(empleado: EmpleadoModel, ficha: FichaContratacionModel): void {
        const policy = this.crearPolitica(empleado, ficha);
        ficha.getHistorial().ejecutar(new RechazarEtapaCommand(policy, ficha));
    }

    public deshacer(empleado: EmpleadoModel, ficha: FichaContratacionModel): boolean {
        const etapaAntesDeDeshacer: IEtapaState = ficha.getEtapa();
        const deshecho: boolean = ficha.getHistorial().deshacerUltimo();
        
        if (deshecho) {
            this.eventManager.notifyEvent("CAMBIO_DESHECHO", ficha, empleado, etapaAntesDeDeshacer);
        }
        
        return deshecho;
    }

    private crearPolitica(empleado: EmpleadoModel, ficha: FichaContratacionModel): FichaContratacionPolicy {
        return new FichaContratacionPolicy(empleado, ficha.getEtapa(), this.eventManager);
    }
}