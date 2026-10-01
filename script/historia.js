import { HISTORIA, diasDesde, formatarData } from "./data.js";
import { observarRevelacoes } from "./app.js";

const lista = document.getElementById("timeline");
const eventos = [...HISTORIA].sort((a, b) => a.data.localeCompare(b.data));

lista.innerHTML = eventos
    .map((ev, i) => {
        const dias = diasDesde(ev.data);
        return `
        <li class="momento reveal" style="--i:0">
            <span class="momento-ponto" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span>
            <article class="momento-card card">
                <time datetime="${ev.data}">${formatarData(ev.data, true)}</time>
                <h2>${ev.titulo}</h2>
                <p>${ev.texto}</p>
                <span class="chip">${dias >= 0 ? `há ${dias.toLocaleString("pt-BR")} dias` : `em ${(-dias).toLocaleString("pt-BR")} dias`}</span>
            </article>
        </li>`;
    })
    .join("");

observarRevelacoes(lista);

// A linha se desenha conforme a rolagem
const atualizarLinha = () => {
    const r = lista.getBoundingClientRect();
    const visivel = Math.min(Math.max((innerHeight * 0.75 - r.top) / r.height, 0), 1);
    lista.style.setProperty("--progresso", visivel.toFixed(3));
};
addEventListener("scroll", atualizarLinha, { passive: true });
atualizarLinha();
