var express = require("express"); 
var router = express.Router(); 

router.get("/auth", (req, res) => { 
    console.log(req.oidc.isAuthenticated());
    console.log(JSON.stringify(req.oidc.user))
    res.json({
        title : "Language Chatbot",
        isAuthenticated : req.oidc.isAuthenticated(), 
        user : req.oidc.user
    }); 
})  

router.get('/status', (req, res) => {
    res.send(
      req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out'
    )
  });



module.exports = router;