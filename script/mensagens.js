import { MENSAGENS, formatarData } from "./data.js";
import { observarRevelacoes, explodirCoracoes } from "./app.js";

const lista = document.getElementById("envelopes");
const overlay = document.getElementById("cartaOverlay");

lista.innerHTML = MENSAGENS.length
    ? MENSAGENS.map(
        (m, i) => `
        <button class="envelope reveal" style="--i:${i % 2};--rot:${i % 2 ? 1.5 : -1.5}deg" data-indice="${i}">
            <span class="envelope-aba" aria-hidden="true"></span>
            <span class="envelope-selo" aria-hidden="true">♥</span>
            <span class="envelope-para">Para ${m.para}</span>
            <span class="envelope-titulo">${m.titulo}</span>
            <span class="envelope-de">de ${m.de} · ${formatarData(m.data)}</span>
        </button>`
    ).join("")
    : `<p class="empty"><strong>Nenhuma cartinha ainda</strong>Escreva a primeira em script/data.js</p>`;

observarRevelacoes(lista);

function abrir(botao) {
    const m = MENSAGENS[Number(botao.dataset.indice)];
    botao.classList.add("is-opening");

    const r = botao.querySelector(".envelope-selo").getBoundingClientRect();
    explodirCoracoes(r.left + r.width / 2, r.top + r.height / 2);

    document.getElementById("cartaData").textContent = formatarData(m.data, true);
    document.getElementById("cartaTitulo").textContent = m.titulo;
    document.getElementById("cartaTexto").textContent = m.texto;
    document.getElementById("cartaAssinatura").textContent = `Com amor, ${m.de}`;

    setTimeout(() => {
        overlay.hidden = false;
        requestAnimationFrame(() => overlay.classList.add("is-open"));
        document.getElementById("fecharCarta").focus();
        botao.classList.remove("is-opening");
        botao.classList.add("is-lida");
    }, 550);
}

function fechar() {
    overlay.classList.remove("is-open");
    setTimeout(() => (overlay.hidden = true), 450);
}

lista.addEventListener("click", (e) => {
    const botao = e.target.closest(".envelope");
    if (botao) abrir(botao);
});
document.getElementById("fecharCarta").addEventListener("click", fechar);
overlay.addEventListener("click", (e) => e.target === overlay && fechar());
document.addEventListener("keydown", (e) => e.key === "Escape" && !overlay.hidden && fechar());
