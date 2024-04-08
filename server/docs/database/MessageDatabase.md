# /server/database/MessageDatabase.md

## Synopses
Sequelize model for database operations for messages

# Model
Each Message shall have:
- an id to represent the Message
- chat id as foreign key to Chat
- content
- note
- starred boolean
- human boolean