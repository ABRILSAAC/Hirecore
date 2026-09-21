import { IEtapaAbstractFactory } from "../factory/Interface/IEtapaAbstractFactory";
import { IEtapaState } from "./Interface/IEtapaState";

export class EstadoPruebaTecnica implements IEtapaState
{
    private fabrica: IEtapaAbstractFactory;

    constructor(fabrica: IEtapaAbstractFactory){
        this.fabrica = fabrica;
    }
    nombre(): string
    {
        return "PRUEBA TECNICA";
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
        return this.fabrica.validacionReferencias();
    }
    rechazar(): IEtapaState
    {
        return this.fabrica.rechazado();
    }
}