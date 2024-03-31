## Environment Variables
Environment variables are configured in the .env files. To view routes, callbacks and other info visit Auth0, everyone has access to it

## Authentication with Open ID Connect by Auth0 
Routing information is stored in routes/routes.js, although we can move it all into server.ts if we want to (if it is cleaner)
Once a user logs in, open server and go to http://localhost:8080/auth to get the JSON information of the user. 

## Example content if user is logged in: 
{"title":"Language Chatbot","isAuthenticated":true,"user":{"sid":"EXAMPLE","nickname":"JOHNDOE","name":"JOHNDOE@gmail.com","picture":"EXAMPLE.png","updated_at":"2024-03-17T15:42:51.472Z","email":JOHNDOE@gmail.com","email_verified":true,"sub":"auth0|EXAMPLE"}} 

## Example content is user is not logged in: 
{"title":"Language Chatbot","isAuthenticated":false}

