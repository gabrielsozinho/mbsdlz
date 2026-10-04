import { supabase } from "./supabase.js";

const listaFilmes = document.getElementById("listaFilmes");

const modalAdicionarFilme =
    document.getElementById("modalAdicionarFilme");

const btnAdicionarFilme =
    document.getElementById("btnAdicionarFilme");

const fecharModalFilme =
    document.getElementById("fecharModalFilme");

const inputBuscaFilme =
    document.getElementById("inputBuscaFilme");

const resultadosFilmes =
    document.getElementById("resultadosFilmes");

const filmeSelecionado =
    document.getElementById("filmeSelecionado");

const filmeSelecionadoPoster =
    document.getElementById("filmeSelecionadoPoster");

const filmeSelecionadoTitulo =
    document.getElementById("filmeSelecionadoTitulo");

const filmeSelecionadoInfo =
    document.getElementById("filmeSelecionadoInfo");

const filmeSelecionadoDiretor =
    document.getElementById("filmeSelecionadoDiretor");

const btnSalvarFilme =
    document.getElementById("btnSalvarFilme");

const dataAssistido =
    document.getElementById("dataAssistido");

const comentarioFilme =
    document.getElementById("comentarioFilme");

const textoNota =
    document.getElementById("textoNota");

let filmeAtual = null;
let notaAtual = null;

let timeoutBusca;

inputBuscaFilme.addEventListener("input", () => {

    clearTimeout(timeoutBusca);

    const termo = inputBuscaFilme.value.trim();

    if (termo.length < 2) {
        resultadosFilmes.innerHTML = "";
        return;
    }

    timeoutBusca = setTimeout(() => {
        pesquisarFilmes(termo);
    }, 400);

});

async function pesquisarFilmes(termo) {

    resultadosFilmes.innerHTML =
        `<p class="buscando-filmes">Procurando...</p>`;

    try {

        const url =
            `https://api.themoviedb.org/3/search/movie` +
            `?query=${encodeURIComponent(termo)}` +
            `&language=pt-BR` +
            `&include_adult=false`;

        const resposta = await fetch(url, {
            headers: {
                Authorization: `Bearer ${TMDB_TOKEN}`,
                accept: "application/json"
            }
        });

        if (!resposta.ok) {
            throw new Error(
                `TMDB retornou ${resposta.status}`
            );
        }

        const dados = await resposta.json();

        mostrarResultadosBusca(dados.results);

    } catch (erro) {

        console.error(
            "Erro ao pesquisar filme:",
            erro
        );

        resultadosFilmes.innerHTML =
            `<p class="buscando-filmes">
                Não foi possível pesquisar.
            </p>`;
    }
}

function mostrarResultadosBusca(filmes) {

    resultadosFilmes.innerHTML = "";

    if (!filmes || filmes.length === 0) {

        resultadosFilmes.innerHTML =
            `<p class="buscando-filmes">
                Nenhum filme encontrado.
            </p>`;

        return;
    }

    filmes
        .filter(filme => filme.poster_path)
        .slice(0, 6)
        .forEach(filme => {

            const resultado =
                document.createElement("div");

            resultado.className =
                "resultado-filme";

            const imagem =
                document.createElement("img");

            imagem.src =
                `https://image.tmdb.org/t/p/w185${filme.poster_path}`;

            imagem.alt =
                filme.title;

            const info =
                document.createElement("div");

            info.className =
                "resultado-filme-info";

            const titulo =
                document.createElement("strong");

            titulo.textContent =
                filme.title;

            const ano =
                document.createElement("span");

            ano.textContent =
                filme.release_date
                    ? filme.release_date.slice(0, 4)
                    : "Ano desconhecido";

            info.appendChild(titulo);
            info.appendChild(ano);

            resultado.appendChild(imagem);
            resultado.appendChild(info);

            resultado.addEventListener(
                "click",
                () => selecionarFilme(filme)
            );

            resultadosFilmes.appendChild(resultado);
        });
}

async function selecionarFilme(filme) {

    resultadosFilmes.innerHTML = "";

    inputBuscaFilme.value =
        filme.title;

    try {

        const url =
            `https://api.themoviedb.org/3/movie/${filme.id}` +
            `?language=pt-BR` +
            `&append_to_response=credits`;

        const resposta = await fetch(url, {
            headers: {
                Authorization: `Bearer ${TMDB_TOKEN}`,
                accept: "application/json"
            }
        });

        if (!resposta.ok) {
            throw new Error(
                `TMDB retornou ${resposta.status}`
            );
        }

        const detalhes = await resposta.json();

        const diretor =
            detalhes.credits?.crew?.find(
                pessoa => pessoa.job === "Director"
            );

        filmeAtual = {
            tmdb_id: detalhes.id,

            titulo: detalhes.title,

            titulo_original:
                detalhes.original_title,

            poster_path:
                detalhes.poster_path,

            backdrop_path:
                detalhes.backdrop_path,

            ano:
                detalhes.release_date
                    ? Number(
                        detalhes.release_date.slice(0, 4)
                    )
                    : null,

            diretor:
                diretor?.name || null,

            sinopse:
                detalhes.overview || null
        };

        mostrarFilmeSelecionado();

    } catch (erro) {

        console.error(
            "Erro ao buscar detalhes:",
            erro
        );

        alert(
            "Não foi possível carregar os detalhes do filme."
        );
    }
}

function mostrarFilmeSelecionado() {

    if (!filmeAtual) return;

    filmeSelecionadoPoster.src =
        filmeAtual.poster_path
            ? `https://image.tmdb.org/t/p/w500${filmeAtual.poster_path}`
            : "";

    filmeSelecionadoTitulo.textContent =
        filmeAtual.titulo;

    filmeSelecionadoInfo.textContent =
        filmeAtual.ano
            ? `${filmeAtual.ano}`
            : "";

    filmeSelecionadoDiretor.textContent =
        filmeAtual.diretor
            ? `Direção: ${filmeAtual.diretor}`
            : "Diretor não encontrado.";

    filmeSelecionado.classList.add("visivel");
}

const botoesEstrela =
    document.querySelectorAll(
        "#estrelasNota button"
    );

botoesEstrela.forEach(botao => {

    botao.addEventListener("click", () => {

        notaAtual =
            Number(botao.dataset.nota);

        botoesEstrela.forEach(estrela => {

            const nota =
                Number(estrela.dataset.nota);

            estrela.classList.toggle(
                "ativa",
                nota <= notaAtual
            );

        });

        textoNota.textContent =
            `${notaAtual}/5`;
    });

});

btnAdicionarFilme.addEventListener(
    "click",
    () => {

        modalAdicionarFilme.classList.add("active");

        document.body.style.overflow =
            "hidden";
    }
);

fecharModalFilme.addEventListener(
    "click",
    fecharModalAdicionarFilme
);

modalAdicionarFilme.addEventListener(
    "click",
    event => {

        if (event.target === modalAdicionarFilme) {
            fecharModalAdicionarFilme();
        }

    }
);

function fecharModalAdicionarFilme() {

    modalAdicionarFilme.classList.remove(
        "active"
    );

    document.body.style.overflow = "";

}

btnSalvarFilme.addEventListener(
    "click",
    salvarFilme
);

async function salvarFilme() {

    if (!filmeAtual) {

        alert(
            "Escolha um filme primeiro."
        );

        return;
    }

    if (!notaAtual) {

        alert(
            "Escolha uma nota para o filme."
        );

        return;
    }

    const {
        data: { user },
        error: erroUsuario
    } = await supabase.auth.getUser();

    if (erroUsuario || !user) {

        alert(
            "Você precisa estar logado."
        );

        return;
    }


    btnSalvarFilme.disabled = true;

    btnSalvarFilme.textContent =
        "Guardando...";


    const { error } =
        await supabase
            .from("filmes")
            .insert({

                tmdb_id:
                    filmeAtual.tmdb_id,

                titulo:
                    filmeAtual.titulo,

                titulo_original:
                    filmeAtual.titulo_original,

                poster_path:
                    filmeAtual.poster_path,

                backdrop_path:
                    filmeAtual.backdrop_path,

                ano:
                    filmeAtual.ano,

                diretor:
                    filmeAtual.diretor,

                sinopse:
                    filmeAtual.sinopse,

                nota:
                    notaAtual,

                comentario:
                    comentarioFilme.value.trim()
                    || null,

                data_assistido:
                    dataAssistido.value
                    || null,

                criado_por:
                    user.id
            });


    if (error) {

        console.error(
            "Erro ao salvar filme:",
            error
        );

        if (error.code === "23505") {

            alert(
                "Esse filme já está na nossa lista ♡"
            );

        } else {

            alert(
                "Não foi possível salvar o filme."
            );
        }

        btnSalvarFilme.disabled = false;

        btnSalvarFilme.textContent =
            "Guardar filme ♡";

        return;
    }


    fecharModalAdicionarFilme();

    limparFormularioFilme();

    await carregarFilmes();

    btnSalvarFilme.disabled = false;

    btnSalvarFilme.textContent =
        "Guardar filme ♡";
}

function limparFormularioFilme() {

    filmeAtual = null;
    notaAtual = null;

    inputBuscaFilme.value = "";

    resultadosFilmes.innerHTML = "";

    filmeSelecionado.classList.remove(
        "visivel"
    );

    filmeSelecionadoPoster.src = "";

    dataAssistido.value = "";

    comentarioFilme.value = "";

    botoesEstrela.forEach(
        estrela => estrela.classList.remove("ativa")
    );

    textoNota.textContent =
        "Escolha uma nota";
}

async function carregarFilmes() {

    const {
        data: filmes,
        error
    } = await supabase
        .from("filmes")
        .select("*");

    if (error) {

        console.error(error);

        return;
    }

    filmesCarregados = filmes;

    aplicarFiltroFilmes();
}

function renderizarFilmes(filmes) {

    listaFilmes.innerHTML = "";

    if (!filmes || filmes.length === 0) {

        listaFilmes.innerHTML = `
            <div class="sem-filmes">
                <span>♡</span>
                <h2>Ainda não temos filmes aqui</h2>
                <p>
                    Que tal adicionar o primeiro?
                </p>
            </div>
        `;

        return;
    }


    filmes.forEach(filme => {

        const card =
            document.createElement("article");

        card.className =
            "filme-card";


        const poster =
            document.createElement("img");

        poster.className =
            "filme-poster";

        poster.src =
            filme.poster_path
                ? `https://image.tmdb.org/t/p/w500${filme.poster_path}`
                : "img/sem-poster.jpg";

        poster.alt =
            filme.titulo;


        const info =
            document.createElement("div");

        info.className =
            "filme-card-info";


        const titulo =
            document.createElement("h3");

        titulo.textContent =
            filme.titulo;


        const ano =
            document.createElement("p");

        ano.className =
            "filme-ano";

        ano.textContent =
            filme.ano || "";


        const nota =
            document.createElement("div");

        nota.className =
            "filme-nota";

        nota.textContent =
            `★ ${filme.nota}/5`;


        info.appendChild(titulo);
        info.appendChild(ano);
        info.appendChild(nota);


        card.appendChild(poster);
        card.appendChild(info);


        card.addEventListener(
            "click",
            () => abrirDetalhesFilme(filme)
        );


        listaFilmes.appendChild(card);

    });
}

let filmeDetalhesAtual = null;

function abrirDetalhesFilme(filme) {

    filmeDetalhesAtual = filme;

    document.getElementById(
        "detalhesPoster"
    ).src =
        filme.poster_path
            ? `https://image.tmdb.org/t/p/w500${filme.poster_path}`
            : "img/sem-poster.jpg";


    document.getElementById(
        "detalhesAno"
    ).textContent =
        filme.ano || "";


    document.getElementById(
        "detalhesTitulo"
    ).textContent =
        filme.titulo;


    document.getElementById(
        "detalhesDiretor"
    ).textContent =
        filme.diretor
            ? `Direção: ${filme.diretor}`
            : "";


    document.getElementById(
        "detalhesNota"
    ).textContent =
        "★".repeat(Math.round(filme.nota))
        +
        " "
        +
        filme.nota
        +
        "/5";


    document.getElementById(
        "detalhesSinopse"
    ).textContent =
        filme.sinopse
        ||
        "Sem sinopse disponível.";


    document.getElementById(
        "detalhesComentario"
    ).textContent =
        filme.comentario
        ||
        "Ainda não escrevemos uma memória sobre esse filme.";


    document.getElementById(
        "detalhesData"
    ).textContent =
        filme.data_assistido
            ? `Assistimos em ${formatarData(filme.data_assistido)}`
            : "";


    document.getElementById(
        "modalDetalhesFilme"
    ).classList.add("active");


    document.body.style.overflow =
        "hidden";
}

function formatarData(data) {

    return new Date(
        data + "T00:00:00"
    ).toLocaleDateString(
        "pt-BR"
    );
}

const modalDetalhesFilme =
    document.getElementById(
        "modalDetalhesFilme"
    );

document.getElementById(
    "fecharDetalhesFilme"
).addEventListener(
    "click",
    fecharDetalhesFilme
);

modalDetalhesFilme.addEventListener(
    "click",
    event => {

        if (event.target === modalDetalhesFilme) {
            fecharDetalhesFilme();
        }

    }
);

function fecharDetalhesFilme() {

    modalDetalhesFilme.classList.remove(
        "active"
    );

    document.body.style.overflow = "";

    filmeDetalhesAtual = null;
}

document.getElementById(
    "btnApagarFilme"
).addEventListener(
    "click",
    apagarFilme
);

async function apagarFilme() {

    if (!filmeDetalhesAtual) return;

    const confirmar =
        confirm(
            `Quer realmente apagar "${filmeDetalhesAtual.titulo}"?`
        );

    if (!confirmar) return;


    const { error } =
        await supabase
            .from("filmes")
            .delete()
            .eq(
                "id",
                filmeDetalhesAtual.id
            );


    if (error) {

        console.error(error);

        alert(
            "Não foi possível apagar o filme."
        );

        return;
    }


    fecharDetalhesFilme();

    await carregarFilmes();
}

document.getElementById(
    "filtroFilmes"
).addEventListener(
    "change",
    aplicarFiltroFilmes
);

let filmesCarregados = [];

function aplicarFiltroFilmes() {

    const filtro =
        document.getElementById(
            "filtroFilmes"
        ).value;


    const filmes =
        [...filmesCarregados];


    if (filtro === "nota") {

        filmes.sort(
            (a, b) => b.nota - a.nota
        );

    }


    else if (filtro === "titulo") {

        filmes.sort(
            (a, b) =>
                a.titulo.localeCompare(
                    b.titulo,
                    "pt-BR"
                )
        );

    }


    else {

        filmes.sort(
            (a, b) => {

                const dataA =
                    a.data_assistido
                    || a.created_at;

                const dataB =
                    b.data_assistido
                    || b.created_at;

                return (
                    new Date(dataB)
                    -
                    new Date(dataA)
                );
            }
        );

    }


    renderizarFilmes(filmes);
}

carregarFilmes();