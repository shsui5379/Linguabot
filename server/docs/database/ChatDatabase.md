# /server/database/ChatDatabase.md

## Synopses
Sequelize model for database operations for chat history

# Model
Each Chat shall have:
- an id to represent the Chat: primary key connecting to Message
- the id of the User it belongs to: foreign key connecting from User
- language that the Chat is in