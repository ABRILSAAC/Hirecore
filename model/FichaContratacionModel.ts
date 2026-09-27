import { IEtapaState } from "../State/Interface/IEtapaState.js";
import { CandidatoModel } from "./CandidatoModel.js";
import { EmpleadoModel } from "./EmpleadoModel.js";
import { HistorialCambiosModel } from "./HistorialCambiosModel.js";

export class FichaContratacionModel {
    private etapa: IEtapaState;
    private readonly candidato: CandidatoModel;
    private readonly reclutador: EmpleadoModel;
    private readonly cargo: string;
    private readonly historial: HistorialCambiosModel = new HistorialCambiosModel;

public constructor(etapa: IEtapaState, candidato: CandidatoModel, reclutador: EmpleadoModel, cargo: string) {
        this.etapa = etapa;
        this.candidato = candidato;
        this.reclutador = reclutador;
        this.cargo = cargo;
    }

    public getEtapa(): IEtapaState {
        return this.etapa;
    }

    public setEtapa(etapa: IEtapaState): void {
        this.etapa = etapa;
    }

    public getCandidato(): CandidatoModel {
        return this.candidato;
    }

    public getReclutador(): EmpleadoModel {
        return this.reclutador;
    }
    public getCargo(): string {
        return this.cargo;
    }

    public getHistorial(): HistorialCambiosModel {
        return this.historial;
    }
}