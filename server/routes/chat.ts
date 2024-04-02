import OpenAI from "openai";
import UserDatabase from "../database/UserDatabase";
require("dotenv").config();

const router = require("express").Router();
const OpenAIClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Make sure that incoming requests are authorized
router.use((req, res, next) => {
    if (req.oidc.isAuthenticated()) {
        next();
    }
    else {
        res.status(401).send("Unauthorized access");
    }
});

// Get a response for a conversation
// Refer to https://platform.openai.com/docs/guides/error-codes/api-errors for error codes
router.post("/send", async (req, res, next) => {
    let completions;
    try {
        completions = await OpenAIClient.chat.completions.create({
            messages: req.body,
            model: "gpt-3.5-turbo"
        });
    }
    catch (error) {
        next(error);
    }
    res.json(completions.choices[0].message);
});

export default router;