import { IEtapaAbstractFactory } from "../factory/Interface/IEtapaAbstractFactory.js";
import { IEtapaState } from "./Interface/IEtapaState.js";

export class EstadoValidacionReferencias implements IEtapaState
{
    private fabrica: IEtapaAbstractFactory;

    constructor(fabrica: IEtapaAbstractFactory){
        this.fabrica = fabrica;
    }
    nombre(): string
    {
        return "VALIDACION REFERENCIAS";
    }
    permisosLectura(): Set<string>
    {
        return new Set(["Nombre", "Apellidos", "Email", "FechaNacimiento", "Profesion", "Etapa", "Cargo", "Candidato", "Reclutador"]);
    }
    permisosEscritura(): Set<string>
    {
        return new Set(["Nombre", "Apellidos", "Email", "FechaNacimiento", "Profesion", "Etapa", "Cargo", "Candidato", "Reclutador"]);
    }
    avanzar(): IEtapaState
    {
        return this.fabrica.oferta();
    }
    rechazar(): IEtapaState
    {
        return this.fabrica.rechazado();
    }
    encargado(): string
    {
        return "Recursos Humanos";
    }
}