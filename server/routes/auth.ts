const express = require("express");
const router = express.Router(); 

router.get("/auth", (req, res) => {
  console.log(req.oidc.isAuthenticated());
  console.log(JSON.stringify(req.oidc.user))
  res.json({
    title: "Language Chatbot",
    isAuthenticated: req.oidc.isAuthenticated(),
    user: req.oidc.user
  });
}) 

router.get("/signup", (req, res) => {
  res.oidc.login({ 
    returnTo : '/name', 
    authorizationParams: { 
      screen_hint: 'signup'
    },
  });
});

router.get('/status', (req, res) => {
  res.send(
    req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out'
  )
});


export default router;