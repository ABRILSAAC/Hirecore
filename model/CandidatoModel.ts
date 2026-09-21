export class CandidatoModel {
    private readonly nombre: string;
    private readonly apellidos: string;
    private readonly email: string;
    private readonly fechaNacimiento: Date;
    private readonly profesion: string;

    public constructor(nombre: string, apellidos: string, email: string, fechaNacimiento: Date, profesion: string) {
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.email = email;
        this.fechaNacimiento = fechaNacimiento;
        this.profesion = profesion;
    }

    public getNombreCompleto(): string {
        return this.nombre + " " + this.apellidos;
    }   

    public getEmail(): string {
        return this.email;
    }

    public getFechaNacimiento(): Date {
        return this.fechaNacimiento;
    }

    public getProfesion(): string {
        return this.profesion;
    }
}