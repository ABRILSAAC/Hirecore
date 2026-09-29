import { Consumer } from "./Consumer.js";
import { crear, agregarOpciones } from "./dom.js";
import { crearPathEtapas } from "./etapaPath.js";
import { EmpleadoModel } from "../model/EmpleadoModel.js";
import { CandidatoModel } from "../model/CandidatoModel.js";
import { FichaContratacionModel } from "../model/FichaContratacionModel.js";
import { IPermisosPolicy } from "../policyObject/IPermisosPolicy.js";

const CAMPOS = ["Nombre", "Apellidos", "Email", "FechaNacimiento", "Profesion", "Etapa", "Cargo", "Candidato", "Reclutador"] as const;

/** Quién está identificado ahora mismo: un empleado (con permisos según su rol) o un candidato (solo lectura de su propia ficha). */
type Sesion =
    | { tipo: "empleado"; id: string; modelo: EmpleadoModel }
    | { tipo: "candidato"; id: string; modelo: CandidatoModel };

/**
 * Interfaz web del menú: cumple las mismas funciones que la versión de consola
 * (identificarse, crear/listar fichas, avanzar/rechazar etapa, deshacer, consultar
 * permisos, ver auditoría), pero con botones y formularios en vez de prompt()/console.log.
 */
export class MenuConsola {
    private readonly consumer: Consumer;
    private sesion: Sesion | undefined;

    private readonly encabezado: HTMLElement;
    private readonly menu: HTMLElement;
    private readonly panel: HTMLElement;
    private readonly listado: HTMLElement;
    private readonly registro: HTMLElement;

    public constructor(consumer: Consumer) {
        this.consumer = consumer;

        const raiz = document.getElementById("app");
        if (raiz === null) {
            throw new Error("No se encontró el elemento #app en index.html");
        }
        raiz.innerHTML = "";

        this.encabezado = crear("p", { clase: "encabezado" });
        this.menu = crear("nav", { clase: "menu" });
        this.panel = crear("section", { clase: "panel" });
        this.listado = crear("section", { clase: "listado" });
        this.registro = crear("pre", { clase: "registro" });
        raiz.append(crear("h1", { texto: "HireCore" }), this.encabezado, this.menu, this.panel, this.listado, this.registro);

        this.consumer.alNotificar((mensaje) => this.log(mensaje));
    }

    public iniciar(): void {
        this.mostrarLogin();
    }

    private log(mensaje: string): void {
        this.registro.textContent += mensaje + "\n";
        this.registro.scrollTop = this.registro.scrollHeight;
    }

    private ejecutar(accion: () => void): void {
        try {
            accion();
        } catch (e) {
            this.log("Error: " + (e instanceof Error ? e.message : String(e)));
        }
        this.actualizarListado();
    }

    private sesionActual(): Sesion {
        if (this.sesion === undefined) {
            throw new Error("No hay un usuario identificado");
        }
        return this.sesion;
    }

    private empleadoActual(): EmpleadoModel {
        const sesion = this.sesionActual();
        if (sesion.tipo !== "empleado") {
            throw new Error("Esta acción solo la puede hacer un empleado");
        }
        return sesion.modelo;
    }

    private mostrarLogin(): void {
        this.sesion = undefined;
        this.encabezado.textContent = "";
        this.menu.innerHTML = "";
        this.listado.innerHTML = "";
        this.panel.innerHTML = "";

        const selectEmpleado = crear("select");
        agregarOpciones(selectEmpleado, [...this.consumer.idsEmpleados()].map((id) => {
            const empleado = this.consumer.buscarEmpleado(id);
            const detalle = empleado !== undefined ? empleado.getNombreCompleto() + " (" + empleado.getCargo() + ")" : id;
            return { valor: id, texto: id + " - " + detalle };
        }));
        const botonEmpleado = crear("button", {
            texto: "Ingresar como empleado",
            onClick: () => {
                const empleado = this.consumer.buscarEmpleado(selectEmpleado.value);
                if (empleado === undefined) {
                    this.log("Empleado no encontrado");
                    return;
                }
                this.sesion = { tipo: "empleado", id: selectEmpleado.value, modelo: empleado };
                this.log("--- Sesión iniciada como " + empleado.getNombreCompleto() + " ---");
                this.mostrarMenuPrincipal();
            }
        });

        const selectCandidato = crear("select");
        agregarOpciones(selectCandidato, [...this.consumer.idsCandidatos()].map((id) => {
            const candidato = this.consumer.buscarCandidato(id);
            const detalle = candidato !== undefined ? candidato.getNombreCompleto() : id;
            return { valor: id, texto: id + " - " + detalle };
        }));
        const botonCandidato = crear("button", {
            texto: "Ingresar como candidato",
            onClick: () => {
                const candidato = this.consumer.buscarCandidato(selectCandidato.value);
                if (candidato === undefined) {
                    this.log("Candidato no encontrado");
                    return;
                }
                this.sesion = { tipo: "candidato", id: selectCandidato.value, modelo: candidato };
                this.log("--- Sesión iniciada como " + candidato.getNombreCompleto() + " (candidato) ---");
                this.mostrarMenuPrincipal();
            }
        });

        this.panel.append(
            crear("p", { texto: "Identifícate para continuar:" }),
            crear("label", { texto: "Empleado: " }), selectEmpleado, botonEmpleado,
            crear("label", { texto: "Candidato: " }), selectCandidato, botonCandidato
        );
    }

    private mostrarMenuPrincipal(): void {
        const sesion = this.sesionActual();
        this.encabezado.textContent = sesion.tipo === "empleado"
            ? "Usuario: " + sesion.modelo.getNombreCompleto() + " (" + sesion.modelo.getCargo() + ")"
            : "Candidato: " + sesion.modelo.getNombreCompleto();

        this.menu.innerHTML = "";
        const acciones: [string, () => void][] = sesion.tipo === "empleado"
            ? [
                ["Crear ficha", () => this.mostrarCrearFicha()],
                ["Avanzar etapa", () => this.mostrarSeleccionFicha("Avanzar etapa", "Avanzar", (ficha) => this.ejecutar(() => {
                    this.consumer.avanzarEtapa(this.empleadoActual(), ficha);
                    this.log("Nueva etapa: " + ficha.getEtapa().nombre());
                }))],
                ["Rechazar candidato", () => this.mostrarSeleccionFicha("Rechazar candidato", "Rechazar", (ficha) => this.ejecutar(() => {
                    this.consumer.rechazarEtapa(this.empleadoActual(), ficha);
                    this.log("Nueva etapa: " + ficha.getEtapa().nombre());
                }))],
                ["Deshacer último cambio", () => this.mostrarSeleccionFicha("Deshacer último cambio", "Deshacer", (ficha) => this.ejecutar(() => {
                    const deshecho = this.consumer.deshacer(this.empleadoActual(), ficha);
                    this.log(deshecho ? "Último cambio deshecho" : "No hay cambios que deshacer");
                }))],
                ["Consultar permiso", () => this.mostrarConsultarPermiso()],
                ["Ver auditoría", () => this.mostrarAuditoria()],
                ["Cambiar de usuario", () => this.mostrarLogin()]
            ]
            : [
                ["Cambiar de usuario", () => this.mostrarLogin()]
            ];
        for (const [texto, accion] of acciones) {
            this.menu.append(crear("button", { texto, onClick: accion }));
        }

        this.panel.innerHTML = "";
        this.actualizarListado();
    }

    private campo(politica: IPermisosPolicy, nombreCampo: string, valor: string): string {
        return politica.puedeLeer(nombreCampo) ? valor : "[oculto]";
    }

    private actualizarListado(): void {
        this.listado.innerHTML = "";
        if (this.sesion === undefined) {
            return;
        }
        const idSesion = this.sesion.id;

        this.listado.append(crear("h2", { texto: "Fichas" }));
        const fichas = this.consumer.getFichas();
        if (fichas.length === 0) {
            this.listado.append(crear("p", { texto: "No hay fichas" }));
            return;
        }

        const lista = crear("ul", { clase: "fichas" });
        for (const f of fichas) {
            const politica = this.consumer.consultarPolitica(f, idSesion);
            const camposVisibles = ["Nombre", "Cargo", "Reclutador", "Etapa"].some((c) => politica.puedeLeer(c));
            if (!camposVisibles) {
                // Sin permiso sobre ningún campo de esta ficha (p. ej. un candidato viendo la ficha de otro): ni se muestra.
                continue;
            }

            const texto = this.campo(politica, "Nombre", f.getCandidato().getNombreCompleto())
                + " | " + this.campo(politica, "Cargo", f.getCargo())
                + " | Reclutador: " + this.campo(politica, "Reclutador", f.getReclutador().getNombreCompleto());

            const item = crear("li");
            item.append(crear("p", { texto }));
            item.append(
                politica.puedeLeer("Etapa")
                    ? crearPathEtapas(f.getEtapa().nombre())
                    : crear("p", { texto: "Etapa: [oculto]" })
            );
            lista.append(item);
        }

        if (lista.childElementCount === 0) {
            this.listado.append(crear("p", { texto: "No tienes fichas visibles" }));
            return;
        }
        this.listado.append(lista);
    }

    private opcionesFichas(fichas: readonly FichaContratacionModel[]): { valor: string; texto: string }[] {
        return fichas.map((f, indice) => ({
            valor: String(indice),
            texto: (indice + 1) + ". " + f.getCandidato().getNombreCompleto() + " - " + f.getCargo() + " (" + f.getEtapa().nombre() + ")"
        }));
    }

    private mostrarSeleccionFicha(titulo: string, textoBoton: string, accion: (ficha: FichaContratacionModel) => void): void {
        this.panel.innerHTML = "";
        const fichas = this.consumer.getFichas();
        if (fichas.length === 0) {
            this.panel.append(crear("p", { texto: "No hay fichas creadas" }));
            return;
        }

        this.panel.append(crear("h3", { texto: titulo }));
        const select = crear("select");
        agregarOpciones(select, this.opcionesFichas(fichas));
        const boton = crear("button", { texto: textoBoton, onClick: () => accion(fichas[Number(select.value)]) });
        this.panel.append(select, boton);
    }

    private mostrarCrearFicha(): void {
        this.panel.innerHTML = "";
        this.panel.append(crear("h3", { texto: "Crear ficha" }));

        const idsCandidatos = [...this.consumer.idsCandidatos()].filter((id) => !this.consumer.tieneFicha(id));
        if (idsCandidatos.length === 0) {
            this.panel.append(crear("p", { texto: "No hay candidatos disponibles (todos ya tienen una ficha)" }));
            return;
        }

        const candidatos = crear("select");
        agregarOpciones(candidatos, idsCandidatos.map((id) => ({ valor: id, texto: id })));
        const cargo = crear("input", { atributos: { type: "text", placeholder: "Cargo" } });
        const boton = crear("button", {
            texto: "Crear",
            onClick: () => this.ejecutar(() => {
                this.consumer.crearFicha(candidatos.value, this.empleadoActual(), cargo.value);
                this.log("Ficha creada");
            })
        });

        this.panel.append(
            crear("label", { texto: "Candidato: " }), candidatos,
            crear("label", { texto: "Cargo: " }), cargo,
            boton
        );
    }

    private mostrarConsultarPermiso(): void {
        this.panel.innerHTML = "";
        const fichas = this.consumer.getFichas();
        if (fichas.length === 0) {
            this.panel.append(crear("p", { texto: "No hay fichas creadas" }));
            return;
        }
        this.panel.append(crear("h3", { texto: "Consultar permiso" }));

        const selectFicha = crear("select");
        agregarOpciones(selectFicha, this.opcionesFichas(fichas));

        const idsUsuarios = [...this.consumer.idsEmpleados(), ...this.consumer.idsCandidatos()];
        const selectUsuario = crear("select");
        agregarOpciones(selectUsuario, idsUsuarios.map((id) => ({ valor: id, texto: id })));

        const selectCampo = crear("select");
        agregarOpciones(selectCampo, CAMPOS.map((campo) => ({ valor: campo, texto: campo })));

        const boton = crear("button", {
            texto: "Consultar",
            onClick: () => this.ejecutar(() => {
                const ficha = fichas[Number(selectFicha.value)];
                const politica = this.consumer.consultarPolitica(ficha, selectUsuario.value);
                this.log("Puede leer: " + politica.puedeLeer(selectCampo.value) + " | Puede escribir: " + politica.puedeEscribir(selectCampo.value));
            })
        });

        this.panel.append(
            crear("label", { texto: "Ficha: " }), selectFicha,
            crear("label", { texto: "Usuario: " }), selectUsuario,
            crear("label", { texto: "Campo: " }), selectCampo,
            boton
        );
    }

    private mostrarAuditoria(): void {
        this.panel.innerHTML = "";
        this.panel.append(crear("h3", { texto: "Auditoría" }));

        const registros = this.consumer.getAuditoria();
        if (registros.length === 0) {
            this.panel.append(crear("p", { texto: "No hay cambios registrados" }));
            return;
        }

        const lista = crear("ul");
        for (const registro of registros) {
            lista.append(crear("li", { texto: registro.toString() }));
        }
        this.panel.append(lista);
    }
}
