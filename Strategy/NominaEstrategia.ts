import { IRolStrategy } from "./Interface/IRolStrategy";

export class NominaEstrategia implements IRolStrategy
{
lectura(): Set<string>
    {
        const campos = new Set<string>(
            [
            "Nombre",
            "Apellidos",
            "Cargo",
            ]);

        return campos;
    }
    escritura(): Set<string>
    {
        return new Set<string>();
    }
}