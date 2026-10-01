import { FOTOS, formatarData } from "./data.js";
import { observarRevelacoes } from "./app.js";

const TONS = [
    ["#f4d3d3", "#e8b4b8"],
    ["#f5e4dc", "#d9a88a"],
    ["#efd7de", "#b76e86"],
    ["#f2e2d0", "#c49a62"]
];

const mural = document.getElementById("mural");
const lightbox = document.getElementById("lightbox");
const conteudo = document.getElementById("lightboxConteudo");
let atual = 0;

const imagem = (foto) => {
    if (foto.src) return `<img src="${foto.src}" alt="${foto.legenda}" loading="lazy">`;
    const [a, b] = TONS[foto.tom % TONS.length];
    return `<div class="foto-vazia" style="--a:${a};--b:${b}" role="img" aria-label="${foto.legenda}"><span>♥</span></div>`;
};

if (!FOTOS.length) {
    mural.innerHTML = `<p class="empty"><strong>Nenhuma foto ainda</strong>Adicione fotos em script/data.js</p>`;
} else {
    mural.innerHTML = FOTOS.map(
        (foto, i) => `
        <button class="polaroid reveal" style="--i:${i % 2};--rot:${((i * 37) % 7) - 3}deg" data-indice="${i}">
            ${imagem(foto)}
            <span class="polaroid-legenda">${foto.legenda}</span>
            <span class="polaroid-data">${formatarData(foto.data)}</span>
        </button>`
    ).join("");
}

observarRevelacoes(mural);

function mostrar(indice) {
    atual = (indice + FOTOS.length) % FOTOS.length;
    const foto = FOTOS[atual];
    conteudo.classList.remove("is-in");
    void conteudo.offsetWidth;
    conteudo.innerHTML = `${imagem(foto)}<figcaption>${foto.legenda}<small>${formatarData(foto.data, true)}</small></figcaption>`;
    conteudo.classList.add("is-in");
}

function abrir(indice) {
    mostrar(indice);
    lightbox.hidden = false;
    requestAnimationFrame(() => lightbox.classList.add("is-open"));
}

function fechar() {
    lightbox.classList.remove("is-open");
    setTimeout(() => (lightbox.hidden = true), 350);
}

mural.addEventListener("click", (e) => {
    const alvo = e.target.closest(".polaroid");
    if (alvo) abrir(Number(alvo.dataset.indice));
});

document.getElementById("fecharLightbox").addEventListener("click", fechar);
document.getElementById("fotoAnterior").addEventListener("click", () => mostrar(atual - 1));
document.getElementById("fotoProxima").addEventListener("click", () => mostrar(atual + 1));
lightbox.addEventListener("click", (e) => e.target === lightbox && fechar());

document.addEventListener("keydown", (e) => {
    if (lightbox.hidden) return;
    if (e.key === "Escape") fechar();
    if (e.key === "ArrowLeft") mostrar(atual - 1);
    if (e.key === "ArrowRight") mostrar(atual + 1);
});

// Deslizar para trocar de foto
let inicioX = null;
lightbox.addEventListener("touchstart", (e) => (inicioX = e.touches[0].clientX), { passive: true });
lightbox.addEventListener("touchend", (e) => {
    if (inicioX === null) return;
    const dx = e.changedTouches[0].clientX - inicioX;
    if (Math.abs(dx) > 50) mostrar(atual + (dx < 0 ? 1 : -1));
    inicioX = null;
});
