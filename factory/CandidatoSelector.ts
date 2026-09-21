import { CandidatoModel } from "../model/CandidatoModel";

export class CandidatoSelector {
    private candidatos: Map<String, CandidatoModel> = new Map<String, CandidatoModel>();

    public registrar(id: String, candidato: CandidatoModel): void {
        this.candidatos.set(id, candidato);
    }

    public esCandidato(id: String): boolean {
        return this.candidatos.has(id);
    }

    public obtenerPorId(id: String): CandidatoModel | undefined {
        return this.candidatos.get(id);
    }

    public ids(): Set<String> {
        return new Set(this.candidatos.keys());
    }
}