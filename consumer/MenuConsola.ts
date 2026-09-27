import { Consumer } from "./Consumer.js";
import { crear, agregarOpciones } from "./dom.js";
import { EmpleadoModel } from "../model/EmpleadoModel.js";
import { FichaContratacionModel } from "../model/FichaContratacionModel.js";
import { IPermisosPolicy } from "../policyObject/IPermisosPolicy.js";

const CAMPOS = ["Nombre", "Apellidos", "Email", "FechaNacimiento", "Profesion", "Etapa", "Cargo", "Candidato", "Reclutador"] as const;

/**
 * Interfaz web del menú: cumple las mismas funciones que la versión de consola
 * (identificarse, crear/listar fichas, avanzar/rechazar etapa, deshacer, consultar
 * permisos, ver auditoría), pero con botones y formularios en vez de prompt()/console.log.
 */
export class MenuConsola {
    private readonly consumer: Consumer;
    private usuario: EmpleadoModel | undefined;

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

    private usuarioActual(): EmpleadoModel {
        if (this.usuario === undefined) {
            throw new Error("No hay un usuario identificado");
        }
        return this.usuario;
    }

    private mostrarLogin(): void {
        this.usuario = undefined;
        this.encabezado.textContent = "";
        this.menu.innerHTML = "";
        this.listado.innerHTML = "";
        this.panel.innerHTML = "";

        const select = crear("select");
        agregarOpciones(select, [...this.consumer.idsEmpleados()].map((id) => {
            const empleado = this.consumer.buscarEmpleado(id);
            const detalle = empleado !== undefined ? empleado.getNombreCompleto() + " (" + empleado.getCargo() + ")" : id;
            return { valor: id, texto: id + " - " + detalle };
        }));

        const boton = crear("button", {
            texto: "Ingresar",
            onClick: () => {
                const empleado = this.consumer.buscarEmpleado(select.value);
                if (empleado === undefined) {
                    this.log("Empleado no encontrado");
                    return;
                }
                this.usuario = empleado;
                this.log("--- Sesión iniciada como " + empleado.getNombreCompleto() + " ---");
                this.mostrarMenuPrincipal();
            }
        });

        this.panel.append(crear("p", { texto: "Identifícate para continuar:" }), select, boton);
    }

    private mostrarMenuPrincipal(): void {
        const usuario = this.usuarioActual();
        this.encabezado.textContent = "Usuario: " + usuario.getNombreCompleto() + " (" + usuario.getCargo() + ")";

        this.menu.innerHTML = "";
        const acciones: [string, () => void][] = [
            ["Crear ficha", () => this.mostrarCrearFicha()],
            ["Avanzar etapa", () => this.mostrarSeleccionFicha("Avanzar etapa", "Avanzar", (ficha) => this.ejecutar(() => {
                this.consumer.avanzarEtapa(this.usuarioActual(), ficha);
                this.log("Nueva etapa: " + ficha.getEtapa().nombre());
            }))],
            ["Rechazar candidato", () => this.mostrarSeleccionFicha("Rechazar candidato", "Rechazar", (ficha) => this.ejecutar(() => {
                this.consumer.rechazarEtapa(this.usuarioActual(), ficha);
                this.log("Nueva etapa: " + ficha.getEtapa().nombre());
            }))],
            ["Deshacer último cambio", () => this.mostrarSeleccionFicha("Deshacer último cambio", "Deshacer", (ficha) => this.ejecutar(() => {
                const deshecho = this.consumer.deshacer(this.usuarioActual(), ficha);
                this.log(deshecho ? "Último cambio deshecho" : "No hay cambios que deshacer");
            }))],
            ["Consultar permiso", () => this.mostrarConsultarPermiso()],
            ["Ver auditoría", () => this.mostrarAuditoria()],
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
        if (this.usuario === undefined) {
            return;
        }
        const usuario = this.usuario;

        this.listado.append(crear("h2", { texto: "Fichas" }));
        const fichas = this.consumer.getFichas();
        if (fichas.length === 0) {
            this.listado.append(crear("p", { texto: "No hay fichas" }));
            return;
        }

        const lista = crear("ol");
        for (const f of fichas) {
            const politica = this.consumer.consultarPolitica(f, usuario);
            const texto = this.campo(politica, "Nombre", f.getCandidato().getNombreCompleto())
                + " | " + this.campo(politica, "Cargo", f.getCargo())
                + " | Etapa: " + this.campo(politica, "Etapa", f.getEtapa().nombre())
                + " | Reclutador: " + this.campo(politica, "Reclutador", f.getReclutador().getNombreCompleto());
            lista.append(crear("li", { texto }));
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

        const idsCandidatos = [...this.consumer.idsCandidatos()];
        if (idsCandidatos.length === 0) {
            this.panel.append(crear("p", { texto: "No hay candidatos registrados" }));
            return;
        }

        const candidatos = crear("select");
        agregarOpciones(candidatos, idsCandidatos.map((id) => ({ valor: id, texto: id })));
        const cargo = crear("input", { atributos: { type: "text", placeholder: "Cargo" } });
        const boton = crear("button", {
            texto: "Crear",
            onClick: () => this.ejecutar(() => {
                this.consumer.crearFicha(candidatos.value, this.usuarioActual(), cargo.value);
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
