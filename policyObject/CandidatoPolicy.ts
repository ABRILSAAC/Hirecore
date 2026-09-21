import { CandidatoModel } from "../model/CandidatoModel";
import { FichaContratacionModel } from "../model/FichaContratacionModel";
import { IPermisosPolicy } from "./IPermisosPolicy";

export class CandidatoPolicy implements IPermisosPolicy {
    private camposVisibles: Set<String>;

    public constructor(ficha: FichaContratacionModel, candidato: CandidatoModel) {
        const esSuficha = ficha.getCandidato() == candidato; 
        this.camposVisibles = esSuficha ? new Set<String>(["Nombre", "Apellidos", "Email", "FechaNacimiento", "Profesion", "Etapa", "Cargo"]) : new Set<String>();
    }

    public puedeLeer(campo: string): boolean {
        return this.camposVisibles.has(campo);
    }

    public puedeEscribir(campo: string): boolean {
        return false;
    }
}