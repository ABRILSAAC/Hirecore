import { IFichaContratacionPolicyFactory } from "./IFichaContratacionPolicyFactory.js";
import { IPermisosPolicy } from "../policyObject/IPermisosPolicy.js";
import { FichaContratacionPolicy } from "../policyObject/FichaContratacionPolicy.js";
import { CandidatoPolicy } from "../policyObject/CandidatoPolicy.js";
import { FichaContratacionModel } from "../model/FichaContratacionModel.js";
import { EmpleadorSelector } from "./EmpleadorSelector.js";
import { CandidatoSelector } from "./CandidatoSelector.js";
import { EventManager } from "../observer/EventManager.js";

export class FichaContratacionPolicyFactory implements IFichaContratacionPolicyFactory {
    private readonly empleados: EmpleadorSelector;
    private readonly candidatos: CandidatoSelector;
    private readonly eventManager: EventManager;

    public constructor(empleados: EmpleadorSelector, candidatos: CandidatoSelector, eventManager: EventManager) {
        this.empleados = empleados;
        this.candidatos = candidatos;
        this.eventManager = eventManager;
    }

    public crearPolitica(ficha: FichaContratacionModel, idUsuario: string): IPermisosPolicy {
        const empleado = this.empleados.obtenerPorId(idUsuario);
        if (empleado !== undefined) {
            return new FichaContratacionPolicy(empleado, ficha.getEtapa(), this.eventManager);
        }

        const candidato = this.candidatos.obtenerPorId(idUsuario);
        if (candidato !== undefined) {
            return new CandidatoPolicy(ficha, candidato);
        }

        throw new Error("Usuario no registrado: " + idUsuario);
    }
}
