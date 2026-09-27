import { EmpleadorSelector } from "../factory/EmpleadorSelector.js";
import { CandidatoSelector } from "../factory/CandidatoSelector.js";
import { EtapaFactoryConcreta } from "../factory/EtapaFactoryConcreta.js";
import { FichaContratacionController } from "../command/FichaContratacionController.js";
import { IFichaContratacionPolicyFactory } from "../factory/IFichaContratacionPolicyFactory.js";
import { FichaContratacionPolicyFactory } from "../factory/FichaContratacionPolicyFactory.js";
import { CandidatoModel } from "../model/CandidatoModel.js";
import { EmpleadoModel } from "../model/EmpleadoModel.js";
import { FichaContratacionModel } from "../model/FichaContratacionModel.js";
import { EmailNotificationListener } from "../observer/EmailNotificationListener.js";
import { EventManager } from "../observer/EventManager.js";
import { IPermisosPolicy } from "../policyObject/IPermisosPolicy.js";
import { RegistroAuditoriaModel } from "../model/RegistroAuditoriaModel.js";
import { AuditoriaListener } from "../observer/AuditoriaListener.js";
import { FichaContratacionPolicy } from "../policyObject/FichaContratacionPolicy.js";
import { MenuConsola } from "./MenuConsola.js";

export class Consumer {
    private readonly empleados: EmpleadorSelector = new EmpleadorSelector();
    private readonly candidatos: CandidatoSelector = new CandidatoSelector();
    private readonly fabricaEtapas: EtapaFactoryConcreta = new EtapaFactoryConcreta();
    private readonly fichas: FichaContratacionModel[] = [];
    private readonly controller: FichaContratacionController;
    private readonly policyFactory: IFichaContratacionPolicyFactory;
    private readonly auditoria: AuditoriaListener = new AuditoriaListener();
    private readonly eventos: EventManager;

    public constructor() {
        this.eventos = new EventManager();
        this.eventos.subscribe("ETAPA_AVANZADA", new EmailNotificationListener("rrhh@hirecore.com"));
        this.eventos.subscribe("CANDIDATO_RECHAZADO", new EmailNotificationListener("rrhh@hirecore.com"));
        this.eventos.subscribe("ETAPA_AVANZADA", this.auditoria);
        this.eventos.subscribe("CANDIDATO_RECHAZADO", this.auditoria);
        this.eventos.subscribe("CAMBIO_DESHECHO", this.auditoria);

        this.controller = new FichaContratacionController(this.eventos);
        this.policyFactory = new FichaContratacionPolicyFactory(this.empleados, this.candidatos, this.eventos);
    }

    // Puntos de entrada de los datos externos al software
    public registrarEmpleado(id: string, empleado: EmpleadoModel): void {
        this.empleados.registrar(id, empleado);
    }

    public registrarCandidato(id: string, candidato: CandidatoModel): void {
        this.candidatos.registrar(id, candidato);
    }

    public iniciar(): void {
        new MenuConsola(this).iniciar();
    }

    // Consultas
    public buscarEmpleado(id: string): EmpleadoModel | undefined {
        return this.empleados.obtenerPorId(id);
    }

    public idsEmpleados(): Set<string> {
        return this.empleados.ids();
    }

    public idsCandidatos(): Set<string> {
        return this.candidatos.ids();
    }

    public getFichas(): readonly FichaContratacionModel[] {
        return [...this.fichas];
    }

    public consultarPolitica(ficha: FichaContratacionModel, idUsuario: string): IPermisosPolicy;
    // Para cuando ya tengo el EmpleadoModel identificado en el menú y no quiero volver a buscarlo por id
    public consultarPolitica(ficha: FichaContratacionModel, empleado: EmpleadoModel): IPermisosPolicy;
    public consultarPolitica(ficha: FichaContratacionModel, usuario: string | EmpleadoModel): IPermisosPolicy {
        if (typeof usuario === "string") {
            return this.policyFactory.crearPolitica(ficha, usuario);
        }
        return new FichaContratacionPolicy(usuario, ficha.getEtapa(), this.eventos);
    }

    // Operaciones sobre fichas
    public crearFicha(idCandidato: string, empleado: EmpleadoModel, cargo: string): FichaContratacionModel {
        const candidato = this.candidatos.obtenerPorId(idCandidato);
        if (candidato === undefined) {
            throw new Error("Candidato no registrado: " + idCandidato);
        }
        const ficha = new FichaContratacionModel(this.fabricaEtapas.aplicado(), candidato, empleado, cargo);
        this.fichas.push(ficha);
        return ficha;
    }

    public avanzarEtapa(empleado: EmpleadoModel, ficha: FichaContratacionModel): void {
        this.controller.avanzarEtapa(empleado, ficha);
    }

    public rechazarEtapa(empleado: EmpleadoModel, ficha: FichaContratacionModel): void {
        this.controller.rechazarEtapa(empleado, ficha);
    }

    public deshacer(empleado: EmpleadoModel, ficha: FichaContratacionModel): boolean {
        return this.controller.deshacer(empleado, ficha);
    }

    public getAuditoria(): readonly RegistroAuditoriaModel[] {
        return this.auditoria.getRegistros();
    }
}
