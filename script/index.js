import { DATAS, FRASES, diasDesde } from "./data.js";
import { explodirCoracoes } from "./app.js";

// Conta de 0 até o valor final com desaceleração suave
function animarNumero(el, valor, duracao = 1600) {
    const inicio = performance.now();
    const passo = (agora) => {
        const t = Math.min((agora - inicio) / duracao, 1);
        const suave = 1 - Math.pow(1 - t, 4);
        el.textContent = Math.round(valor * suave).toLocaleString("pt-BR");
        if (t < 1) requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
}

function calcularDias() {
    const total = diasDesde(DATAS.namoro);

    animarNumero(document.getElementById("dias"), total);
    [[DATAS.vista, "diasVista"], [DATAS.encontro, "diasEncontro"], [DATAS.beijo, "diasBeijo"]]
        .forEach(([data, id]) => animarNumero(document.getElementById(id), diasDesde(data), 2000));

    // Meses, semanas e próximo mesversário
    const [ano, mes, dia] = DATAS.namoro.split("-").map(Number);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    let meses = (hoje.getFullYear() - ano) * 12 + (hoje.getMonth() - (mes - 1));
    if (hoje.getDate() < dia) meses--;
    meses = Math.max(meses, 0);

    const semanas = Math.floor(total / 7);
    document.getElementById("detalhe").textContent =
        `${meses} ${meses === 1 ? "mês" : "meses"} · ${semanas} ${semanas === 1 ? "semana" : "semanas"} · ${(total * 24).toLocaleString("pt-BR")} horas`;

    const anterior = new Date(ano, mes - 1 + meses, dia);
    const proximo = new Date(ano, mes - 1 + meses + 1, dia);
    const faltam = Math.round((proximo - hoje) / 86_400_000);
    const progresso = (hoje - anterior) / (proximo - anterior);

    const numeroMes = meses + 1;
    document.getElementById("proximo").innerHTML = faltam === 0
        ? "Hoje é nosso mesversário ♥"
        : `Faltam <strong>${faltam}</strong> ${faltam === 1 ? "dia" : "dias"} para ${numeroMes % 12 === 0 ? `${numeroMes / 12} ${numeroMes === 12 ? "ano" : "anos"}` : `${numeroMes} ${numeroMes === 1 ? "mês" : "meses"}`} juntos`;

    requestAnimationFrame(() => {
        document.getElementById("progresso").style.transform = `scaleX(${Math.max(progresso, 0.02)})`;
    });
}

// Frases que se alternam com um efeito de digitação suave
function alternarFrases() {
    const el = document.getElementById("frase");
    let indice = Math.floor(Math.random() * FRASES.length);

    const mostrar = () => {
        el.classList.remove("is-in");
        setTimeout(() => {
            el.textContent = FRASES[indice];
            el.classList.add("is-in");
            indice = (indice + 1) % FRASES.length;
        }, 450);
    };
    mostrar();
    setInterval(mostrar, 6000);
}

const coracao = document.getElementById("coracao");
const enviarCoracoes = () => {
    const r = coracao.getBoundingClientRect();
    explodirCoracoes(r.left + r.width / 2, r.top + r.height / 2, 12);
    coracao.classList.remove("pulse");
    void coracao.offsetWidth;
    coracao.classList.add("pulse");
};
coracao.addEventListener("click", enviarCoracoes);
coracao.addEventListener("keydown", (e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), enviarCoracoes()));

calcularDias();
alternarFrases();
