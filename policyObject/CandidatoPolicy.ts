import { CandidatoModel } from "../model/CandidatoModel.js";
import { FichaContratacionModel } from "../model/FichaContratacionModel.js";
import { IPermisosPolicy } from "./IPermisosPolicy.js";

export class CandidatoPolicy implements IPermisosPolicy {
    private readonly camposVisibles: Set<string>;

    public constructor(ficha: FichaContratacionModel, candidato: CandidatoModel) {
        const esSuficha = ficha.getCandidato() == candidato; 
        this.camposVisibles = esSuficha ? new Set<string>(["Nombre", "Apellidos", "Email", "FechaNacimiento", "Profesion", "Etapa", "Cargo"]) : new Set<string>();
    }

    public puedeLeer(campo: string): boolean {
        return this.camposVisibles.has(campo);
    }

    public puedeEscribir(campo: string): boolean {
        return false;
    }
}