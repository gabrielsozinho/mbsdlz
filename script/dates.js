import { DATES, formatarData } from "./data.js";
import { observarRevelacoes, explodirCoracoes } from "./app.js";

const lista = document.getElementById("dates");
const feitos = DATES.filter((d) => d.feito);
const pendentes = DATES.filter((d) => !d.feito);

const item = (d, i) => `
    <li class="date reveal${d.feito ? " is-feito" : ""}" style="--i:${i % 3}">
        <span class="date-check" aria-hidden="true"></span>
        <span class="date-info">
            <strong>${d.titulo}</strong>
            <small>${d.categoria}${d.feito && d.data ? ` · ${formatarData(d.data)}` : ""}</small>
        </span>
    </li>`;

lista.innerHTML = DATES.length
    ? `
        <h2 class="dates-grupo reveal">Pra viver <span>${pendentes.length}</span></h2>
        <ul class="dates-lista">${pendentes.map(item).join("") || `<li class="empty">Todos vividos. Hora de sonhar mais!</li>`}</ul>
        <h2 class="dates-grupo reveal">Já vivemos <span>${feitos.length}</span></h2>
        <ul class="dates-lista">${feitos.map(item).join("")}</ul>`
    : `<p class="empty"><strong>Nenhum date ainda</strong>Adicione ideias em script/data.js</p>`;

observarRevelacoes(lista);

document.getElementById("datesFeitos").textContent = feitos.length;
document.getElementById("datesTotal").textContent = DATES.length;
const barra = document.getElementById("datesBarra");
const barraObs = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    barra.style.transform = `scaleX(${DATES.length ? feitos.length / DATES.length : 0})`;
    barraObs.disconnect();
});
barraObs.observe(barra);

// Sorteio com efeito de roleta
const botao = document.getElementById("sortear");
const resultado = document.getElementById("sorteioResultado");

botao.addEventListener("click", () => {
    const opcoes = pendentes.length ? pendentes : DATES;
    if (!opcoes.length) return;
    botao.disabled = true;
    resultado.classList.add("is-rolling");

    let passo = 0;
    const total = 14 + Math.floor(Math.random() * 6);
    const girar = () => {
        resultado.textContent = opcoes[Math.floor(Math.random() * opcoes.length)].titulo;
        passo++;
        if (passo < total) {
            setTimeout(girar, 50 + passo * passo * 1.4);
        } else {
            resultado.classList.remove("is-rolling");
            resultado.classList.add("is-done");
            setTimeout(() => resultado.classList.remove("is-done"), 700);
            const r = resultado.getBoundingClientRect();
            explodirCoracoes(r.left + r.width / 2, r.top + r.height / 2, 12);
            botao.disabled = false;
            botao.textContent = "Sortear de novo";
        }
    };
    girar();
});
