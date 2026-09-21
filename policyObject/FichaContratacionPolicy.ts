import { EmpleadoModel } from "../model/EmpleadoModel";
import { IRolStrategy } from "../strategy/IRolStrategy";
import { IEtapaState } from "../state/IEtapaState";
import { EventManager } from "../observer/EventManager";
import { FichaContratacionModel } from "../model/FichaContratacionModel";

export class FichaContratacionPolicy implements IPermisosPolicy {
    private actor: EmpleadoModel;
    private rol: IRolStrategy;
    private etapa: IEtapaState;
    private eventManager: EventManager;

    public constructor(actor: EmpleadoModel, etapa: IEtapaState, eventManager: EventManager) {
        this.actor = actor;
        this.rol = actor.getRol();
        this.etapa = etapa;
        this.eventManager = eventManager;
    }

    public puedeLeer(campo: string): boolean {
        return this.rol.lectura().has(campo) && this.etapa.permisosLectura.get(campo);
    }

    public puedeEscribir(campo: string): boolean {
        return this.rol.escritura().has(campo) && this.etapa.permisosEscritura.get(campo);
    }

    public avanzarEtapa(ficha: FichaContratacionModel): void {
        this.cambiarEtapa(ficha, ficha.getEtapa().avanzar(), "ETAPA_AVANZADA");
    }

    public rechazarEtapa(ficha: FichaContratacionModel): void {
        this.cambiarEtapa(ficha, ficha.getEtapa().avanzar(), "CANDIDATO_RECHAZADO");
    }

    public cambiarEtapa(ficha: FichaContratacionModel, nueva: IEtapaState, evento: String): void {
        if (!this.puedeEscribir("Etapa")) {
            throw new Error("No se puede modificar la etapa desde '" + this.etapa.nombre() + "' con este rol.");
        }

        const anterior: IEtapaState = this.etapa;
        ficha.setEtapa(nueva);
        this.etapa = nueva;
        this.eventManager.notifyEvent(evento, ficha, this.actor, anterior);
    }
}