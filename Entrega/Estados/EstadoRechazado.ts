import { GestorCandidato } from "../Contenedor/GestorCandidato";
import { EstadoCandidato, TipoEstado } from "../Interfaz/EstadoCandidato";



export class EstadoRechazado implements EstadoCandidato
{
    ObtenerEstado(): TipoEstado
    {
        return "RECHAZADO";
    }
    AvanzarEstado(contenedor: GestorCandidato): void
    {
        throw Error("El candidato fue rechazado, no se avanza");
    }
    RechazarEstado(contenedor: GestorCandidato): void
    {
        throw Error("Ya esta rechazado");
    } 
}