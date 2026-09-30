const DATA_NAMORO = "2026-09-12";
const DATA_VISTA = "2024-04-13";
const DATA_BEIJO = "2026-08-07";
const DATA_ENCONTRO = "2026-03-13";

function calcularDias() {
    const hoje = new Date();
    const atual = Date.UTC(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());

    [[DATA_NAMORO, "dias"], [DATA_VISTA, "diasVista"], [DATA_BEIJO, "diasBeijo"], [DATA_ENCONTRO, "diasEncontro"]]
        .forEach(([data, id]) => {
            const [ano, mes, dia] = data.split("-").map(Number);
            document.getElementById(id).textContent =
                (atual - Date.UTC(ano, mes - 1, dia)) / 86_400_000;
        });
}

window.addEventListener("load", calcularDias);