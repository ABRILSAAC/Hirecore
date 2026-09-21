import { IRolStrategy } from "../Strategy/Interface/IRolStrategy";

export class EmpleadoModel {
    private readonly nombre: string;
    private readonly apellidos: string;
    private readonly email: string;
    private readonly cargo: string;
    private readonly rol: IRolStrategy

    public constructor(nombre: string, apellidos: string, email: string, cargo: string, rol: IRolStrategy) {
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.email = email;
        this.cargo = cargo;
        this.rol = rol;
    }

    public getNombreCompleto(): string {
        return this.nombre + " " + this.apellidos;
    }

    public getEmail(): string {
        return this.email;
    }

    public getCargo(): string {
        return this.cargo;
    }

    public getRol(): IRolStrategy {
        return this.rol;
    }
}