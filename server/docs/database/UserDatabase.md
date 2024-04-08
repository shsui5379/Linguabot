# /server/database/UserDatabase.ts

## Synopses
Wraps around Sequelize. Has User Model to perform userdata related database operations. Look up and produces User objects, syncs updates, creates new Users, etc. 

## Procedures
- connect to db and verify connection
- define model that can house a User instance
- set up relationships to Chat and Message instances
- export select functions

# Model
Each User shall have:
- an id: primary key to Chats
- firstName
- lastName
- targetLanguages array
- userLanguage

## Exported Functions
- ALL ARE ASYNC!!!
- fetchUser(userId: string): User | null
  - return the associated User if found
- createUser(userId: string, firstName: string, lastName: string, userLanguage: Language, targetLanguages[]: Language): [user: User, newlyCreated: bool]
  - attempts to create the user and return it. If it already exists, will return the preexiting User and notify via newlyCreated = 0
- initialize(): void
  - initializes database connections and model
- close(): void
  - closes database connections

## Noteworthy comment
- Sequelize's native returns an instance of UserDatabase representing a database entry of the User. The produced User object will store it as a private member so that the User instance can write to/from the database.