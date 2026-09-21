export interface IRolStrategy
{
    lectura(): Set<string>
    escritura(): Set<string>
}