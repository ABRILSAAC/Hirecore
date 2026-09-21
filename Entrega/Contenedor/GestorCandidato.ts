import { EstadoCandidato, TipoEstado } from "../Interfaz/EstadoCandidato";


export class GestorCandidato
{
    private nombreCandidato: string;
    private estadoActual: EstadoCandidato;
   

    constructor(nombre:string, estadoInicial: EstadoCandidato,)
    {
        this.nombreCandidato = nombre
        this.estadoActual = estadoInicial;

    }

    public CambiarEstado(nuevoEstado: EstadoCandidato):void
    {
        this.estadoActual = nuevoEstado;
    }

    public Avanzar():void
    {
        this.estadoActual.AvanzarEstado(this);
    }
    public Rechazar():void
    {
        this.estadoActual.RechazarEstado(this);
    }
    public Obtener():TipoEstado
    {
        return this.estadoActual.ObtenerEstado();
    }

}