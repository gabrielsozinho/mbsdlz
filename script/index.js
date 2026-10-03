import { supabase } from "./supabase.js";

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
const randomDateHome = document.getElementById("randomDateHome");
const randomDateResult = document.getElementById("randomDateResult");
const randomDateCategory = document.getElementById("randomDateCategory");
const randomDateTitle = document.getElementById("randomDateTitle");
const randomDateDescription = document.getElementById("randomDateDescription");
const newRandomDate = document.getElementById("newRandomDate");
const menuButton = document.getElementById("menuButton");
const menuClose = document.getElementById("menuClose");
const menuOverlay = document.getElementById("menuOverlay");

menuButton.addEventListener("click", () => {
    menuOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
});

menuClose.addEventListener("click", () => {
    menuOverlay.classList.remove("active");
    document.body.style.overflow = "";
});


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

async function loadDates() {
    const { count, error } = await supabase
    .from("dates")
    .select("*", {
        count: "exact",
        head: true
    })
    .eq("status", "done");

    document.getElementById("datesFeitos")
        .textContent = count;

    const { count: total } = await supabase
        .from("dates")
        .select("*", {
            count: "exact",
            head: true
        });

    document.getElementById("datesTotais")
        .textContent = total;
}


async function pickRandomDateHome() {

    const { data, error } = await supabase
        .from("dates")
        .select("*")
        .eq("status", "planned");

    if (error) {
        console.error(error);
        return;
    }

    if (!data || data.length === 0) {
        randomDateTitle.textContent = "Vocês já fizeram todos! ❤️";
        randomDateDescription.textContent =
            "Parece que está na hora de criar novas experiências.";
        randomDateResult.classList.remove("hidden");
        return;
    }

    const randomIndex = Math.floor(
        Math.random() * data.length
    );

    const selected = data[randomIndex];

    showRandomDate(selected);
}

function showRandomDate(date) {
    randomDateCategory.textContent = date.category || "Experiência";
    randomDateTitle.textContent = date.title;
    randomDateDescription.textContent =
        date.description || "Uma nova experiência para vocês viverem juntos. ♡";
    randomDateResult.classList.remove("hidden");
}

window.addEventListener("load", calcularDias);
window.addEventListener("load", alternarFrases);
window.addEventListener("load", loadDates);
randomDateHome.addEventListener("click", pickRandomDateHome);
newRandomDate.addEventListener("click", pickRandomDateHome);

async function sair() {
    await supabase.auth.signOut();

    window.location.href = "login.html";
}