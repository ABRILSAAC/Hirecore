import { IEtapaAbstractFactory } from "../factory/Interface/IEtapaAbstractFactory";
import { IEtapaState } from "./Interface/IEtapaState";

export class EstadoContratado implements IEtapaState
{
       private fabrica: IEtapaAbstractFactory;
   
       constructor(fabrica: IEtapaAbstractFactory){
           this.fabrica = fabrica;
       }
       nombre(): string
       {
           return "CONTRATADO";
       }
       permisosLectura(): Set<string>
       {
           return new Set(["Nombre", "Apellidos", "Email", "FechaNacimiento", "Profesion", "Etapa", "Cargo", "Candidato", "Reclutador"]);
       }
       permisosEscritura(): Set<string>
       {
           return new Set();
       }
       avanzar(): IEtapaState
       {
           return this.fabrica.contratado();
       }
       rechazar(): IEtapaState
       {
           return this.fabrica.rechazado();
       }
}