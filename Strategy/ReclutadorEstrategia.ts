import { IRolStrategy } from "./Interface/IRolStrategy";

export class ReclutadorEstrategia implements IRolStrategy
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