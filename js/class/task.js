import { PrismaClient } from "@prisma/client";
export class Tasks {
    constructor() {
        this.prisma = new PrismaClient();
    }
    /**
     * Crée une nouvelle tâche
     * @param task - Objet contenant les informations de la tâche
     * @returns La tâche créée
     */
    async addTask(task) {
        try {
            const newTask = await this.prisma.tasks.create({
                data: {
                    ...task,
                    deadline: new Date(task.deadline),
                },
            });
            return { ...newTask, status: newTask.status ?? "pending" };
        }
        catch (error) {
            console.error("Error creating task:", error);
            throw new Error("An error occurred while creating the task");
        }
    }
    /**
     * Récupère toutes les tâches d'un utilisateur
     * @param userId - ID de l'utilisateur connecté
     * @returns Liste des tâches de l'utilisateur
     */
    async getTasks(userId) {
        try {
            const tasks = await this.prisma.tasks.findMany({
                where: { user_id: userId },
            });
            return tasks.map(task => ({ ...task, status: task.status ?? "pending" }));
        }
        catch (error) {
            console.error("Error fetching tasks:", error);
            throw new Error("An error occurred while fetching tasks");
        }
    }
    /**
     * Marque une tâche comme terminée
     * @param taskId - ID de la tâche
     * @returns La tâche mise à jour
     */
    async markTaskAsCompleted(taskId) {
        try {
            const task = await this.prisma.tasks.update({
                where: { id: taskId },
                data: { status: "completed" },
            });
            return { ...task, status: task.status ?? "pending" };
        }
        catch (error) {
            console.error("Error updating task status:", error);
            throw new Error("An error occurred while updating the task");
        }
    }
    /**
     * Supprime une tâche par son ID
     * @param taskId - ID de la tâche
     * @returns La tâche supprimée
     */
    async removeTask(taskId) {
        try {
            const task = await this.prisma.tasks.delete({
                where: { id: taskId },
            });
            return { ...task, status: task.status ?? "pending" };
        }
        catch (error) {
            console.error("Error deleting task:", error);
            throw new Error("An error occurred while deleting the task");
        }
    }
}
