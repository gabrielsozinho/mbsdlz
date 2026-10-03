import { supabase } from "./supabase.js";

let cartas = [];

// ==========================================
// ELEMENTOS
// ==========================================

const cartasOpenWhen = document.getElementById("cartasOpenWhen");

const cartasTimeCapsule = document.getElementById("cartasTimeCapsule");

const btnNovaCarta = document.getElementById("btnNovaCarta");

const modalNovaCarta = document.getElementById("modalNovaCarta");

const fecharModal = document.getElementById("fecharModal");

const formCarta = document.getElementById("formCarta");

const tipoInputs = document.querySelectorAll('input[name="tipo"]');

const campoData = document.getElementById("campoData");

const dataAbertura = document.getElementById("dataAbertura");

const modalLeitura = document.getElementById("modalLeitura");

const fecharLeitura = document.getElementById("fecharLeitura");

const tituloLeitura = document.getElementById("tituloLeitura");

const conteudoLeitura = document.getElementById("conteudoLeitura");

// ==========================================
// INICIALIZAÇÃO
// ==========================================

async function iniciar() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Se não estiver logado
  if (!user) {
    window.location.href = "login.html";

    return;
  }

  await carregarCartas();
}

iniciar();

// ==========================================
// CARREGAR CARTAS
// ==========================================

async function carregarCartas() {
  const { data, error } = await supabase
    .from("cartas")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error("Erro ao carregar cartas:", error);

    mostrarErro();

    return;
  }

  cartas = data || [];

  renderizarCartas();
}

// ==========================================
// RENDERIZAR
// ==========================================

function renderizarCartas() {
  cartasOpenWhen.innerHTML = "";
  cartasTimeCapsule.innerHTML = "";

  const openWhen = cartas.filter((carta) => carta.tipo === "open_when");

  const timeCapsules = cartas.filter((carta) => carta.tipo === "time_capsule");

  if (openWhen.length === 0) {
    cartasOpenWhen.innerHTML = "";

    cartasOpenWhen.appendChild(
      criarMensagemVazia("Ainda não existem cartas aqui..."),
    );
  } else {
    openWhen.forEach((carta) => {
      cartasOpenWhen.appendChild(criarCardCarta(carta));
    });
  }

  if (timeCapsules.length === 0) {
    cartasTimeCapsule.innerHTML = "";

    cartasTimeCapsule.appendChild(
      criarMensagemVazia("Ainda não existem cápsulas do tempo..."),
    );
  } else {
    timeCapsules.forEach((carta) => {
      cartasTimeCapsule.appendChild(criarCardCarta(carta));
    });
  }
}

// ==========================================
// CRIAR CARD
// ==========================================

function criarCardCarta(carta) {
  const disponivel = cartaEstaDisponivel(carta);

  const card = document.createElement("button");

  card.className = "card-carta";

  card.type = "button";

  const destinatario = carta.destinatario === "maria" ? "Maria" : "Gabriel";

  let status;

  if (disponivel) {
    status = `
            <span class="status disponivel">
                🔓 Disponível
            </span>
        `;
  } else {
    status = `
            <span class="status bloqueada">
                🔒 Disponível em ${formatarData(carta.data_abertura)}
            </span>
        `;
  }

  card.innerHTML = `

        <div class="icone-carta">
            💌
        </div>

        <div class="informacoes-carta">

            <h3>
                ${escaparHTML(carta.titulo)}
            </h3>

            <p>
                Para ${destinatario}
            </p>

            ${status}

        </div>

    `;

  card.addEventListener("click", () => abrirCarta(carta));

  return card;
}

// ==========================================
// VERIFICAR DATA
// ==========================================

function cartaEstaDisponivel(carta) {
  if (!carta.data_abertura) {
    return true;
  }

  const hoje = new Date();

  hoje.setHours(0, 0, 0, 0);

  const dataAbertura = new Date(carta.data_abertura + "T00:00:00");

  return dataAbertura <= hoje;
}

// ==========================================
// ABRIR CARTA
// ==========================================

async function abrirCarta(carta) {
  if (!cartaEstaDisponivel(carta)) {
    alert(
      `Essa carta só poderá ser aberta em ${formatarData(carta.data_abertura)}. ❤️`,
    );

    return;
  }

  tituloLeitura.textContent = carta.titulo;

  conteudoLeitura.textContent = carta.conteudo;

  modalLeitura.classList.remove("escondido");
}

// ==========================================
// MODAL NOVA CARTA
// ==========================================

btnNovaCarta.addEventListener("click", () => {
  modalNovaCarta.classList.remove("escondido");
});

fecharModal.addEventListener("click", fecharModalNovaCarta);

function fecharModalNovaCarta() {
  modalNovaCarta.classList.add("escondido");

  formCarta.reset();

  campoData.classList.add("escondido");

  dataAbertura.required = false;
}

// ==========================================
// MODAL LEITURA
// ==========================================

fecharLeitura.addEventListener("click", () => {
  modalLeitura.classList.add("escondido");
});

// Fechar clicando fora

modalNovaCarta.addEventListener("click", (event) => {
  if (event.target === modalNovaCarta) {
    fecharModalNovaCarta();
  }
});

modalLeitura.addEventListener("click", (event) => {
  if (event.target === modalLeitura) {
    modalLeitura.classList.add("escondido");
  }
});

// ==========================================
// MOSTRAR / ESCONDER DATA
// ==========================================

tipoInputs.forEach((input) => {
  input.addEventListener("change", () => {
    const tipo = document.querySelector('input[name="tipo"]:checked').value;

    if (tipo === "time_capsule") {
      campoData.classList.remove("escondido");

      dataAbertura.required = true;
    } else {
      campoData.classList.add("escondido");

      dataAbertura.required = false;

      dataAbertura.value = "";
    }
  });
});

// ==========================================
// SALVAR CARTA
// ==========================================

formCarta.addEventListener("submit", async (event) => {
  event.preventDefault();

  const titulo = document.getElementById("titulo").value.trim();

  const conteudo = document.getElementById("conteudo").value.trim();

  const destinatario = document.querySelector(
    'input[name="destinatario"]:checked',
  ).value;

  const tipo = document.querySelector('input[name="tipo"]:checked').value;

  let data = null;

  if (tipo === "time_capsule") {
    data = dataAbertura.value;

    if (!data) {
      alert("Escolha uma data para abrir a carta.");

      return;
    }
  }

  // Usuário atualmente logado

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    alert("Sua sessão expirou. Faça login novamente.");

    window.location.href = "login.html";

    return;
  }

  // Inserir carta

  const { error } = await supabase.from("cartas").insert({
    titulo,

    conteudo,

    tipo,

    destinatario,

    data_abertura: data,

    criado_por: user.id,
  });

  if (error) {
    console.error("Erro ao salvar carta:", error);

    alert("Não foi possível guardar a carta.");

    return;
  }

  alert("Carta guardada com carinho. ❤️");

  fecharModalNovaCarta();

  await carregarCartas();
});

// ==========================================
// FORMATAR DATA
// ==========================================

function formatarData(data) {
  return new Date(data + "T00:00:00").toLocaleDateString("pt-BR");
}

// ==========================================
// SEGURANÇA VISUAL
// ==========================================

function escaparHTML(texto) {
  const div = document.createElement("div");

  div.textContent = texto;

  return div.innerHTML;
}

// ==========================================
// MENSAGEM VAZIA
// ==========================================

function criarMensagemVazia(texto) {
  const p = document.createElement("p");

  p.className = "mensagem-vazia";

  p.textContent = texto;

  return p;
}

// ==========================================
// ERRO
// ==========================================

function mostrarErro() {
  cartasOpenWhen.innerHTML = `
        <p class="mensagem-erro">
            Não foi possível carregar as cartas.
        </p>
        `;

  cartasTimeCapsule.innerHTML = "";
}
