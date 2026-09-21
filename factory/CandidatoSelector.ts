import { CandidatoModel } from "../model/CandidatoModel";

export class CandidatoSelector {
    private readonly candidatos: Map<string, CandidatoModel> = new Map<string, CandidatoModel>();

    public registrar(id: string, candidato: CandidatoModel): void {
        this.candidatos.set(id, candidato);
    }

    public esCandidato(id: string): boolean {
        return this.candidatos.has(id);
    }

    public obtenerPorId(id: string): CandidatoModel | undefined {
        return this.candidatos.get(id);
    }

    public ids(): Set<string> {
        return new Set(this.candidatos.keys());
    }
}