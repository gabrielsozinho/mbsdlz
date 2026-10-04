import { supabase } from "./supabase.js";

const galeria = document.getElementById("fotos");

async function carregarFotos() {

    const { data: fotos, error } = await supabase
        .from("fotos")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    galeria.innerHTML = "";

    for (const foto of fotos) {

        const { data, error: erroUrl } =
            await supabase
                .storage
                .from("fotos")
                .createSignedUrl(
                    foto.caminho,
                    60 * 60
                );

        if (erroUrl) {
            console.error(erroUrl);
            continue;
        }

        
        const card = document.createElement("div");
        card.className = "foto-card";

        const imagem = document.createElement("img");

        imagem.src = data.signedUrl;
        imagem.alt = foto.descricao || "Foto especial";

        card.appendChild(imagem);

        card.addEventListener("click", () => {
            abrirModalFoto(foto, data.signedUrl);
        });


        galeria.appendChild(card);
    }
}

carregarFotos();

const inputFoto = document.getElementById("inputFoto");
const inputDescricao = document.getElementById("inputDescricao");
const btnEnviar = document.getElementById("btnEnviar");

btnEnviar.addEventListener("click", adicionarFoto);

async function adicionarFoto() {

    const arquivo = inputFoto.files[0];
    const descricao = inputDescricao.value.trim();

    if (!arquivo) {
        alert("Escolha uma foto.");
        return;
    }

    if (!descricao) {
        alert("Escreva uma pequena descrição.");
        return;
    }

    const {
        data: { user },
        error: erroUsuario
    } = await supabase.auth.getUser();

    if (erroUsuario || !user) {
        alert("Você precisa estar logado.");
        return;
    }

    const extensao =
        arquivo.name.split(".").pop();

    const nomeArquivo =
        `${crypto.randomUUID()}.${extensao}`;

    const caminho =
        `${user.id}/${nomeArquivo}`;
    
        const { error: erroUpload } =
        await supabase
            .storage
            .from("fotos")
            .upload(caminho, arquivo, {
                contentType: arquivo.type,
                upsert: false
            });

    if (erroUpload) {
        console.error(erroUpload);
        alert("Não foi possível enviar a foto.");
        return;
    }
        const { error: erroBanco } =
        await supabase
            .from("fotos")
            .insert({
                caminho: caminho,
                descricao: descricao,
                criado_por: user.id
            });

    if (erroBanco) {

        console.error(erroBanco);

        // Se o banco falhar, remove a imagem
        // para não deixar arquivo órfão.

        await supabase
            .storage
            .from("fotos")
            .remove([caminho]);

        alert("Não foi possível salvar a foto.");
        return;
    }

    inputFoto.value = "";
    inputDescricao.value = "";

    await carregarFotos();
}

document.addEventListener("click", async (event) => {

    if (!event.target.classList.contains("btn-apagar")) {
        return;
    }

    const id =
        event.target.dataset.id;

    const caminho =
        event.target.dataset.caminho;

    const confirmar =
        confirm("Quer mesmo apagar essa foto?");

    if (!confirmar) {
        return;
    }

    // Primeiro remove o arquivo
    const { error: erroStorage } =
        await supabase
            .storage
            .from("fotos")
            .remove([caminho]);

    if (erroStorage) {
        console.error(erroStorage);
        alert("Não foi possível apagar a foto.");
        return;
    }

    // Depois remove o registro
    const { error: erroBanco } =
        await supabase
            .from("fotos")
            .delete()
            .eq("id", id);

    if (erroBanco) {
        console.error(erroBanco);
        alert("A foto foi removida do Storage, mas houve um erro no banco.");
        return;
    }

    await carregarFotos();
});

const btnAdicionar = document.getElementById("btnAdicionar");
const modalAdicionar = document.getElementById("modalAdicionar");
const fecharModal = document.getElementById("fecharModal");

btnAdicionar.addEventListener("click", () => {
    modalAdicionar.classList.add("active");
    document.body.style.overflow = "hidden";
});

fecharModal.addEventListener("click", fecharModalAdicionar);

function fecharModalAdicionar() {
    modalAdicionar.classList.remove("active");
    document.body.style.overflow = "";
}

modalAdicionar.addEventListener("click", (event) => {
    if (event.target === modalAdicionar) {
        fecharModalAdicionar();
    }
});

const fotoSeletor = document.getElementById("fotoSeletor");
const previewFoto = document.getElementById("previewFoto");

inputFoto.addEventListener("change", () => {

    const arquivo = inputFoto.files[0];

    if (!arquivo) {
        fotoSeletor.classList.remove("tem-foto");
        previewFoto.src = "";
        return;
    }

    const url = URL.createObjectURL(arquivo);

    previewFoto.src = url;

    fotoSeletor.classList.add("tem-foto");
});

const modalFoto = document.getElementById("modalFoto");
const fecharModalFoto = document.getElementById("fecharModalFoto");

const fotoModalImagem = document.getElementById("fotoModalImagem");
const fotoModalDescricao = document.getElementById("fotoModalDescricao");

const btnApagarFoto = document.getElementById("btnApagarFoto");

let fotoSelecionada = null;

function abrirModalFoto(foto, url) {
    console.log("Objeto recebido:", foto);
    console.log("ID recebido:", foto.id);
    fotoSelecionada = foto;
    fotoModalImagem.src = url;
    fotoModalDescricao.textContent =
        foto.descricao || "Sem descrição.";
    modalFoto.classList.add("active");
    document.body.style.overflow = "hidden";
}
function fecharFotoModal() {

    modalFoto.classList.remove("active");

    document.body.style.overflow = "";

    fotoModalImagem.src = "";

    fotoSelecionada = null;
}

fecharModalFoto.addEventListener("click", fecharFotoModal);
modalFoto.addEventListener("click", (event) => {

    if (event.target === modalFoto) {
        fecharFotoModal();
    }

});

btnApagarFoto.addEventListener("click", async () => {

    if (!fotoSelecionada) {
        console.error("Nenhuma foto selecionada.");
        return;
    }

    console.log("fotoSelecionada:", fotoSelecionada);
    console.log("ID:", fotoSelecionada.id);
    console.log("Caminho:", fotoSelecionada.caminho);

    if (!fotoSelecionada.id) {
        console.error("ID da foto está undefined!");
        return;
    }

    const confirmar = confirm("Tem certeza que quer apagar essa foto?");

    if (!confirmar) return;

    // Apaga do Storage
    const { error: erroStorage } =
        await supabase
            .storage
            .from("fotos")
            .remove([fotoSelecionada.caminho]);

    if (erroStorage) {
        console.error("Erro no Storage:", erroStorage);
        alert("Não foi possível apagar a foto.");
        return;
    }

    // Apaga do banco
    const { error: erroBanco } =
        await supabase
            .from("fotos")
            .delete()
            .eq("id", fotoSelecionada.id);

    if (erroBanco) {
        console.error("Erro no banco:", erroBanco);
        return;
    }

    fecharFotoModal();

    await carregarFotos();
});