# Linguabot - A Language Chatbot

## Description
Web app that makes use of a Large Language Model (LLM) as a chatbot to help users practice languages through conversation. Also provides other learning amenities such as note-taking.

## Technologies Used
- React.js: client-side framework
- Express.js: server-side framework
- OpenAI GPT 3.5 Turbo: LLM used for chatbot and translation features
- PostgreSQL: Relational database
- Sequelize: Object Relational Mapper (ORM), to OOP-ify SQL
- auth0: authentication provider
- WebSpeech API: provides text-to-speech and speech recognition, built in to browsers as part of the modern web standard

## Packages Used
Detailed list of npm packages used on the client-side are listed in `/client/package.json`, and on the server-side are listed in `/server/package.json`.

Below are some notable packages:

### Client-side
- various `fontawasome` packages: stylistic libraries such as icon packs
- various typing packages: TypeScript type definitions for packages
- `react` (plus its various sub-packages): the React.js client-side framework, and its subfeatures
- `typescript`: transpiler for TypeScript code into runnable JavaScript code

### Server-side
- various typing packages: TypeScript type definitions for packages
- `dotenv`: loads private keys from `.env` file to the runtime environment
- `express`: Express.js server-side framework
- `express-openid-connect`: middleware to connect auth0 authentication systems with Express.js-based servers
- `jest`: automated testing system
- `openai`: library for interacting with OpenAI's APIs
- `pg` (and related): PostgreSQL drivers for Node.js
- `sequelize`: ORM
- `typescript`: transpiler for TypeScript code into runnable JavaScript code
- `uuid`: unique ID generator

## Dependencies
- Node.js program: JavaScript runtime to host the app
  - https://nodejs.org/
- A PostgreSQL server & it's access credentials: to hold persistent data
  - https://www.postgresql.org/download/
- OpenAI GPT 3.5 Turbo API keys: to access the LLM
  - https://openai.com/api/
- An auth0 tenant and it's access details: to connect with authentication
  - https://auth0.com/
- A web browser

## Installation/Configuration
1. Obtain the resources described in the Dependencies section
2. Clone the repository
3. At the root directory of the local clone, run `npm run build`
   1. This will install all packages, and compile the code.
   2. Development note: need to rerun after any time a source file (\*.ts/*.tsx) was updated 
4. Create the `/server/.env` file. Define:
   1. `POSTGRES_URL` for the access URL to the database
   2. `SECRET`, `BASEURL`, `CLIENTID`, `ISSUERBASEURL` as provided by auth0's setup
   3. `OPENAI_API_KEY` for the API key for OpenAI GPT access

## Running
1. At the root directory of the local clone, run `npm run start`
2. Open a web browser to http://localhost:8080/
3. Optional: follow your browser's "Install App" prompt to install Linguabot as a Progressive Web App

# Deployment
Deployed with Render at https://linguabot-8m6r.onrender.com/.
1. Create a PostgreSQL server and a Web Service instance
2. Attach auto-deploy listener to a production branch on the repository
3. Populate environment variables in the Web Service's settings
4. Define build script to `npm run build` and start script to `npm run start`
