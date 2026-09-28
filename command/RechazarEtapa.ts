// Las rutas de importación son aproximadas según la estructura original de los paquetes
import { FichaContratacionModel } from '../model/FichaContratacionModel';
import { FichaContratacionPolicy } from '../policyObject/FichaContratacionPolicy';
import { IEtapaState } from '../state/IEtapaState';
import { ITransicionCommand } from './ITransicionCommand';

export class RechazarEtapaCommand implements ITransicionCommand {
    private etapaAnterior: IEtapaState | null = null;

    constructor(
        private readonly fichaContratacionPolicy: FichaContratacionPolicy,
        private readonly ficha: FichaContratacionModel
    ) {}

    public ejecutar(): void {
        this.etapaAnterior = this.ficha.getEtapa();
        this.fichaContratacionPolicy.rechazarCandidato(this.ficha);
    }

    public deshacer(): void {
        if (this.etapaAnterior !== null) {
            this.ficha.setEtapa(this.etapaAnterior);
        }
    }
}