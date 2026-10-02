import { supabase } from "./supabase.js";

const datesList = document.getElementById("datesList");
const dateCounter = document.getElementById("dateCounter");
const randomDateBtn = document.getElementById("randomDateBtn");

const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const toggleAddDate = document.getElementById("toggleAddDate");
const addDateForm = document.getElementById("addDateForm");
const cancelAddDate = document.getElementById("cancelAddDate");

const newTitle = document.getElementById("newTitle");
const newDescription = document.getElementById("newDescription");
const newCategory = document.getElementById("newCategory");
const newLocation = document.getElementById("newLocation");

let allDates = [];
let currentFilter = "all";


// ===============================
// LOAD DATES
// ===============================

async function loadDates() {

    const { data, error } = await supabase
        .from("dates")
        .select("*");

    if (error) {
        console.error(error);
        datesList.innerHTML = "<p>Não foi possível carregar dates.</p>";
        return;
    }

    allDates = data;

    updateCounter();
    renderDates();
}


// ===============================
// COUNTER
// ===============================

function updateCounter() {

    const completed = allDates.filter(
        date => date.status === "done"
    ).length;

    const total = allDates.length;

    dateCounter.textContent =
        `${completed} / ${total} quadrinhos marcados`;
}


// ===============================
// RENDER
// ===============================

function renderDates() {

    let dates = [...allDates];

    // Filter
    if (currentFilter !== "all") {
        dates = dates.filter(
            date => date.status === currentFilter
        );
    }

    // Search
    const search = searchInput.value
        .toLowerCase()
        .trim();

    if (search) {
        dates = dates.filter(date =>
        (date.title || "").toLowerCase().includes(search) ||
        (date.description || "").toLowerCase().includes(search) ||
        (date.category || "").toLowerCase().includes(search)
         );
    }

    // Sort
    const sort = sortSelect.value;

    if (sort === "title") {
        dates.sort((a, b) =>
            a.title.localeCompare(b.title)
        );
    }

    if (sort === "category") {
        dates.sort((a, b) =>
            a.category.localeCompare(b.category)
        );
    }

    if (sort === "status") {
        dates.sort((a, b) =>
            a.status.localeCompare(b.status)
        );
    }

    if (sort === "newest") {
        dates.sort((a, b) =>
            b.id - a.id
        );
    }

    if (sort === "oldest") {
        dates.sort((a, b) =>
            a.id - b.id
        );
    }

    // Empty
    if (dates.length === 0) {
        datesList.innerHTML = `
            <p class="empty">
                Não foram encontrados dates.
            </p>
        `;

        return;
    }

    // Cards
    datesList.innerHTML = dates
        .map(date => createDateCard(date))
        .join("");
}


toggleAddDate.addEventListener("click", () => {
    addDateForm.classList.toggle("hidden");

    if (!addDateForm.classList.contains("hidden")) {
        newTitle.focus();
    }
});

cancelAddDate.addEventListener("click", () => {
    addDateForm.classList.add("hidden");
    addDateForm.reset();
});

addDateForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const title = newTitle.value.trim();
    const description = newDescription.value.trim();
    const category = newCategory.value.trim();
    const location = newLocation.value.trim();

    if (!title) {
        alert("Por favor adicione uma ideia");
        return;
    }

    const { data, error } = await supabase
        .from("dates")
        .insert({
            title: title,
            description: description,
            category: category || null,
            status: "planned",
            completed_at: null,
            location: location || null
        })
        .select()
        .single();

    if (error) {
        console.error(error);
        alert("Não foi possível adicionar esse date");
        return;
    }

    // Adiciona imediatamente à lista local
    allDates.push(data);

    // Atualiza a página
    updateCounter();
    renderDates();

    // Limpa o formulário
    addDateForm.reset();
    addDateForm.classList.add("hidden");

});

async function deleteDate(id) {

    const date = allDates.find(item => item.id === id);

    if (!date) return;

    const confirmed = confirm(
        `Apagar "${date.title}"?\n\nIsso não pode ser desfeito.`
    );

    if (!confirmed) return;

    const { error } = await supabase
        .from("dates")
        .delete()
        .eq("id", id);

    if (error) {
        console.error(error);
        alert("Não foi possível apagar esse date.");
        return;
    }

    // Remove da lista local
    allDates = allDates.filter(item => item.id !== id);

    // Atualiza a interface
    updateCounter();
    renderDates();
}

document.querySelectorAll(".delete-button").forEach(button => {

    button.addEventListener("click", () => {

        const id = Number(button.dataset.id);

        deleteDate(id);

    });

});





// ===============================
// DATE CARD
// ===============================

function createDateCard(date) {

    const isDone = date.status === "done";

    return `
        <article class="date-card ${isDone ? "done" : ""}">

            <div class="date-card-content">

                <span class="date-category">
                    ${date.category}
                </span>

                <h2>${date.title}</h2>

                <p>
                    ${date.description}
                </p>

                <div class="date-status">

                    ${
                        isDone
                        ? `
                            ✓ Done
                            ${
                                date.completed_at
                                ? `• ${formatDate(date.completed_at)}`
                                : ""
                            }
                        `
                        : `
                            ○ To do
                        `
                    }

                </div>

            </div>
            
            <button
                class="complete-button"
                data-id="${date.id}"
            >
                ${
                    isDone
                    ? "↩ Undo"
                    : "✓ Done"
                }
            </button>
            <button class="delete-button" data-id="${date.id}">🗑️</button>
        </article>
    `;
}


// ===============================
// FORMAT DATE
// ===============================

function formatDate(date) {

    return new Date(date + "T00:00:00")
        .toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
}


// ===============================
// MARK DONE / UNDONE
// ===============================

datesList.addEventListener("click", async (event) => {

    // =========================
    // BOTÃO APAGAR
    // =========================

    const deleteButton = event.target.closest(".delete-button");

    if (deleteButton) {

        const id = Number(deleteButton.dataset.id);

        await deleteDate(id);

        return;
    }


    // =========================
    // BOTÃO DONE / UNDO
    // =========================

    const completeButton = event.target.closest(".complete-button");

    if (!completeButton) return;

    const id = Number(completeButton.dataset.id);

    const date = allDates.find(
        date => date.id === id
    );

    if (!date) return;

    const newStatus =
        date.status === "done"
            ? "planned"
            : "done";

    const newCompletedAt =
        newStatus === "done"
            ? new Date().toISOString().split("T")[0]
            : null;

    const { error } = await supabase
        .from("dates")
        .update({
            status: newStatus,
            completed_at: newCompletedAt
        })
        .eq("id", id);

    if (error) {
        console.error(error);
        alert("Não foi possível atualizar o date.");
        return;
    }

    await loadDates();
});

// ===============================
// FILTERS
// ===============================

document.querySelectorAll(".filter")
    .forEach(button => {

        button.addEventListener("click", () => {

            document
                .querySelectorAll(".filter")
                .forEach(btn =>
                    btn.classList.remove("active")
                );

            button.classList.add("active");

            currentFilter =
                button.dataset.filter;

            renderDates();
        });

    });


// ===============================
// SEARCH
// ===============================

searchInput.addEventListener(
    "input",
    renderDates
);


// ===============================
// SORT
// ===============================

sortSelect.addEventListener(
    "change",
    renderDates
);


// ===============================
// RANDOM DATE
// ===============================

randomDateBtn.addEventListener(
    "click",
    pickRandomDate
);

function pickRandomDate() {

    // Only dates that haven't been done
    const availableDates = allDates.filter(
        date => date.status === "planned"
    );

    if (availableDates.length === 0) {

        alert(
            "Você fez todos os dates!!"
        );

        return;
    }

    const randomIndex =
        Math.floor(
            Math.random() * availableDates.length
        );

    const selected =
        availableDates[randomIndex];

    showRandomDate(selected);
}


// ===============================
// RANDOM DATE DISPLAY
// ===============================

function showRandomDate(date) {

    alert(
        `Seu date::\n\n${date.title}\n\n${date.description}`
    );
}


// ===============================
// INITIAL LOAD
// ===============================

loadDates();