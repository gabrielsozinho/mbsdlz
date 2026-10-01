import { FILMES } from "./data.js";
import { observarRevelacoes } from "./app.js";

const grade = document.getElementById("filmes");
const abas = document.getElementById("abasFilmes");
const indicador = abas.querySelector(".tabs-indicator");

const CORES = [
    ["#8a2846", "#4d1628"],
    ["#c49a62", "#7a5a34"],
    ["#b76e86", "#6b2a41"],
    ["#e8b4b8", "#b76e86"]
];

const estrelas = (n) =>
    `<span class="estrelas" aria-label="${n} de 5">${"★".repeat(n)}<i>${"★".repeat(5 - n)}</i></span>`;

function renderizar(filtro) {
    const filmes = FILMES.filter((f) => filtro === "todos" || (filtro === "vistos" ? f.visto : !f.visto));

    grade.innerHTML = filmes.length
        ? filmes.map((f, i) => {
            const [a, b] = CORES[i % CORES.length];
            return `
            <article class="filme reveal" style="--i:${i % 2};--a:${a};--b:${b}">
                <div class="poster">
                    <span class="poster-ano">${f.ano}</span>
                    <span class="poster-titulo">${f.titulo}</span>
                    ${f.visto ? `<span class="poster-selo">visto</span>` : ""}
                </div>
                <div class="filme-info">
                    <span class="filme-genero">${f.genero}</span>
                    ${f.visto && f.nota ? estrelas(f.nota) : `<span class="filme-pendente">na lista</span>`}
                </div>
            </article>`;
        }).join("")
        : `<p class="empty"><strong>Nada por aqui</strong>Adicione filmes em script/data.js</p>`;

    observarRevelacoes(grade);
}

function moverIndicador(aba) {
    indicador.style.width = `${aba.offsetWidth}px`;
    indicador.style.transform = `translateX(${aba.offsetLeft}px)`;
}

abas.addEventListener("click", (e) => {
    const aba = e.target.closest(".tab");
    if (!aba) return;
    abas.querySelectorAll(".tab").forEach((t) => t.setAttribute("aria-selected", t === aba));
    moverIndicador(aba);
    grade.classList.add("is-changing");
    setTimeout(() => {
        renderizar(aba.dataset.filtro);
        grade.classList.remove("is-changing");
    }, 220);
});

renderizar("todos");
document.fonts.ready.then(() => moverIndicador(abas.querySelector('[aria-selected="true"]')));
