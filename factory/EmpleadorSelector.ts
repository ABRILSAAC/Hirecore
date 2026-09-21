import { EmpleadoModel } from "../model/EmpleadoModel";

export class EmpleadorSelector {
    private empleados: Map<String, EmpleadoModel> = new Map<String, EmpleadoModel>();

    public registrar(id: String, empleado: EmpleadoModel): void {
        this.empleados.set(id, empleado);
    }

    public obtenerPorId(id: String): EmpleadoModel | undefined {
        return this.empleados.get(id);
    }

    public ids(): Set<String> {
        return new Set(this.empleados.keys());
    }
}