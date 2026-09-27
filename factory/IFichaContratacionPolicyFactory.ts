import { IPermisosPolicy } from "../policyObject/IPermisosPolicy.js";
import { FichaContratacionModel } from "../model/FichaContratacionModel.js";

export interface IFichaContratacionPolicyFactory {
    crearPolitica(ficha: FichaContratacionModel, idUsuario: string): IPermisosPolicy;
}