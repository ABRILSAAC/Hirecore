import { EmpleadoModel } from "../model/EmpleadoModel";

export class EmpleadorSelector {
    private readonly empleados: Map<string, EmpleadoModel> = new Map<string, EmpleadoModel>();

    public registrar(id: string, empleado: EmpleadoModel): void {
        this.empleados.set(id, empleado);
    }

    public obtenerPorId(id: string): EmpleadoModel | undefined {
        return this.empleados.get(id);
    }

    public ids(): Set<string> {
        return new Set(this.empleados.keys());
    }
}