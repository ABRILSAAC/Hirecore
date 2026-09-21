import { GestorCandidato } from "../Contenedor/GestorCandidato";
import { EstadoCandidato, TipoEstado } from "../Interfaz/EstadoCandidato";
import { EstadoContratado } from "./EstadoContratado";
import { EstadoRechazado } from "./EstadoRechazado";


export class EstadoOferta implements EstadoCandidato
{
    ObtenerEstado(): TipoEstado
    {
        return "OFERTA";
    }
    AvanzarEstado(contenedor: GestorCandidato): void
    {
        contenedor.CambiarEstado(new EstadoContratado());
    }
    RechazarEstado(contenedor: GestorCandidato): void
    {
        contenedor.CambiarEstado(new EstadoRechazado());
    }
}