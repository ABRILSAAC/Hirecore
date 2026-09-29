# Supuestos

Diagrama de referencia: [ver en excalidraw.com](https://excalidraw.com/#room=b322a97cc39c97aa2647,ZT2RwciWuDNwue8sUspfJw)

## Supuestos generales

- El área de RRHH, el reclutador y el gerente son quienes controlan los estados.
- El gerente de contratación y RRHH es quien controla la gestión de cambios (revertir cambios).
- El flujo del estado de contratación es un proceso lineal, es decir, debe existir una entrevista antes de una prueba técnica.
- La contratación tendrá los siguientes atributos: `NombreCandidato`, `CorreoCandidato`, `EtapaActual`, `DecisiónFinal`, `Reclutador`, `FechaInicio`.
- El software ATS será el encargado de generar un seguimiento de contratación para las hojas de vida de los candidatos inscritos.

### Alcance de los actores según perfil de usuario

| Perfil | Alcance |
|---|---|
| Gerente de contratación | Administrador para confirmar contrato (solo le importa cuando ya hay algo concreto que decidir, no los pasos intermedios) |
| RRHH | Superusuario (revertir el último cambio, ver historial de cambios, opciones de auditoría) |
| Reclutador | Usuario con permisos limitados |
| Nómina | Usuario de lectura |
| Candidato | Usuario de solo lectura |

## Puntos a justificar explícitamente

### Alcance de "deshacer"

RRHH insinuó que el alcance de deshacer podría crecer más allá de la última transición. Lo que asumimos e implementamos:

- El historial (`HistorialCambiosModel`) es una **pila**: cada cambio de etapa se apila al ejecutarse, y "deshacer" desapila y revierte el más reciente.
- Esto permite deshacer **más de un paso**, pero de a uno a la vez y en orden estrictamente inverso (LIFO) — no se puede saltar directamente a un punto arbitrario del historial, ni deshacer un paso intermedio sin antes deshacer los posteriores.
- **No hay "rehacer"**: una vez deshecho un cambio, no se puede reaplicar. Si se necesita, habría que volver a ejecutar la acción manualmente.
- El "deshacer" revierte la etapa, pero no revalida permisos contra el estado anterior ni dispara de nuevo las reglas de notificación por cargo — sí genera su propio evento (`CAMBIO_DESHECHO`) para auditoría.

### Reglas de notificación para el gerente de contratación

La conversación dejó esto deliberadamente vago ("cuando ya hay algo concreto que decidir"). Lo que asumimos:

- Cada etapa tiene un cargo "encargado" (`IEtapaState.encargado()`). Para las etapas de proceso (Aplicado, Entrevista, Prueba Técnica) el encargado es el Reclutador; para las etapas donde ya hay una decisión con peso (Oferta, Rechazado) el encargado es Recursos Humanos o el Gerente de Contratación.
- Concretamente, **Oferta** es la etapa asignada al Gerente de Contratación: es el punto donde avanzar significa "contratar" y rechazar significa "no contratar" — ahí sí hay algo concreto que decidir.
- En las etapas intermedias (Aplicado, Entrevista, Prueba Técnica, Validación de Referencias) el gerente **no** recibe notificación, para no saturarlo con pasos de proceso que no requieren su decisión.

### Diseño pensando en un proceso todavía en definición

Sabemos que van a llegar más etapas y que no todas se conocen hoy, así que:

- Las etapas se modelan con el patrón **State** (`IEtapaState` + una clase por etapa) y se construyen con una **Abstract Factory** (`IEtapaAbstractFactory` / `EtapaFactoryConcreta`). Agregar una etapa nueva es crear una clase que implemente `IEtapaState` y registrarla en la fábrica — no hay que tocar la lógica de permisos, notificaciones ni auditoría, porque todas trabajan contra la interfaz (`permisosLectura()`, `permisosEscritura()`, `encargado()`), no contra nombres de etapa fijos.
