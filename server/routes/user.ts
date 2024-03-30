import express from "express";
const router = express.Router();

import UserDatabase from "../database/UserDatabase";

/**
 * Create a new User
 * 
 * Input: firstName, lastName, sourceLanguage, targetLanguages from body
 *        userId from req.oidc.user.sub
 * Output: toJSON() output of resulting user
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
 * 
 * Input: userId from req.oidc.user.sub
 * Output: toJSON() output of resulting user
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

/**
 * Updates a User
 * 
 * Input: firstName, lastName, sourceLanguage, targetLanguages from body
 *        remark: may omit properties that don't need to be updated
 *        userId from req.oidc.user.sub
 * Output: toJSON() content of resulting user
 */
router.patch("/", async (req, res) => {
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

    try {
        if (req.body.hasOwnProperty("firstName") && req.body.firstName !== user.firstName) {
            await user.setFirstName(req.body.firstName);
        }

        if (req.body.hasOwnProperty("lastName") && req.body.lastName !== user.lastName) {
            await user.setLastName(req.body.lastName);
        }

        if (req.body.hasOwnProperty("sourceLanguage") && req.body.sourceLanguage !== user.sourceLanguage) {
            await user.setUserLanguage(req.body.sourceLanguage);
        }

        if (req.body.hasOwnProperty("targetLanguages") && JSON.stringify(req.body.targetLanguages) !== JSON.stringify(user.targetLanguages)) {
            await user.setTargetLanguages(req.body.targetLanguages);
        }
    } catch (e) {
        return res.status(422).json({ error: e.message });
    }

    return res.json(user.toJSON());
});

/**
 * Deletes a User
 * 
 * Input: userId from req.oidc.user.sub
 */
router.delete("/", async (req, res) => {
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

    try {
        await user.delete();

        // todo for @kevinfASC6: insert whatever needed for auth0 side
    } catch (e) {
        return res.status(422).json({ error: e.message });
    }

    return res.sendStatus(200);
});

export default router;