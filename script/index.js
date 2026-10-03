import { supabase } from "./supabase.js";

const USUARIOS = {
  "af1ca81f-2daa-4fd2-81e9-7e64103de255": "gabriel",
  "18143036-e357-4e3b-94f9-e298c1539335": "maria",
};
const DATA_NAMORO = "2026-09-12";
const DATA_VISTA = "2024-04-13";
const DATA_BEIJO = "2026-08-07";
const DATA_ENCONTRO = "2026-03-13";
const FRASES = [
  "Meu lugar favorito é do seu lado.",
  "Com você, até o dia comum vira lembrança.",
  "Você é a minha parte preferida de cada dia.",
  "Se eu pudesse escolher de novo, escolheria você mil vezes.",
  "O nosso amor é a coisa mais bonita que eu já vivi.",
  "Um cantinho especial para guardar nossa história.",
];
const randomDateHome = document.getElementById("randomDateHome");
const randomDateResult = document.getElementById("randomDateResult");
const randomDateCategory = document.getElementById("randomDateCategory");
const randomDateTitle = document.getElementById("randomDateTitle");
const randomDateDescription = document.getElementById("randomDateDescription");
const newRandomDate = document.getElementById("newRandomDate");

function calcularDias() {
  const hoje = new Date();
  const atual = Date.UTC(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());

  [
    [DATA_NAMORO, "dias"],
    [DATA_VISTA, "diasVista"],
    [DATA_BEIJO, "diasBeijo"],
    [DATA_ENCONTRO, "diasEncontro"],
  ].forEach(([data, id]) => {
    const [ano, mes, dia] = data.split("-").map(Number);
    document.getElementById(id).textContent =
      (atual - Date.UTC(ano, mes - 1, dia)) / 86_400_000;
  });
}

function alternarFrases() {
  const el = document.getElementById("frase");
  let indice = Math.floor(Math.random() * FRASES.length);
  el.textContent = FRASES[indice];
}

async function loadDates() {
  const { count, error } = await supabase
    .from("dates")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("status", "done");

  document.getElementById("datesFeitos").textContent = count;

  const { count: total } = await supabase.from("dates").select("*", {
    count: "exact",
    head: true,
  });

  document.getElementById("datesTotais").textContent = total;
}

async function pickRandomDateHome() {
  const { data, error } = await supabase
    .from("dates")
    .select("*")
    .eq("status", "planned");

  if (error) {
    console.error(error);
    return;
  }

  if (!data || data.length === 0) {
    randomDateTitle.textContent = "Vocês já fizeram todos! ❤️";
    randomDateDescription.textContent =
      "Parece que está na hora de criar novas experiências.";
    randomDateResult.classList.remove("hidden");
    return;
  }

  const randomIndex = Math.floor(Math.random() * data.length);

  const selected = data[randomIndex];

  showRandomDate(selected);
}

function showRandomDate(date) {
  randomDateCategory.textContent = date.category || "Experiência";
  randomDateTitle.textContent = date.title;
  randomDateDescription.textContent =
    date.description || "Uma nova experiência para vocês viverem juntos. ♡";
  randomDateResult.classList.remove("hidden");
}

let pessoaLogada = null;
let cartas = [];
let cartaSelecionada = null;


async function descobrirUsuário() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    window.location.href = "login.html";
    return;
  }
  pessoaLogada = USUARIOS[user.id];

  console.log("Usuário logado:", pessoaLogada);

  if (!pessoaLogada) {
    alert("Usuário não configurado.");
    return;
  }

  await carregarCartas();
}

descobrirUsuário();

async function carregarCartas() {
  const { data, error } = await supabase
    .from("cartas")
    .select("*")
    .eq("destinatario", pessoaLogada)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(error);
    mostrarErro();

    return;
  }

  cartas = data || [];

  renderizarCartas();
}

async function renderizarCartas() {
  const container = document.getElementById("cartasHome");

  if (!container) {
    return;
  }

  const { data, error } = await supabase
    .from("cartas")
    .select("*")
    .eq("destinatario", pessoaLogada)
    .eq("tipo", "open_when")
    .order("created_at", {
      ascending: false,
    })
    .limit(3);

  if (error) {
    console.error("Erro ao carregar cartas:", error);

    container.innerHTML = `
            <p class="mensagem-erro">
                Não foi possível carregar suas cartas.
            </p>
        `;

    return;
  }

  if (!data || data.length === 0) {
    container.innerHTML = `
            <p class="mensagem-vazia">
                Ainda não há cartinhas para você. ❤️
            </p>
        `;

    return;
  }

  container.innerHTML = "";

  data.forEach((carta) => {
    const card = document.createElement("div");

    card.className = "card-carta-home";

    const disponivel = cartaEstaDisponivel(carta);

    card.innerHTML = `
            <div class="icone-carta">
                💌
            </div>

            <div class="informacoes-carta">

                <h3>
                    ${escaparHTML(carta.titulo)}
                </h3>

                <p>
                    ${
                      disponivel
                        ? "🔓 Disponível"
                        : "🔒 Disponível em " +
                          formatarData(carta.data_abertura)
                    }
                </p>

            </div>
        `;

    container.appendChild(card);
  });
}


function cartaEstaDisponivel(carta) {

    if (!carta.data_abertura) {
        return true;
    }

    const hoje = new Date();

    hoje.setHours(0, 0, 0, 0);

    const dataAbertura = new Date(
        carta.data_abertura + "T00:00:00"
    );

    return dataAbertura <= hoje;
}

function formatarData(data) {

    return new Date(
        data + "T00:00:00"
    ).toLocaleDateString("pt-BR");
}

function escaparHTML(texto) {

    const div = document.createElement("div");

    div.textContent = texto;

    return div.innerHTML;
}
window.addEventListener("load", calcularDias);
window.addEventListener("load", alternarFrases);
window.addEventListener("load", loadDates);
randomDateHome.addEventListener("click", pickRandomDateHome);
newRandomDate.addEventListener("click", pickRandomDateHome);

