import { IRolStrategy } from "../strategy/IRolStrategy";

export class EmpleadoModel {
    private nombre: String;
    private apellidos: String;
    private email: String;
    private cargo: String;
    private rol: IRolStrategy

    public constructor(nombre: String, apellidos: String, email: String, cargo: String, rol: IRolStrategy) {
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.email = email;
        this.cargo = cargo;
        this.rol = rol;
    }

    public getNombreCompleto(): String {
        return this.nombre + " " + this.apellidos;
    }

    public getEmail(): String {
        return this.email;
    }

    public getCargo(): String {
        return this.cargo;
    }

    public getRol(): IRolStrategy {
        return this.rol;
    }
}