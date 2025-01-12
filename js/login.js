"use strict";
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = {
        email: document.getElementById("email")?.value.trim(),
        password: document.getElementById("password")?.value.trim(),
    };
    try {
        const response = await fetch("http://localhost:3000/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erreur de connexion");
        }
        const { token, userId } = await response.json();
        // Stocker le token et l'ID utilisateur
        localStorage.setItem("authToken", token);
        localStorage.setItem("userId", userId.toString());
        alert("Connexion réussie !");
        window.location.href = "dashboard.html"; // Redirige vers le tableau de bord
    }
    catch (error) {
        alert(error.message || "Erreur de connexion");
    }
});
