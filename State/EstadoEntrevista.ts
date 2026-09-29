import { IEtapaAbstractFactory } from "../factory/Interface/IEtapaAbstractFactory.js";
import { IEtapaState } from "./Interface/IEtapaState.js";


export class EstadoEntrevista implements IEtapaState
{
    private fabrica: IEtapaAbstractFactory;

    constructor(fabrica: IEtapaAbstractFactory){
        this.fabrica = fabrica;
    }
    nombre(): string
    {
        return "ENTREVISTA";
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
        return this.fabrica.pruebaTecnica();
    }
    rechazar(): IEtapaState
    {
        return this.fabrica.rechazado();
    }
    encargado(): string
    {
        return "Reclutador";
    }
}