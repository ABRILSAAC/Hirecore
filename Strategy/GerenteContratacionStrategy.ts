import { IRolStrategy } from "./Interface/IRolStrategy";

export class GerenteContratacionStrategy implements IRolStrategy
{
    lectura(): Set<string>
    {
        const campos = new Set<string>(
            [
            "Nombre",
            "Apellidos",
            "Email",
            "Profesion",
            "Etapa",
            "Cargo",
            ]);

        return campos;
    }
    escritura(): Set<string>
    {
        const campos = new Set<string>(
            [
            "Etapa",
            "Cargo",
            ]);

        return campos;
    }
}