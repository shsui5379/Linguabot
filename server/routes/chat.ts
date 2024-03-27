import OpenAI from "openai";
import { default as UserDatabase } from "../database/UserDatabase";
const express = require('express');
const router = express.Router();
require("dotenv").config();

const openai_client: OpenAI = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Make sure that incoming requests are authorized
router.use(async (req, res, next) => {
    let response = await fetch("/auth", req);
    if (response.isAuthenticated) {
        req.user = response.user;
        next();
    }
    else {
        res.send("Unauthorized access");
    }
});

// For getting the preferences of a user (i.e native language, language being learned, etc)
router.get("/preferences", async (req, res) => {
    let user = await UserDatabase.fetchUser(req.user.sid);
    res.json({
        userLanguage: user.userLanguage,
        targetLanguages: user.targetLanguages
    });
});

// For getting a chatbot response
router.post("/send", async (req, res) => {
    let completions = await openai_client.chat.completions.create({
        messages: req.body,
        model: "gpt-3.5-turbo"
    });
    res.json(completions.choices[0].message);
});

module.exports = router;