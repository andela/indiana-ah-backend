[![Build Status](https://travis-ci.org/andela/indiana-ah-backend.svg?branch=staging)](https://travis-ci.org/andela/indiana-ah-backend)
[![Coverage Status](https://coveralls.io/repos/github/andela/indiana-ah-backend/badge.svg?branch=staging)](https://coveralls.io/github/andela/indiana-ah-backend?branch=staging)
[![Reviewed by Hound](https://img.shields.io/badge/Reviewed_by-Hound-8E64B0.svg)](https://houndci.com)

Authors Haven - A Social platform for the creative at heart.

## Vision

Create a community of like minded authors to foster inspiration and innovation
by leveraging the modern web.

## Click here to access the app [Authors Haven](https://indiana-ah-staging.herokuapp.com/)

## API Spec

The preferred JSON object to be returned by the API should be structured as follows:

### Users (for authentication)

```source-json
{
  "user": {
    "email": "jake@jake.jake",
    "token": "jwt.token.here",
    "username": "jake",
    "bio": "I work at statefarm",
    "image": null
  }
}
```

### Profile

```source-json
{
  "profile": {
    "name": "Jake Ryan",
    "username": "jake",
    "email": "jakeryan@gmail.com",
    "bio": "I work at statefarm",
    "imageUrl": "image-link",
    "createdAt": "2019-02-06"
  }	  
}	
```

### Single Article

```source-json
{
  "article": {
    "slug": "how-to-train-your-dragon",
    "title": "How to train your dragon",
    "description": "Ever wonder how?",
    "body": "It takes a Jacobian",
    "tagList": ["dragons", "training"],
    "createdAt": "2016-02-18T03:22:56.637Z",
    "updatedAt": "2016-02-18T03:48:35.824Z",
    "favorited": false,
    "favoritesCount": 0,
    "author": {
      "username": "jake",
      "bio": "I work at statefarm",
      "image": "https://i.stack.imgur.com/xHWG8.jpg",
      "following": false
    }
  }
  "timeToRead": "1 min read"
}
```

### Multiple Articles

```source-json
{
  "articles":[{
    "slug": "how-to-train-your-dragon",
    "title": "How to train your dragon",
    "description": "Ever wonder how?",
    "body": "It takes a Jacobian",
    "tagList": ["dragons", "training"],
    "createdAt": "2016-02-18T03:22:56.637Z",
    "updatedAt": "2016-02-18T03:48:35.824Z",
    "favorited": false,
    "favoritesCount": 0,
    "author": {
      "username": "jake",
      "bio": "I work at statefarm",
      "image": "https://i.stack.imgur.com/xHWG8.jpg",
      "following": false
    }
  }, {

    "slug": "how-to-train-your-dragon-2",
    "title": "How to train your dragon 2",
    "description": "So toothless",
    "body": "It a dragon",
    "tagList": ["dragons", "training"],
    "createdAt": "2016-02-18T03:22:56.637Z",
    "updatedAt": "2016-02-18T03:48:35.824Z",
    "favorited": false,
    "favoritesCount": 0,
    "author": {
      "username": "jake",
      "bio": "I work at statefarm",
      "image": "https://i.stack.imgur.com/xHWG8.jpg",
      "following": false
    }
  }],
  "articlesCount": 2
}
```

### Single Comment

```source-json
{
  "comment": {
    "id": 1,
    "createdAt": "2016-02-18T03:22:56.637Z",
    "updatedAt": "2016-02-18T03:22:56.637Z",
    "body": "It takes a Jacobian",
    "author": {
      "username": "jake",
      "bio": "I work at statefarm",
      "image": "https://i.stack.imgur.com/xHWG8.jpg",
      "following": false
    }
  }
}
```

### Multiple Comments

```source-json
{
  "comments": [{
    "id": 1,
    "createdAt": "2016-02-18T03:22:56.637Z",
    "updatedAt": "2016-02-18T03:22:56.637Z",
    "body": "It takes a Jacobian",
    "author": {
      "username": "jake",
      "bio": "I work at statefarm",
      "image": "https://i.stack.imgur.com/xHWG8.jpg",
      "following": false
    }
  }],
  "commentsCount": 1
}
```

### List of Tags

```source-json
{
  "tags": [
    "reactjs",
    "angularjs"
  ]
}
```

### Errors and Status Codes

If a request fails any validations, expect errors in the following format:

```source-json
{
  "errors":{
    "body": [
      "can't be empty"
    ]
  }
}
```

### Other status codes:

401 for Unauthorized requests, when a request requires authentication but it isn't provided

403 for Forbidden requests, when a request may be valid but the user doesn't have permissions to perform the action

404 for Not found requests, when a resource can't be found to fulfill the request

## Endpoints:

### Authentication:

`POST /api/v1/login`

Example request body:

```source-json
{
  "email": "jake@jake.jake",
  "password": "jakejake"
}
```

No authentication required, returns a User

Required fields: `email`, `password`

### Registration:

`POST /api/v1/register`

Example request body:

```source-json
{
  "username": "Jacob",
  "email": "jake@jake.jake",
  "password": "jakejake"
  
}
```

No authentication required, returns a User

Required fields: `email`, `username`, `password`

### Reset Password:

`POST /api/v1/users/reset-password`

Example request body:

```source-json
{
  "password": "jake1234"
  
}
```

Authentication required, returns a message whether successful or not

Required fields: `password`

### Get All Users

`GET /api/v1/profiles`

Authentication required, returns all Users

### Update User Profile

`PATCH api/v1/profiles/:username/update`

Example request body:

```source-json
{	
  "name": "Cim News",
  "bio": "I like to skateboard",
  "username": "cim"
}	
```

Authentication required, returns the Updated User

Accepted fields: `name`, `username`, `bio`

### Delete User Profile

`DELETE api/v1/profiles/:username`

Authentication required, deletes a user's profile/account

### Get Profile

`GET /api/v1/profiles/:username`

 Authentication required, returns a Profile

### Update User Picture

 `PATCH api/v1/profiles/image`

Authentication required, returns an updated Picture

No additional parameters required

### Follow and Unfollow user

`POST /api/v1/profiles/:username/follow`

Authentication required, returns a Profile

No additional parameters required

### List Articles

`GET /api/v1/articles`

Returns most recent articles globally by default, provide `tag`, `author` or `favorited` query parameter to filter results

Query Parameters:

Filter by tag:

`?tag=AngularJS`

Filter by author:

`?author=jake`

Favorited by user:

`?favorited=jake`

Limit number of articles (default is 20):

`?limit=20`

Offset/skip number of articles (default is 0):

`?offset=0`

Authentication optional, will return multiple articles, ordered by most recent first

### Feed Articles

`GET /api/articles/feed`

Can also take `limit` and `offset` query parameters like List Articles

Authentication required, will return multiple articles created by followed users, ordered by most recent first.

### Get Article

`GET /api/v1/articles/:slug`

No authentication required, will return single article

### Create Article

`POST /api/v1/articles`

Example request body:

```source-json
{
  "articleTitle": "How to train your dragon",
  "articleBody": "You have to believe",
  "image": ( image file chosen ),
  "tagList": ["reactjs", "angularjs", "dragons"]
}
```

Authentication required, will return an Article

Required fields: `articleTitle`, `articleBody`

Optional fields: `tagList`, `image` as an array of Strings and file


### Update Article

`PUT /api/v1/articles/:slug`

Example request body:

```source-json
{
  "articleTitle": "How to train your dragon",
  "articleBody": "You have to believe",
  "image": ( image file chosen ),
  "tagList": ["reactjs", "angularjs", "dragons"]
}
```

Authentication required, returns the updated Article

Optional fields: `articleTitle`, `articleBody`, `image`, `tagList`

### Update Article Picture

`PUT /api/v1/articles/:slug/image`

Example request body:

```source-json
{
  "image": ( file chosen ),
}
```

Authentication required, returns the updated Article Picture

Optional fields: `image`


### Like, Unlike, Dislike an Article

`POST /api/v1/articles/:slug/reaction`

Example request body:

```source-json
{
  "reactionType": "like"
}
```

Authentication required, returns a message that Reaction created, updated or deleted.

Required field: `reactionType`


### Delete Article

`DELETE /api/v1/articles/:slug`

Authentication required


### Add Comments to an Article

`POST /api/v1/articles/:slug/comments`

Example request body:

```source-json
{
  "comment": {
    "body": "His name was my name too."
  }
}
```

Authentication required, returns the created Comment
Required field: `body`

### Get Comments from an Article

`GET /api/v1/articles/:slug/comments`

Authentication optional, returns multiple comments

### Delete Comment

`DELETE /api/v1/articles/:slug/comments/:id`

Authentication required

### Favorite Article

`POST /api/v1/articles/:slug/favorite`

Authentication required, returns the Article
No additional parameters required

### Unfavorite Article

`DELETE /api/v1/articles/:slug/favorite`

Authentication required, returns the Article

No additional parameters required

### Get Tags

`GET /api/tags`

Highlight and comment on an article POST /api/v1/articles/:slug/highlights
Edit highlight and comment on an article PATCH /api/v1/articles/:slug/highlights
Delete highlight and comment on an article DELETE /api/v1/articles/:slug/highlights/:id
Get highlight and comment on an article GET /api/v1/articles/:slug/highlights
### Highlight and Comment on an Article

`POST /api/v1/articles/:slug/highlights`

Example request body:

```source-json
{	
   "highlight": "chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words",
   "comment": "This is working fine for me is this really for"
}	
```

### Edit Highlight and Comment on an Article

`PATCH /api/v1/articles/:slug/highlights/:id`

Example request body:

```source-json
{	
   "highlight": "chunks as necessary, making this the first true generator on the Internet",
   "comment": "This is working fine for me is this really for"
}	
```

### Delete Highlight and Comment on an Article

`DELETE /api/v1/articles/:slug/highlights/:id`


### Get Highlight and Comment on an Article

`GET /api/v1/articles/:slug/highlights`

Example request body:

```
[
{	
   "highlight": "chunks as necessary, making this the first true generator on the Internet",
   "comment": "This is working fine for me is this really for"
},
{	
   "highlight": "chunks as necessary, making this the first true generator on the Internet",
   "comment": "This is working fine for me is this really for"
}	
]
```

<hr>

You can access the app here https://indiana-ah-staging.herokuapp.com/