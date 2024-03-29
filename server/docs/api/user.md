# /server/routes/user.ts

## Synopsis
API to communicate about basic user data

## Methods
- POST /api/user
  - purpose: creates a new User
  - request body shall have: firstName, lastName, sourceLanguage, targetLanguages
  - if !req.oidc.isAuthenticated(): status 401 (not authorized)
  - UserDatabase.createUser().  use req.oidc.user.sid for userId
  - if createUser() throws an error: status 422 (unprocessable content) and return reason as response
  - if createUser() reports that a user with that userId already exists: status 409 (conflict) and return the existing (was returned) User.toJSON()'s content as response
  - new user successfully created: status 201 (created) and return the User.JSON()'s content as response
- GET /api/user
  - purpose: gets a User
  - if !req.oidc.isAutenticated(): status 401 (not authorized)
  - UserDatabase.fetchUser().  use req.oidc.user.sid for userId
  - if fetchUser() throws an error: status 422 (unprocessable content) and return reason as response
  - if fetchUser() returned null: status 404 (not found).  suggested client-side behavior: direct user to setup flow
  - if fetchUser() is success: return User.JSON()'s content as response body
- PATCH /api/user
  - purpose: modifies a User
  - request body shall have: only the fields (firstName, lastName, sourceLanguage, targetLanguages) that needs to be updated
  - if !req.oidc.isAuthenticated(): status 401 (not authorized)
  - UserDatabase.fetchUser().  use req.oidc.user.sid for userId
  - if fetchUser() is null or throws: status 404 (not found)
  - compare the request body content and make updates to the User properties that differs from the request
  - if it throws along that process: status 422 (unprocessable content) and return reason as response
  - if successful: return User.JSON() content as response
- DELETE /api/user
  - purpose: deletes a User
  - if !req.oidc.isAuthenticated(): status 401 (not authorized)
  - UserDatabase.fetchUser().  use req.oidc.user.sid for userId
  - if fetchUser() is null or throws: status 404 (not found)
  - User.delete()
  - and also whatever auth0 needs to do to delete
  - if it throws along the process: status 422 (unprocessable content) and return reason as response
  - if successful: status 200 (all ok)

## Common workflow
- registration
  - client sends user to auth0 registration, auth0 sends them back (notifying client that it was a registration)
  - client presents Linguabot registration flow
  - upon completion of our form, POST a new User via API
  - on a successful scenario, a client-side User object is initialized based on the response body
- login
  - client sends user to auth0 login, auth0 sends them back
  - client GET the User via API
  - on a successful scenario, a client-side User object is initialized based on the response body
- client-side User object is modified
  - client PATCH the change via API
  - (if it's a deletion request: DELETE via API)