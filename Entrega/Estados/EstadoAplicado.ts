import { GestorCandidato } from "../Contenedor/GestorCandidato";
import { EstadoCandidato, TipoEstado } from "../Interfaz/EstadoCandidato";
import { EstadoEntrevista } from "./EstadoEntrevista";
import { EstadoRechazado } from "./EstadoRechazado";

export class EstadoAplicado implements EstadoCandidato
{
        ObtenerEstado(): TipoEstado
        {
            return  "APLICADO";
        }
        AvanzarEstado(contenedor: GestorCandidato): void
        {
            contenedor.CambiarEstado(new EstadoEntrevista());
            
        }
        RechazarEstado(contenedor: GestorCandidato): void
        {
            contenedor.CambiarEstado(new EstadoRechazado());
        }
}