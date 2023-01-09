
# Articles VueJs

The purpose of this task is to make sense of and expand the existing knowledge
 of vue.js practically and theoretically. Website has to use [json-server](https://github.com/typicode/json-server), 
 to emulate the API

## Build Setup

Install JSON Server
```
cd json-server/
npm install -g json-server
```

Run JSON Server
```
json-server --watch db.json
```

Install VueJs
```
cd website/
npm install
```
Run VueJs
```
npm run dev
```

## JSON-SERVER database structure
The json-server will have to consist of the following tables:
- Authors
- Articles

The authors table:
| Name     | Type 
|------    |------
|id        | integer
|name      | text
|created_at| datetime
|updated_at| datetime

The articles table:
| Name     | Type 
|------    |------
|id        | integer
|title      | text
|body| text
|author| integer / id from author table
|created_at| datetime
|updated_at| datetime

## Pages
The website must consist of the following pages:

- Post page
- Post detail page

## Functionality
In order to perform the current task, the website must be able to perform the following functionality:

- List of articles must be paginated
- Display messages to user, when no articles were found
- Articles page must have a search functionality
- The list of authors must be static and fetched from json-server
- Modal window must be used to create, edit or delete selected post
- Same modal window must be used for creating, editing and deleting posts
- Editing and deletion must be possible from any page. Both posts list or post detail page
- The message must be shown to user on successful or unsuccessful actions with editing post
- Input must be validated
- Minimal design must be created using [BULMA](https://bulma.io/)
