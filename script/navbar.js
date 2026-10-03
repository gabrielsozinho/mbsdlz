document.getElementById("navbar").innerHTML = `
    <div class="menu-overlay" id="menuOverlay">
        <button class="menu-close" id="menuClose" aria-label="Fechar menu">×</button>

        <div class="menu-content">
            <p class="menu-subtitle">nosso cantinho ♡</p>

            <a href="index.html">Início</a>
            <a href="historia.html">Nossa história</a>
            <a href="dates.html">Nossos dates</a>
            <a href="filmes.html">Filmes</a>
            <a href="mensagens.html">Mensagens</a>
            <a href="fotos.html">Fotos</a>

        </div>
    </div>

    <div class="bottomNav">
        <div class="bottomNavItem">
            <a href="./index.html">
                <img src="assets/home.svg" alt="Inicio">
                
            </a>
        </div>
        <div class="bottomNavItem">
            <a href="./historia.html">
                <img src="assets/historia.svg" alt="Historia">
            </a>
        </div>
        <div class="bottomNavItem">
            <a href="./fotos.html">
                <img src="assets/fotos.svg" alt="Fotos">
            </a>
        </div>
        <div class="bottomNavItem menu-button" id="menuButton">
            <img src="assets/menu.svg" alt="Menu">
        </div>
    </div>
`

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