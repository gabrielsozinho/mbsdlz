import { supabase } from "./supabase.js";

async function verificarLogin() {
    const { data: { session } } = await supabase.auth.getSession();

    const paginaAtual = window.location.pathname;

    const estaNoLogin = paginaAtual.endsWith("login.html");

    if (!session && !estaNoLogin) {
        window.location.href = "login.html";
    }

    if (session && estaNoLogin) {
        window.location.href = "index.html";
    }
}

verificarLogin();