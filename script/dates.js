import { supabase } from "./supabase.js";

const datesList = document.getElementById("datesList");
const dateCounter = document.getElementById("dateCounter");
const randomDateBtn = document.getElementById("randomDateBtn");

const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

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
        datesList.innerHTML = "<p>Could not load dates.</p>";
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
        `${completed} / ${total} experiences completed`;
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
            date.title.toLowerCase().includes(search) ||
            date.description.toLowerCase().includes(search) ||
            date.category.toLowerCase().includes(search)
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
                No dates found 💭
            </p>
        `;

        return;
    }

    // Cards
    datesList.innerHTML = dates
        .map(date => createDateCard(date))
        .join("");
}


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

    const button = event.target.closest(".complete-button");

    if (!button) return;

    const id = Number(button.dataset.id);

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
        alert("Could not update the date.");
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
            "You've done every date! ❤️"
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
        `🎲 Your date:\n\n${date.title}\n\n${date.description}`
    );
}


// ===============================
// INITIAL LOAD
// ===============================

loadDates();