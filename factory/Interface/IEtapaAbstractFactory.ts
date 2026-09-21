import { IEtapaState } from "../../State/Interface/IEtapaState";

export interface IEtapaAbstractFactory
{
    aplicado(): IEtapaState
    entrevista(): IEtapaState
    pruebaTecnica(): IEtapaState
    validacionReferencias(): IEtapaState
    oferta(): IEtapaState
    contratado(): IEtapaState
    rechazado(): IEtapaState
}