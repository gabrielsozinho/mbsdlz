// =========================================================
// Conteúdo do site — edite aqui para personalizar as páginas
// =========================================================

export const DATAS = {
    namoro: "2026-09-12",
    vista: "2024-04-13",
    encontro: "2026-03-13",
    beijo: "2026-08-07"
};

export const FRASES = [
    "Meu lugar favorito é do seu lado.",
    "Com você, até o dia comum vira lembrança.",
    "Você é a minha parte preferida de cada dia.",
    "Se eu pudesse escolher de novo, escolheria você mil vezes.",
    "O nosso é a coisa mais bonita que eu já vivi."
];

// Linha do tempo da página "Nossa história"
export const HISTORIA = [
    {
        data: DATAS.vista,
        titulo: "A primeira vez que te vi",
        texto: "Um dia qualquer que, sem a gente saber, mudou tudo."
    },
    {
        data: DATAS.encontro,
        titulo: "Nosso primeiro encontro",
        texto: "O nervosismo, as risadas e a vontade de que não acabasse nunca."
    },
    {
        data: DATAS.beijo,
        titulo: "O primeiro beijo",
        texto: "Aquele segundo em que o mundo inteiro ficou em silêncio."
    },
    {
        data: DATAS.namoro,
        titulo: "Começamos a namorar",
        texto: "O dia em que o \"eu\" e o \"você\" viraram oficialmente \"nós\"."
    }
];

// Fotos: adicione arquivos em /assets/fotos e coloque o caminho em "src".
// Sem "src", um cartão ilustrado é exibido no lugar da foto.
export const FOTOS = [
    { src: "", legenda: "Nosso primeiro rolê", data: "2026-03-13", tom: 0 },
    { src: "", legenda: "Pôr do sol juntos", data: "2026-04-02", tom: 1 },
    { src: "", legenda: "Aquele café", data: "2026-05-18", tom: 2 },
    { src: "", legenda: "Dia de chuva", data: "2026-06-07", tom: 3 },
    { src: "", legenda: "Sorriso bobo", data: "2026-07-21", tom: 1 },
    { src: "", legenda: "Primeiro beijo", data: "2026-08-07", tom: 0 },
    { src: "", legenda: "Oficialmente nós", data: "2026-09-12", tom: 2 },
    { src: "", legenda: "Só mais uma", data: "2026-09-20", tom: 3 }
];

// Cartas da página "Mensagens"
export const MENSAGENS = [
    {
        de: "MBS",
        para: "DLZ",
        titulo: "Abra quando sentir saudade",
        data: "2026-09-12",
        texto: "Fecha os olhos e lembra do nosso último abraço. Eu tô aí, do seu lado, mesmo quando não estou. Falta pouco pra gente se ver de novo."
    },
    {
        de: "DLZ",
        para: "MBS",
        titulo: "Abra quando o dia estiver difícil",
        data: "2026-09-15",
        texto: "Você é muito mais forte do que imagina. Respira, toma uma água e lembra que tem alguém aqui que acredita em você todos os dias."
    },
    {
        de: "MBS",
        para: "DLZ",
        titulo: "Abra quando quiser sorrir",
        data: "2026-09-20",
        texto: "Lembra daquela vez que a gente riu tanto que até doeu a barriga? Eu lembro disso toda vez que penso em você."
    },
    {
        de: "DLZ",
        para: "MBS",
        titulo: "Abra em um dia qualquer",
        data: "2026-09-24",
        texto: "Só pra dizer que eu te amo. Sem motivo especial. Porque com você, todo dia já é especial."
    }
];

// Músicas: "link" pode ser do Spotify, YouTube etc.
export const MUSICAS = [
    { titulo: "Nossa música", artista: "Artista favorito", nota: "A que toca e a gente se olha", link: "" },
    { titulo: "Música do primeiro encontro", artista: "Tocava no carro", nota: "Primeiro encontro", link: "" },
    { titulo: "Aquela do karaokê", artista: "Desafinados", nota: "Cantamos juntos, errado", link: "" },
    { titulo: "A da saudade", artista: "Pra ouvir de longe", nota: "Quando a distância aperta", link: "" },
    { titulo: "A do primeiro beijo", artista: "Trilha sonora", nota: "07 de agosto", link: "" }
];

// Filmes: "visto: true" para os que já assistimos juntos
export const FILMES = [
    { titulo: "Questão de Tempo", ano: 2013, genero: "Romance", visto: true, nota: 5 },
    { titulo: "La La Land", ano: 2016, genero: "Musical", visto: true, nota: 4 },
    { titulo: "Diário de uma Paixão", ano: 2004, genero: "Romance", visto: false },
    { titulo: "Antes do Amanhecer", ano: 1995, genero: "Romance", visto: false },
    { titulo: "Up: Altas Aventuras", ano: 2009, genero: "Animação", visto: true, nota: 5 },
    { titulo: "Como Eu Era Antes de Você", ano: 2016, genero: "Drama", visto: false },
    { titulo: "Orgulho e Preconceito", ano: 2005, genero: "Romance", visto: false }
];

// Dates: "feito: true" para os que já aconteceram
export const DATES = [
    { titulo: "Piquenique no parque", categoria: "Ao ar livre", feito: true, data: "2026-03-13" },
    { titulo: "Noite de fondue", categoria: "Comida", feito: true, data: "2026-06-12" },
    { titulo: "Ver o nascer do sol", categoria: "Ao ar livre", feito: false },
    { titulo: "Cozinhar uma receita nova juntos", categoria: "Em casa", feito: false },
    { titulo: "Maratona de filmes com cabana de lençol", categoria: "Em casa", feito: false },
    { titulo: "Aula de dança", categoria: "Aventura", feito: false },
    { titulo: "Viagem de fim de semana", categoria: "Aventura", feito: false },
    { titulo: "Rodízio de pizza", categoria: "Comida", feito: true, data: "2026-08-07" },
    { titulo: "Observar estrelas", categoria: "Ao ar livre", feito: false }
];

// ---------------------------------------------------------
// Utilitários de data
// ---------------------------------------------------------

export function diasDesde(iso) {
    const hoje = new Date();
    const atual = Date.UTC(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    const [ano, mes, dia] = iso.split("-").map(Number);
    return Math.round((atual - Date.UTC(ano, mes - 1, dia)) / 86_400_000);
}

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

export function formatarData(iso, longo = false) {
    const [ano, mes, dia] = iso.split("-").map(Number);
    if (longo) {
        return new Date(ano, mes - 1, dia).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });
    }
    return `${String(dia).padStart(2, "0")} ${MESES[mes - 1]} ${ano}`;
}
