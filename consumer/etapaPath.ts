import { crear } from "./dom.js";

/** Orden real del flujo: coincide con el encadenado avanzar() de las clases State/Estado*.ts. */
const ETAPAS_ORDEN = ["APLICADO", "ENTREVISTA", "PRUEBA TECNICA", "VALIDACION REFERENCIAS", "OFERTA", "CONTRATADO"] as const;

/**
 * Dibuja el flujo de etapas como una línea de pasos: en verde los ya superados,
 * resaltado el actual, y en gris los que faltan. "RECHAZADO" es un desenlace
 * aparte (se puede llegar desde cualquier etapa), así que se muestra por fuera del path.
 */
function crearPaso(etapa: string, estado: string): HTMLElement {
    const item = crear("li", { clase: "etapa-paso" });
    item.append(crear("span", { texto: etapa, clase: "etapa-pill " + estado }));
    return item;
}

export function crearPathEtapas(etapaActual: string): HTMLElement {
    const contenedor = crear("ol", { clase: "etapa-path" });

    if (etapaActual === "RECHAZADO") {
        for (const etapa of ETAPAS_ORDEN) {
            contenedor.append(crearPaso(etapa, "etapa-descartada"));
        }
        contenedor.append(crearPaso("RECHAZADO", "etapa-rechazada"));
        return contenedor;
    }

    const indiceActual = ETAPAS_ORDEN.indexOf(etapaActual as (typeof ETAPAS_ORDEN)[number]);
    ETAPAS_ORDEN.forEach((etapa, indice) => {
        const estado = indice < indiceActual ? "etapa-hecha"
            : indice === indiceActual ? "etapa-actual"
            : "etapa-pendiente";
        contenedor.append(crearPaso(etapa, estado));
    });

    return contenedor;
}
