import { supabase } from "./supabase.js";

// Ícones em traço, herdando a cor do texto
const ICONES = {
    inicio: '<path d="M4 10.5 12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5H15v-6h-6v6H5.5A1.5 1.5 0 0 1 4 19z"/>',
    historia: '<path d="M12 6.5C10 5 7 4.5 3.5 4.8v13.4c3.5-.3 6.5.2 8.5 1.8 2-1.6 5-2.1 8.5-1.8V4.8C17 4.5 14 5 12 6.5zM12 6.5V20"/>',
    fotos: '<rect x="3.5" y="5" width="17" height="14" rx="2.5"/><circle cx="9" cy="10" r="1.8"/><path d="m20.5 16-4.5-4.5L7 19"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
    mensagens: '<rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="m4 7 8 6 8-6"/>',
    musicas: '<circle cx="7" cy="17.5" r="2.5"/><circle cx="17" cy="15.5" r="2.5"/><path d="M9.5 17.5V6.5l10-2v11"/>',
    filmes: '<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><path d="M7.5 4.5v15M16.5 4.5v15M3.5 9h4M3.5 15h4M16.5 9h4M16.5 15h4"/>',
    dates: '<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/><path d="M12 17.2s-2.6-1.5-2.6-3.1a1.3 1.3 0 0 1 2.6-.4 1.3 1.3 0 0 1 2.6.4c0 1.6-2.6 3.1-2.6 3.1z"/>'
};

const svg = (nome) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONES[nome]}</svg>`;

const PAGINAS = [
    { href: "index.html", nome: "inicio", rotulo: "Início", desc: "Nosso contador" },
    { href: "historia.html", nome: "historia", rotulo: "História", desc: "Como tudo começou" },
    { href: "fotos.html", nome: "fotos", rotulo: "Fotos", desc: "Nossos momentos" },
    { href: "mensagens.html", nome: "mensagens", rotulo: "Mensagens", desc: "Cartinhas" },
    { href: "musicas.html", nome: "musicas", rotulo: "Músicas", desc: "Nossa trilha" },
    { href: "filmes.html", nome: "filmes", rotulo: "Filmes", desc: "Vistos e a ver" },
    { href: "dates.html", nome: "dates", rotulo: "Dates", desc: "Ideias e memórias" }
];

const arquivoAtual = location.pathname.split("/").pop() || "index.html";

function montarNavegacao() {
    const nav = document.createElement("nav");
    nav.className = "bottomNav";
    nav.setAttribute("aria-label", "Navegação principal");

    const principais = PAGINAS.slice(0, 3);
    const noMenu = !principais.some((p) => p.href === arquivoAtual);

    nav.innerHTML =
        principais
            .map(
                (p) => `<a class="bottomNavItem${p.href === arquivoAtual ? " is-active" : ""}" href="./${p.href}">
                    ${svg(p.nome)}<span>${p.rotulo}</span></a>`
            )
            .join("") +
        `<button class="bottomNavItem${noMenu ? " is-active" : ""}" id="menu" aria-haspopup="dialog" aria-controls="drawer">
            ${svg("menu")}<span>Mais</span></button>`;

    const backdrop = document.createElement("div");
    backdrop.className = "drawer-backdrop";

    const drawer = document.createElement("aside");
    drawer.className = "drawer";
    drawer.id = "drawer";
    drawer.setAttribute("role", "dialog");
    drawer.setAttribute("aria-modal", "true");
    drawer.setAttribute("aria-label", "Menu");
    drawer.innerHTML = `
        <div class="drawer-handle"></div>
        <h2 class="drawer-title">Nosso cantinho</h2>
        <div class="drawer-grid">
            ${PAGINAS.map(
                (p, i) => `<a class="drawer-link${p.href === arquivoAtual ? " is-active" : ""}" href="./${p.href}" style="--i:${i}">
                    ${svg(p.nome)}<span>${p.rotulo}<small>${p.desc}</small></span></a>`
            ).join("")}
        </div>
        <button class="btn btn-ghost drawer-logout" id="sair">Sair</button>`;

    document.body.append(backdrop, drawer, nav);

    const abrir = (aberto) => {
        document.body.classList.toggle("drawer-open", aberto);
        drawer.inert = !aberto;
    };
    drawer.inert = true;

    nav.querySelector("#menu").addEventListener("click", () => abrir(true));
    backdrop.addEventListener("click", () => abrir(false));
    document.addEventListener("keydown", (e) => e.key === "Escape" && abrir(false));

    // Arrastar para baixo fecha o menu
    let inicioY = null;
    drawer.addEventListener("touchstart", (e) => (inicioY = e.touches[0].clientY), { passive: true });
    drawer.addEventListener("touchend", (e) => {
        if (inicioY !== null && e.changedTouches[0].clientY - inicioY > 70 && drawer.scrollTop === 0) abrir(false);
        inicioY = null;
    });

    drawer.querySelector("#sair").addEventListener("click", async () => {
        await supabase.auth.signOut();
        location.href = "login.html";
    });
}

// Revela elementos ao rolar a página
export function observarRevelacoes(raiz = document) {
    const elementos = raiz.querySelectorAll(".reveal:not(.is-visible)");
    if (!("IntersectionObserver" in window)) {
        elementos.forEach((el) => el.classList.add("is-visible"));
        return;
    }
    const obs = new IntersectionObserver(
        (entradas) =>
            entradas.forEach((entrada) => {
                if (entrada.isIntersecting) {
                    entrada.target.classList.add("is-visible");
                    obs.unobserve(entrada.target);
                }
            }),
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    elementos.forEach((el) => obs.observe(el));
}

function coracoesFlutuantes() {
    const camada = document.createElement("div");
    camada.className = "floating-hearts";
    camada.setAttribute("aria-hidden", "true");
    for (let i = 0; i < 10; i++) {
        const c = document.createElement("span");
        c.textContent = "♥";
        c.style.left = `${Math.random() * 100}%`;
        c.style.fontSize = `${10 + Math.random() * 16}px`;
        c.style.animationDuration = `${14 + Math.random() * 14}s`;
        c.style.animationDelay = `${-Math.random() * 20}s`;
        c.style.setProperty("--drift", `${(Math.random() - 0.5) * 120}px`);
        c.style.setProperty("--spin", `${(Math.random() - 0.5) * 90}deg`);
        camada.appendChild(c);
    }
    document.body.prepend(camada);
}

// Pequena explosão de corações em um ponto da tela
export function explodirCoracoes(x, y, quantidade = 8) {
    for (let i = 0; i < quantidade; i++) {
        const c = document.createElement("span");
        c.className = "burst-heart";
        c.textContent = "♥";
        const angulo = (Math.PI * 2 * i) / quantidade;
        const dist = 40 + Math.random() * 30;
        c.style.left = `${x}px`;
        c.style.top = `${y}px`;
        c.style.setProperty("--x", `${Math.cos(angulo) * dist}px`);
        c.style.setProperty("--y", `${Math.sin(angulo) * dist}px`);
        document.body.appendChild(c);
        c.addEventListener("animationend", () => c.remove());
    }
}

// Transição de saída para navegadores sem View Transitions entre documentos
function transicaoDeSaida() {
    if (CSS.supports("view-transition-name: none") && "onpagereveal" in window) return;
    document.addEventListener("click", (e) => {
        const link = e.target.closest("a[href]");
        if (!link || link.target || e.metaKey || e.ctrlKey || link.origin !== location.origin) return;
        if (link.pathname === location.pathname) return;
        e.preventDefault();
        document.body.classList.add("is-leaving");
        setTimeout(() => (location.href = link.href), 260);
    });
    window.addEventListener("pageshow", () => document.body.classList.remove("is-leaving"));
}

montarNavegacao();
coracoesFlutuantes();
transicaoDeSaida();
observarRevelacoes();

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./service-worker.js").catch((erro) => {
            console.error("Erro ao registrar o Service Worker:", erro);
        });
    });
}
