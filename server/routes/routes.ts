const UserDatabase = require("../database/UserDatabase");
const express = require("express"); 
const bodyParser = require("body-parser");
const router = express.Router(); 

router.use(bodyParser.json()) 

let names = []; 
let language = []; 
let sourceLanguage = "English"; 

//gets user information after they log in
router.get("/auth", (req, res) => { 
    res.json({
        userId : req.oidc.user.sub, 
        firstName : names[0], 
        lastName : names[1], 
        sourceLanguage : sourceLanguage, 
        targetLanguage : language,
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
  names.push(firstName, lastName);
  res.json({ 
    'firstName' : firstName, 
    'lastName' : lastName,
  });
}); 


// POST route to handle incoming language data
router.post('/targetLanguage', (req, res) => {
  const targetLanguage = req.body.targetLanguage;
  language.push(targetLanguage)
  res.json({ 
    'targetLanguage' :  targetLanguage 
  });
});  

/**
 * Create a new User
 */
router.post("/api/user", async (req, res) => {
  if (!req.oidc.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
  }

  let result;

  try {
      result = await UserDatabase.createUser(req.oidc.user.sub, names[0], names[1], sourceLanguage, language);
  } catch (e) {
      return res.status(422).json({ error: e });
  }

  if (!result[1]) { // already existing user
      return res.status(409).json(result[0].toJSON());
  }

  return res.status(201).json(result[0].toJSON());
}); 



module.exports = router;