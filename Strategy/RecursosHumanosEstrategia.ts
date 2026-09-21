import { IRolStrategy } from "./Interface/IRolStrategy";

export class RecursosHumanosEstrategia implements IRolStrategy
{
        lectura(): Set<string>
    {
        const campos = new Set<string>(
            [
            "Nombre",
            "Apellidos",
            "Email",
            "FechaNacimiento",
            "Profesion",
            "Etapa",
            "Cargo",
            "Candidato",
            "Reclutador"
            ]);

        return campos;
    }
    escritura(): Set<string>
    {
        const campos = new Set<string>(
            [
            "Nombre",
            "Apellidos",
            "Email",
            "FechaNacimiento",
            "Profesion",
            "Etapa",
            "Cargo",
            "Candidato",
            "Reclutador"
            ]);

        return campos;
    }
}