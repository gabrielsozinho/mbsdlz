import { supabase } from "./supabase.js";

const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const erro = document.getElementById("loginErro");
const botao = document.getElementById("entrar");

function mostrarErro(mensagem) {
    erro.textContent = mensagem;
    loginForm.classList.remove("tremer");
    void loginForm.offsetWidth;
    loginForm.classList.add("tremer");
}

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = usernameInput.value.trim();
    const senha = passwordInput.value;

    if (!email || !senha) {
        mostrarErro("Preencha e-mail e senha.");
        return;
    }

    erro.textContent = "";
    botao.disabled = true;
    botao.textContent = "Entrando...";

    // Tenta autenticar o usuário
    const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: senha
    });

    if (error) {
        botao.disabled = false;
        botao.textContent = "Entrar";
        mostrarErro("E-mail ou senha incorretos.");
        console.error(error.message);
        return;
    }

    // Login realizado com sucesso
    document.body.classList.add("is-leaving");
    setTimeout(() => (window.location.href = "index.html"), 260);
});
