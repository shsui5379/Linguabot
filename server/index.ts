// attributions:
// starter code from https://leejjon.medium.com/create-a-react-app-served-by-express-js-node-js-and-add-typescript-33705be3ceda

import express from "express";
import path from "path";

import authRouter from "./routes/auth";
import chat from "./routes/chat";
import user from "./routes/user";

import Database from "./database/Database";

import "dotenv/config";

const app = express();
const { auth, requiresAuth } = require('express-openid-connect');
const boolParser = require("express-query-boolean");

app.set('view engine', 'ejs');

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: process.env.BASEURL,
    clientID: process.env.CLIENTID,
    issuerBaseURL: process.env.ISSUERBASEURL,
};

(async () => {
    await Database.initialize();
})();

app.use(auth(config));
app.use(express.json());
app.use(boolParser());
app.use('/', authRouter);
app.use("/api/chat", chat);
app.use("/api/user", user);

app.use(express.static(path.join(__dirname, '../client/build')));

// This code makes sure that any request that does not matches a static file
// in the build folder, will just serve index.html. Client side routing is
// going to make sure that the correct content will be loaded.
app.use((req, res, next) => {
    if (/(.ico|.js|.css|.jpg|.png|.map)$/i.test(req.path)) {
        next();
    } else {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    }
});

// Start the server 
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});