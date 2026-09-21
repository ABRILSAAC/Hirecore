import { IPermisosPolicy } from "../policyObject/IPermisosPolicy";
import { FichaContratacionModel } from "../model/FichaContratacionModel";

export interface IFichaContratacionPolicyFactory {
    crearPolitica(ficha: FichaContratacionModel, idUsuario: string): IPermisosPolicy;
}