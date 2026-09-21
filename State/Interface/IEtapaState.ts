export interface IEtapaState
{
    nombre(): string
    permisosLectura(): Set<string>
    permisosEscritura(): Set<string>
    avanzar(): IEtapaState
    rechazar(): IEtapaState

}