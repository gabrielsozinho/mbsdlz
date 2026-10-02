const DATA_NAMORO = "2026-09-12";
const DATA_VISTA = "2024-04-13";
const DATA_BEIJO = "2026-08-07";
const DATA_ENCONTRO = "2026-03-13";
const FRASES = [
    "Meu lugar favorito é do seu lado.",
    "Com você, até o dia comum vira lembrança.",
    "Você é a minha parte preferida de cada dia.",
    "Se eu pudesse escolher de novo, escolheria você mil vezes.",
    "O nosso amor é a coisa mais bonita que eu já vivi.",
    "Um cantinho especial para guardar nossa história."
];


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

function alternarFrases() {
    const el = document.getElementById("frase");
    let indice = Math.floor(Math.random() * FRASES.length);
    el.textContent = FRASES[indice];
}

window.addEventListener("load", calcularDias);
window.addEventListener("load", alternarFrases);

async function sair() {
    await supabase.auth.signOut();

    window.location.href = "login.html";
}