import { IRolStrategy } from "./Interface/IRolStrategy.js";

export class NominaEstrategia implements IRolStrategy
{
lectura(): Set<string>
    {
        const campos = new Set<string>(
            [
            "Nombre",
            "Apellidos",
            "Cargo",
            "Etapa"
            ]);

        return campos;
    }
    escritura(): Set<string>
    {
        return new Set<string>();
    }
}