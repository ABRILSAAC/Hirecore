import { EstadoAplicado } from "../State/EstadoAplicado";
import { EstadoContratado } from "../State/EstadoContratado";
import { EstadoEntrevista } from "../State/EstadoEntrevista";
import { EstadoOferta } from "../State/EstadoOferta";
import { EstadoPruebaTecnica } from "../State/EstadoPruebaTecnica";
import { EstadoRechazado } from "../State/EstadoRechazado";
import { EstadoValidacionRefencias } from "../State/EstadoValidacionRefencias";
import { IEtapaState } from "../State/Interface/IEtapaState";
import { IEtapaAbstractFactory } from "./Interface/IEtapaAbstractFactory";

export class EtapaFactoryConcreta implements IEtapaAbstractFactory
{
    aplicado(): IEtapaState
    {
        return new EstadoAplicado(this);
    }
    entrevista(): IEtapaState
    {
        return new EstadoEntrevista(this);

    }
    pruebaTecnica(): IEtapaState
    {
        return new EstadoPruebaTecnica(this);

    }
    validacionReferencias(): IEtapaState
    {
        return new EstadoValidacionRefencias(this);
    }
    oferta(): IEtapaState
    {
        return new EstadoOferta(this);

    }
    contratado(): IEtapaState
    {
        return new EstadoContratado(this);

    }
    rechazado(): IEtapaState
    {
        return new EstadoRechazado(this);

    }
}