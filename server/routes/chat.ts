import OpenAI from "openai";
import { default as UserDatabase } from "../database/UserDatabase";
const express = require('express');
const router = express.Router();
require("dotenv").config();

const openai_client: OpenAI = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Make sure that incoming requests are authorized
router.use((req, res, next) => {
    if (req.oidc.isAuthenticated()) {
        next();
    }
    else {
        res.send("Unauthorized access");
    }
});

// For getting the preferences of a user (i.e native language, language being learned, etc)
router.get("/preferences", (req, res) => {
    UserDatabase.fetchUser(req.oidc.user.sub).then((user) => {
        res.json({
            userLanguage: user.userLanguage,
            targetLanguages: user.targetLanguages
        });
    });
});

// Returns a ChatMessage object as the response
router.post("/send", (req, res) => {
    openai_client.chat.completions.create({
        messages: req.body,
        model: "gpt-3.5-turbo"
    }).then((completions) => {
        res.json(completions.choices[0].message);
    });
});

module.exports = router;