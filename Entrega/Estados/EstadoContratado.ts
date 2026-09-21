import { GestorCandidato } from "../Contenedor/GestorCandidato";
import { EstadoCandidato, TipoEstado } from "../Interfaz/EstadoCandidato";

export class EstadoContratado implements EstadoCandidato
{
    ObtenerEstado(): TipoEstado
    {
        return "CONTRATADO";
    }
    AvanzarEstado(contenedor: GestorCandidato): void
    {
        throw Error("El candidato ya fue contratado");
    }
    RechazarEstado(contenedor: GestorCandidato): void
    {
        throw Error("Ya fue contratado el candidato, no se puede rechazar");

    }
}