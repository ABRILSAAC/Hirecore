import { ITransicionCommand } from "../command/ITransicionCommand.js";

export class HistorialCambiosModel {
    private pila: ITransicionCommand[] = [];

    public ejecutar(command: ITransicionCommand): void {
        command.ejecutar();
        this.pila.push(command);
    }

    public deshacerUltimo(): boolean {
        const command = this.pila.pop();
        if (command === undefined) {
            return false;
        }

        command.deshacer();
        return true;
    }
}