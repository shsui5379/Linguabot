const UserDatabase = require("../database/UserDatabase");
const express = require("express"); 
const bodyParser = require("body-parser");
const router = express.Router(); 

router.use(bodyParser.json()) 

//gets user information after they log in
router.get("/auth", (req, res) => { 
    res.json({
        userId : req.oidc.user
    }); 
})  

//checks to see if a user  is logged in or not
router.get('/status', (req, res) => {
    res.send(
      req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out'
    )
  });

/**
 * Create a new User
 */
router.post("/api/user", async (req, res) => {
  if (!req.oidc.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
  }
  console.log(req.body.firstName, req.body.lastName, req.body.sourceLanguage, req.body.targetLanguages); 
  let result; 
  try {
      result = await UserDatabase.createUser(req.oidc.user.sub, req.body.firstName, req.body.lastName, req.body.sourceLanguage, req.body.targetLanguages);
  } catch (e) {
      return res.status(422).json({ error: e });
  } 

  if (!result[1]) { // already existing user
      return res.status(409).json(result[0].toJSON());
  }  

  return res.status(201).json(result[0].toJSON());

});  

router.get('/api/user', (req, res) => {
  res.json({
    userId : req.oidc.user.sub, 
    firstName : req.body.firstName, 
    lastName : req.body.lastName, 
    sourceLanguage : req.body.sourceLanguage, 
    targetLanguages : req.body.targetLanguages,
  })
})
 


module.exports = router;