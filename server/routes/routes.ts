const express = require("express"); 
const bodyParser = require("body-parser");
const router = express.Router(); 

router.use(bodyParser.json()) 

let names = []; 
let language = [];

//gets user information after they log in
router.get("/auth", (req, res) => { 
    res.json({
        userId : req.oidc.user.sub, 
        names, 
        language,
    }); 
})  

//checks to see if a user  is logged in or not
router.get('/status', (req, res) => {
    res.send(
      req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out'
    )
  });

// POST route to handle incoming name data
router.post('/names', (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName; 
  // Store the received names
  names.push({ firstName, lastName });
  res.json({ 
    'firstName' : firstName, 
    'lastName' : lastName,
  });
}); 

router.get('/names', (req, res) => {
  res.json(names);
}); 

// POST route to handle incoming language data
router.post('/targetLanguage', (req, res) => {
  const targetLanguage = req.body.targetLanguage;
  language.push({targetLanguage})
  res.json({ 
    'targetLanguage' :  targetLanguage 
  });
}); 

router.get('/targetLanguage', (req, res) => {
  res.json(language);
});


module.exports = router;