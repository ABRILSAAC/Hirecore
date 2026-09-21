import { GestorCandidato } from "../Contenedor/GestorCandidato";
import { EstadoCandidato, TipoEstado } from "../Interfaz/EstadoCandidato";
import { EstadoOferta } from "./EstadoOferta";
import { EstadoRechazado } from "./EstadoRechazado";

export class EstadoEntrevista implements EstadoCandidato
{
    ObtenerEstado(): TipoEstado
    {
        return  "ENTREVISTA";
    }
    AvanzarEstado(contenedor: GestorCandidato): void
    {
        contenedor.CambiarEstado(new EstadoOferta());
    }
    RechazarEstado(contenedor: GestorCandidato): void
    {
        contenedor.CambiarEstado(new EstadoRechazado());
    }
}