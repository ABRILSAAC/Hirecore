export class CandidatoModel {
    private nombre: String;
    private apellidos: String;
    private email: String;
    private fechaNacimiento: Date;
    private profesion: String;

    public constructor(nombre: String, apellidos: String, email: String, fechaNacimiento: Date, profesion: String) {
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.email = email;
        this.fechaNacimiento = fechaNacimiento;
        this.profesion = profesion;
    }

    public getNombreCompleto(): String {
        return this.nombre + " " + this.apellidos;
    }   

    public getEmail(): String {
        return this.email;
    }

    public getFechaNacimiento(): Date {
        return this.fechaNacimiento;
    }

    public getProfesion(): String {
        return this.profesion;
    }
}