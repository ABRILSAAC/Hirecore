import { GestorCandidato } from "../Contenedor/GestorCandidato";

export type TipoEstado = "APLICADO" | "ENTREVISTA" | "OFERTA" | "CONTRATADO" | "RECHAZADO";

export interface EstadoCandidato
{
    ObtenerEstado(): TipoEstado;
    AvanzarEstado(contenedor: GestorCandidato): void;
    RechazarEstado(contenedor: GestorCandidato): void;
}

