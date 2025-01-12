import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
// Charge les variables d'environnement
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "secret_key";
export class User {
    constructor() {
        this.prisma = new PrismaClient();
    }
    /**
     * Enregistre un nouvel utilisateur
     * @param firstname - Prénom de l'utilisateur
     * @param lastname - Nom de famille de l'utilisateur
     * @param email - Adresse email
     * @param password - Mot de passe brut
     * @returns ID de l'utilisateur enregistré
     */
    async registerUser(user) {
        // Validation des champs
        if (!user.firstname || !user.lastname || !user.email || !user.password) {
            throw new Error("All fields are required");
        }
        // Vérifier le format de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(user.email)) {
            throw new Error("Invalid email format");
        }
        // Vérification si l'utilisateur existe déjà
        const existingUser = await this.prisma.users.findUnique({
            where: { email: user.email },
        });
        if (existingUser) {
            throw new Error("Email already in use");
        }
        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(user.password, 10);
        // Création de l'utilisateur
        const newUser = await this.prisma.users.create({
            data: {
                ...user,
                password: hashedPassword,
            },
        });
        return newUser.id;
    }
    /**
     * Connecte un utilisateur et génère un token JWT
     * @param email - Adresse email
     * @param password - Mot de passe brut
     * @returns Token JWT
     */
    async loginUser(credentials) {
        // Vérifier si l'utilisateur existe
        const user = await this.prisma.users.findUnique({
            where: { email: credentials.email },
        });
        if (!user) {
            throw new Error("Invalid credentials");
        }
        // Vérifier la validité du mot de passe
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid credentials");
        }
        // Générer le token JWT avec userId et email
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: "1h",
        });
        // Retourner le token et l'userId
        return { token, userId: user.id };
    }
}
