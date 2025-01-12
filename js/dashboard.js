document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) {
        alert("Veuillez vous connecter !");
        window.location.href = "index.html";
        return;
    }
    const taskContainer = document.getElementById("taskList");
    const modal = document.getElementById("taskModal");
    const openModalButton = document.getElementById("openModalButton");
    const logoutButton = document.getElementById("logoutButton");
    const taskForm = document.getElementById("taskForm");
    // Ouvrir et fermer le modal
    openModalButton?.addEventListener("click", () => {
        modal?.classList.add("active");
    });
    modal?.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("active");
        }
    });
    const cancelModalButton = document.getElementById("cancelModalButton");
    cancelModalButton?.addEventListener("click", () => {
        modal?.classList.remove("active");
    });
    // Déconnexion
    logoutButton?.addEventListener("click", () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userId");
        window.location.href = "login.html";
    });
    // Soumission du formulaire
    taskForm?.addEventListener("submit", async (event) => {
        event.preventDefault();
        const taskData = {
            title: document.getElementById("title")?.value.trim(),
            description: document.getElementById("description")?.value.trim(),
            deadline: document.getElementById("deadline")?.value.trim(),
            userId: Number(userId),
        };
        try {
            const response = await fetch("http://localhost:3000/api/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(taskData),
            });
            if (response.ok) {
                alert("Tâche ajoutée !");
                modal?.classList.remove("active");
                await fetchTasks();
            }
            else {
                alert("Erreur lors de l'ajout de la tâche");
            }
        }
        catch (error) {
            console.error("Erreur :", error);
        }
    });
    async function fetchTasks() {
        try {
            const response = await fetch(`http://localhost:3000/api/tasks/${userId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const tasks = await response.json();
                renderTasks(tasks);
            }
            else {
                alert("Erreur lors du chargement des tâches");
            }
        }
        catch (error) {
            console.error("Erreur :", error);
        }
    }
    function renderTasks(tasks) {
        if (!taskContainer)
            return;
        const pendingColumn = document.getElementById("pendingTasks");
        const completedColumn = document.getElementById("completedTasks");
        if (pendingColumn)
            pendingColumn.innerHTML = "<h2>Tâches en attente</h2>";
        if (completedColumn)
            completedColumn.innerHTML = "<h2>Tâches terminées</h2>";
        tasks.forEach((task) => {
            const taskHTML = `
        <div class="task">
          <h3>${task.title}</h3>
          <p>${task.description}</p>
          <p>Échéance : ${new Date(task.deadline).toLocaleDateString()}</p>
          ${task.status === "pending"
                ? `<button onclick="markAsCompleted(${task.id})">Valider</button>
                 <button class="delete" onclick="deleteTask(${task.id})">Supprimer</button>`
                : "<p>Status : Validée</p>"}
        </div>
      `;
            if (task.status === "pending") {
                if (pendingColumn)
                    pendingColumn.innerHTML += taskHTML;
            }
            else {
                if (completedColumn)
                    completedColumn.innerHTML += taskHTML;
            }
        });
    }
    // Charger les tâches au démarrage
    await fetchTasks();
    window.markAsCompleted = async function (taskId) {
        try {
            const response = await fetch(`http://localhost:3000/api/tasks/${taskId}/complete`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                alert("Tâche validée !");
                await fetchTasks();
            }
            else {
                alert("Erreur lors de la validation de la tâche");
            }
        }
        catch (error) {
            console.error("Erreur :", error);
        }
    };
    window.deleteTask = async function (taskId) {
        try {
            const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                alert("Tâche supprimée !");
                await fetchTasks();
            }
            else {
                alert("Erreur lors de la suppression de la tâche");
            }
        }
        catch (error) {
            console.error("Erreur :", error);
        }
    };
});
export {};
