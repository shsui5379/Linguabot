# tests for POST /api/user
```js
fetch("/api/user", {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
        "Content-Type": "application/json"
    },
    "redirect": "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify({firstName: "S", lastName: "H", sourceLanguage: "English", targetLanguages: ["Spanish"]})
});
```
## Condition: logged in, first ever resgistration: expected result:
```json
{
    "firstName": "S",
    "lastName": "H",
    "userLanguage": "English",
    "targetLanguages": [
        "Spanish"
    ],
    "userId": "auth0|a-unique-identifier"
}
```
## Condition: not logged in: expected results:
```json
{"error":"Not authenticated"}
```
## Condition: logged in, repeated registration, even with different details:
```js
fetch("/api/user", {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
        "Content-Type": "application/json"
    },
    "redirect": "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify({firstName: "Jane", lastName: "Doe", sourceLanguage: "Korean", targetLanguages: ["Mandarin", "Spanish"]})
});
```
expect
```json
{
    "firstName": "S",
    "lastName": "H",
    "userLanguage": "English",
    "targetLanguages": [
        "Spanish"
    ],
    "userId": "auth0|a-unique-identifier"
}
```

## Condition: at least one of the body data is invalid (no name, invalid language, too long name, etc)
expect
```json
{"error":{<the error reason>}}
```

# tests for GET /api/user
```js
fetch("/api/user", {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
        "Content-Type": "application/json"
    },
    "redirect": "follow",
    referrerPolicy: "no-referrer"
});
```
## Condition: user exists:
expect
```json
{
    "firstName": "S",
    "lastName": "H",
    "userLanguage": "English",
    "targetLanguages": [
        "Spanish"
    ],
    "userId": "auth0|a-unique-identifier"
}
```
## Condition: not logged in
expect
```json
{"error":"Not authenticated"}
```
## Condition: user doesn't exist
expect
```json
{"error":"User not found"}
```

# tests for PATCH /api/user
## Condition: updating all properties
```js
fetch("/api/user", {
    method: "PATCH",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
        "Content-Type": "application/json"
    },
    "redirect": "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify({firstName: "John", lastName: "Doe", sourceLanguage: "Mandarin", targetLanguages: ["French", "Japanese"]})
});
```
expect
```json
{
    "firstName": "John",
    "lastName": "Doe",
    "userLanguage": "Mandarin",
    "targetLanguages": [
        "French",
        "Japanese"
    ],
    "userId": "auth0|a-unique-identifier"
}
```
## Condition: not logged in
expect
```json
{"error":"Not authenticated"}
```
## Condition: updating some properties
```js
fetch("/api/user", {
    method: "PATCH",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
        "Content-Type": "application/json"
    },
    "redirect": "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify({firstName: "Jane"})
});
```
expect
```json
{
    "firstName": "Jane",
    "lastName": "Doe",
    "userLanguage": "Mandarin",
    "targetLanguages": [
        "French",
        "Japanese"
    ],
    "userId": "auth0|a-unique-identifier"
}
```
## Condition: updating nothing
```js
fetch("/api/user", {
    method: "PATCH",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
        "Content-Type": "application/json"
    },
    "redirect": "follow",
    referrerPolicy: "no-referrer"
});
```
expect
```json
{
    "firstName": "Jane",
    "lastName": "Doe",
    "userLanguage": "Mandarin",
    "targetLanguages": [
        "French",
        "Japanese"
    ],
    "userId": "auth0|a-unique-identifier"
}
```
## Condition: invalid input (failing validation for a property)
expect
```json
{"error":"Must set at least one target language"} //example sample reason
```
## Condition: user never signed up
expect
```json
{"error":"User not found"}
```