import { MUSICAS } from "./data.js";
import { observarRevelacoes } from "./app.js";

const lista = document.getElementById("faixas");
const vinil = document.getElementById("vinil");
const player = vinil.closest(".toca-discos");

lista.innerHTML = MUSICAS.length
    ? MUSICAS.map(
        (m, i) => `
        <li class="reveal" style="--i:${i}">
            <button class="faixa" data-indice="${i}">
                <span class="faixa-num">${String(i + 1).padStart(2, "0")}</span>
                <span class="faixa-info">
                    <strong>${m.titulo}</strong>
                    <small>${m.artista}${m.nota ? ` · ${m.nota}` : ""}</small>
                </span>
                <span class="faixa-play" aria-hidden="true"></span>
            </button>
        </li>`
    ).join("")
    : `<p class="empty"><strong>Playlist vazia</strong>Adicione músicas em script/data.js</p>`;

observarRevelacoes(lista);

let tocando = null;

lista.addEventListener("click", (e) => {
    const botao = e.target.closest(".faixa");
    if (!botao) return;
    const indice = Number(botao.dataset.indice);
    const musica = MUSICAS[indice];

    lista.querySelectorAll(".faixa").forEach((f) => f.classList.remove("is-playing"));

    if (tocando === indice) {
        tocando = null;
        player.classList.remove("is-playing");
        return;
    }

    tocando = indice;
    botao.classList.add("is-playing");
    player.classList.add("is-playing");

    const titulo = document.getElementById("agoraTitulo");
    titulo.classList.remove("troca");
    void titulo.offsetWidth;
    titulo.classList.add("troca");
    titulo.textContent = musica.titulo;
    document.getElementById("agoraArtista").textContent = musica.artista;

    if (musica.link) window.open(musica.link, "_blank", "noopener");
});

if (MUSICAS[0]) {
    document.getElementById("agoraTitulo").textContent = MUSICAS[0].titulo;
    document.getElementById("agoraArtista").textContent = MUSICAS[0].artista;
}
