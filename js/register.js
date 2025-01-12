"use strict";
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registerForm"); // Formulaire d'inscription
    if (!form) {
        console.error("Le formulaire 'registerForm' est introuvable !");
        return;
    }
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = {
            firstname: document.getElementById("firstname")?.value.trim() || "",
            lastname: document.getElementById("lastname")?.value.trim() || "",
            email: document.getElementById("email")?.value.trim() || "",
            password: document.getElementById("password")?.value.trim() || "",
        };
        // Validation des champs
        if (!formData.firstname || !formData.lastname || !formData.email || !formData.password) {
            alert("Tous les champs sont requis.");
            return;
        }
        // Vérification du format de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert("Adresse email invalide.");
            return;
        }
        try {
            const response = await fetch("http://localhost:3000/api/users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (response.ok) {
                alert(`Inscription réussie avec l'ID : ${result.userId}`);
                window.location.href = "login.html";
            }
            else {
                alert(result.message || "Erreur lors de l'inscription");
            }
        }
        catch (error) {
            console.error("Erreur lors de l'inscription :", error);
            alert("Impossible de traiter votre demande. Veuillez réessayer plus tard.");
        }
    });
});
