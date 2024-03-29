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