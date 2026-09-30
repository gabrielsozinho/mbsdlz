import { supabase } from "./supabase.js";

const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = usernameInput.value.trim();
    const senha = passwordInput.value;

    // Tenta autenticar o usuário
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: senha
    });

    if (error) {
        alert("Erro ao fazer login. Verifique seu e-mail e senha.");
        console.error(error.message);
        return;
    }

    // Login realizado com sucesso
    window.location.href = "index.html";
});