export interface IPermisosPolicy {
    puedeLeer(campo: string): boolean;
    puedeEscribir(campo: string): boolean;
}