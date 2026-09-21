import { EmpleadoModel } from "../model/EmpleadoModel";
import { IRolStrategy } from "../Strategy/Interface/IRolStrategy";
import { IEtapaState } from "../State/Interface/IEtapaState";
import { EventManager } from "../observer/EventManager";
import { FichaContratacionModel } from "../model/FichaContratacionModel";
import { IPermisosPolicy } from "./IPermisosPolicy";

export class FichaContratacionPolicy implements IPermisosPolicy {
    private readonly actor: EmpleadoModel;
    private readonly rol: IRolStrategy;
    private etapa: IEtapaState;
    private readonly eventManager: EventManager;

    public constructor(actor: EmpleadoModel, etapa: IEtapaState, eventManager: EventManager) {
        this.actor = actor;
        this.rol = actor.getRol();
        this.etapa = etapa;
        this.eventManager = eventManager;
    }

    public puedeLeer(campo: string): boolean {
        return this.rol.lectura().has(campo) && this.etapa.permisosLectura().has(campo);
    }

    public puedeEscribir(campo: string): boolean {
        return this.rol.escritura().has(campo) && this.etapa.permisosEscritura().has(campo);
    }

    public avanzarEtapa(ficha: FichaContratacionModel): void {
        this.cambiarEtapa(ficha, ficha.getEtapa().avanzar(), "ETAPA_AVANZADA");
    }

    public rechazarEtapa(ficha: FichaContratacionModel): void {
        this.cambiarEtapa(ficha, ficha.getEtapa().avanzar(), "CANDIDATO_RECHAZADO");
    }

    public cambiarEtapa(ficha: FichaContratacionModel, nueva: IEtapaState, evento: string): void {
        if (!this.puedeEscribir("Etapa")) {
            throw new Error("No se puede modificar la etapa desde '" + this.etapa.nombre() + "' con este rol.");
        }

        const anterior: IEtapaState = this.etapa;
        ficha.setEtapa(nueva);
        this.etapa = nueva;
        this.eventManager.notifyEvent(evento, ficha, this.actor, anterior);
    }
}