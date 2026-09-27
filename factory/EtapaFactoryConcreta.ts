import { EstadoAplicado } from "../State/EstadoAplicado.js";
import { EstadoContratado } from "../State/EstadoContratado.js";
import { EstadoEntrevista } from "../State/EstadoEntrevista.js";
import { EstadoOferta } from "../State/EstadoOferta.js";
import { EstadoPruebaTecnica } from "../State/EstadoPruebaTecnica.js";
import { EstadoRechazado } from "../State/EstadoRechazado.js";
import { EstadoValidacionReferencias } from "../State/EstadoValidacionReferencias.js";
import { IEtapaState } from "../State/Interface/IEtapaState.js";
import { IEtapaAbstractFactory } from "./Interface/IEtapaAbstractFactory.js";

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
        return new EstadoValidacionReferencias(this);
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