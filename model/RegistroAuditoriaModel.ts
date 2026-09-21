export class RegistroAuditoriaModel {
    public constructor(
        public readonly momento: Date,
        public readonly usuario: string,
        public readonly ficha: string,
        public readonly evento: string,
        public readonly etapaAnterior: string,
        public readonly etapaNueva: string
    ) {}

    public toString(): string {
        return `${this.momento.toISOString()} | ${this.usuario} | ${this.ficha} | ${this.evento}`
            + ` | ${this.etapaAnterior} -> ${this.etapaNueva}`;
    }
}