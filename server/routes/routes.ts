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



module.exports = router;