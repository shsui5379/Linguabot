# /server/database/UserDatabase.ts

## Synopses
Wraps around Sequelize. Has User Model to perform userdata related database operations. Look up and produces User objects, syncs updates, creates new Users, etc. 

## Procedures
- connect to db and verify connection
- define model that can house a User instance
- set up relationships to Note and Conversation instances (post-MVP stretch goal)
- export select functions

## Exported Functions
- fetchUser(userId: string): User | null
  - return the associated User if found
- createUser(userId: string, firstName: string, lastName: string, sourceLanguage: Language, targetLanguages[]: Language): [user: User, alreadyExists: bool]
  - attempts to create the user and return it. If it already exists, will return the preexiting User and notify via alreadyExists

## Noteworthy comment
- Sequelize's native returns an instance of UserDatabase representing a database entry of the User. The produced User object will store it as a private member so that the User instance can write to/from the database.