import express from "express";
const router = express.Router();

import UserDatabase from "../database/UserDatabase";

/**
 * Create a new User
 */
router.post("/", async (req, res) => {
    if (!req.oidc.isAuthenticated()) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    let result;

    try {
        result = await UserDatabase.createUser(req.oidc.user.sub, req.body.firstName, req.body.lastName, req.body.sourceLanguage, req.body.targetLanguages);
    } catch (e) {
        return res.status(422).json({ error: e.message });
    }

    if (!result[1]) { // already existing user
        return res.status(409).json(result[0].toJSON());
    }

    return res.status(201).json(result[0].toJSON());
});

/**
 * Get a User
 */
router.get("/", async (req, res) => {
    if (!req.oidc.isAuthenticated()) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    let user;

    try {
        user = await UserDatabase.fetchUser(req.oidc.user.sub);
    } catch (e) {
        return res.status(422).json({ error: e.message });
    }

    if (user === null) {
        return res.status(404).json({ error: "User not found" });
    }

    return res.json(user.toJSON());
});

export default router;