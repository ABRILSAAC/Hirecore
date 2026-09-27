/** Helpers mínimos para construir la interfaz sin repetir document.createElement en cada línea. */

export interface OpcionesElemento<K extends keyof HTMLElementTagNameMap> {
    texto?: string;
    clase?: string;
    onClick?: (evento: Event) => void;
    atributos?: Record<string, string>;
}

export function crear<K extends keyof HTMLElementTagNameMap>(
    etiqueta: K,
    opciones: OpcionesElemento<K> = {}
): HTMLElementTagNameMap[K] {
    const elemento = document.createElement(etiqueta);
    if (opciones.texto !== undefined) {
        elemento.textContent = opciones.texto;
    }
    if (opciones.clase !== undefined) {
        elemento.className = opciones.clase;
    }
    if (opciones.onClick !== undefined) {
        elemento.addEventListener("click", opciones.onClick);
    }
    if (opciones.atributos !== undefined) {
        for (const [nombre, valor] of Object.entries(opciones.atributos)) {
            elemento.setAttribute(nombre, valor);
        }
    }
    return elemento;
}

export function agregarOpciones(select: HTMLSelectElement, opciones: readonly { valor: string; texto: string }[]): void {
    for (const opcion of opciones) {
        select.append(crear("option", { texto: opcion.texto, atributos: { value: opcion.valor } }));
    }
}
