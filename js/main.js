"use strict";
/*
 * Laboration 5 - Studentkortsgenerator
 * Namn: Lucciana Ghazoul
 */

// Hämta element från DOM
const form = document.querySelector("#studentform");
const clearButton = document.querySelector("#clear");

const fullnameInput = document.querySelector("#fullname");
const emailInput = document.querySelector("#email");
const phoneInput = document.querySelector("#phone");
const fontSelect = document.querySelector("#font");

const previewFullname = document.querySelector("#previewfullname");
const previewEmail = document.querySelector("#previewemail");
const previewPhone = document.querySelector("#previewphone");

const errorList = document.querySelector("#errorlist");
const historySection = document.querySelector("#history");
const deleteHistoryButton = document.querySelector("#delete");

// Nyckeln som historiken sparas under i localStorage
const STORAGE_KEY = "studentcards";

// Array som används för felmeddelanden
let errors = [];

// Array som innehåller sparade studentkort
let history = [];

/**
 * Validerar formulärets inmatning.
 * @returns {boolean}
 */
function validateForm() {

    errors =[];
    // Läs in värdena från formuläret och trimma bort eventuella mellanslag.
    const fullname = fullnameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();

    // Kontrollera formulärets obligatoriska fält
    if (fullname === "") {
        errors.push("Namn är obligatoriskt.");
    }
    if (email === "") {
        errors.push("E-post är obligatoriskt.");
    }
    if (phone === "") {
        errors.push("Telefon är obligatoriskt.");
    }

    // Visa eventuella felmeddelanden
    displayErrors();

    // Returnera resultatet (true eller false) av valideringen
    return errors.length === 0;
}


/**
 * Visar felmeddelanden på sidan.
 */
function displayErrors() {
    // Rensa tidigare felmeddelanden
    errorList.innerHTML = "";

    // Skriv ut aktuella felmeddelanden till DOM
    errors.forEach(function (error) {
        const li = document.createElement("li");
        li.textContent = error;
        errorList.appendChild(li); 
    });
}


/**
 * Skapar ett studentkort och visar det på sidan.
 */
function createStudentCard() {
    // Hämta information från formuläret
    const card ={
        fullname: fullnameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        font: fontSelect.value
    };

    // Uppdatera studentkortet
    previewFullname.textContent = card.fullname;
    previewEmail.textContent = card.email;
    previewPhone.textContent = card.phone;
    previewFullname.style.fontFamily = card.font;
    previewEmail.style.fontFamily = card.font;
    previewPhone.style.fontFamily = card.font;

    // Lägg till studentkortet i historiken
    history.unshift(card);

    // Spara och uppdatera historiken
    saveHistory();
    renderHistory();
}


/**
 * Sparar historiken i localStorage.
 */
function saveHistory() {
    // Spara history i localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}


/**
 * Läser in tidigare historik från localStorage.
 */
function loadHistory() {
    // Hämta eventuell sparad historik
    const savedHistory = localStorage.getItem(STORAGE_KEY);

    // Uppdatera history

    if (savedHistory) {
    history = JSON.parse(savedHistory);
    }
}


/**
 * Visar historiken på sidan.
 */
function renderHistory() {
    // Rensa tidigare visad historik
    historySection.innerHTML = "";

    // Skriv ut innehållet i history till DOM
    history.forEach(function (card) {
        const article = document.createElement("article");
        article.style.fontFamily = card.font;

        const name = document.createElement("p");
        name.textContent = card.fullname;

        const email = document.createElement("p");
        email.textContent = card.email;

        const phone = document.createElement("p");
        phone.textContent = card.phone;

        article.appendChild(name);
        article.appendChild(email);
        article.appendChild(phone);

        historySection.appendChild(article);
    });
}


/**
 * Rensar formulär, aktuellt studentkort och felmeddelanden.
 */
function clearForm() {
    // Återställ formulär och studentkort
    form.reset();
    previewFullname.textContent = "Namn";
    previewEmail.textContent = "E-post";
    previewPhone.textContent = "Telefon";

    previewFullname.style.fontFamily = "";
    previewEmail.style.fontFamily = "";
    previewPhone.style.fontFamily = "";

    // Rensa eventuella felmeddelanden
    errors = [];
    displayErrors();
}


/**
 * Raderar hela historiken.
 */
function deleteHistory() {
    // Radera sparad historik
    localStorage.removeItem(STORAGE_KEY);

    // Uppdatera history och visningen på sidan
    history = [];
    renderHistory();
}


// Eventlyssnare

// När formuläret skickas:
// - validera inmatningen
// - skapa studentkort om valideringen lyckas
form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (validateForm()) {
        createStudentCard();
    }
});


// När användaren klickar på "Rensa"
clearButton.addEventListener("click",clearForm);

// När användaren klickar på "Radera historik"
deleteHistoryButton.addEventListener("click", deleteHistory);

// När sidan laddas:
// - läs in och visa eventuell tidigare historik
window.addEventListener("load", function() {
    loadHistory();
    renderHistory();
});