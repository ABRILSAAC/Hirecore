import { IEtapaState } from "../state/IEtapaState";
import { CandidatoModel } from "./CandidatoModel";
import { EmpleadoModel } from "./EmpleadoModel";
import { HistorialCambiosModel } from "./HistorialCambiosModel";

export class FichaContratacionModel {
    private etapa: IEtapaState;
    private candidato: CandidatoModel;
    private empleado: EmpleadoModel;
    private cargo: String;
    private historial: HistorialCambiosModel;

    public constructor(etapa: IEtapaState, candidato: CandidatoModel, empleado: EmpleadoModel, cargo: String) {
        this.etapa = etapa;
        this.candidato = candidato;
        this.empleado = empleado;
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
        return this.empleado;
    }
    public getCargo(): String {
        return this.cargo;
    }

    public getHistorial(): HistorialCambiosModel {
        return this.historial;
    }
}