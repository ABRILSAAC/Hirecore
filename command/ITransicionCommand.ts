export interface ITransicionCommand {
    ejecutar(): void;
    deshacer(): void;
}