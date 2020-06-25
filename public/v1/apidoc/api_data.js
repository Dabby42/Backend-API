define({ "api": [
  {
    "type": "post",
    "url": "/v1/article",
    "title": "Create Article",
    "name": "Create_Article",
    "group": "Article",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>Article title</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "backgroundImage",
            "description": "<p>Article BackgroundImage</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "image",
            "description": "<p>Article Image</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "content",
            "description": "<p>Article Content Description</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "source",
            "description": "<p>Source of the Article</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "sourceImage",
            "description": "<p>ImageSource of the Article</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./controllers/v1/ArticleController.js",
    "groupTitle": "Article"
  },
  {
    "type": "delete",
    "url": "/v1/article/:id",
    "title": "Delete Article",
    "name": "Delete_Article",
    "group": "Article",
    "version": "0.0.0",
    "filename": "./controllers/v1/ArticleController.js",
    "groupTitle": "Article"
  },
  {
    "type": "get",
    "url": "/v1/article",
    "title": "Get Articles",
    "name": "Get_Articles",
    "group": "Article",
    "version": "0.0.0",
    "filename": "./controllers/v1/ArticleController.js",
    "groupTitle": "Article"
  },
  {
    "type": "get",
    "url": "/v1/article/unpublished",
    "title": "Get Unpublish Articles",
    "name": "Get_Unpublished_Articles",
    "group": "Article",
    "version": "0.0.0",
    "filename": "./controllers/v1/ArticleController.js",
    "groupTitle": "Article"
  },
  {
    "type": "patch",
    "url": "/v1/article/publish/:id",
    "title": "Publish Article",
    "name": "Publish_Article",
    "group": "Article",
    "version": "0.0.0",
    "filename": "./controllers/v1/ArticleController.js",
    "groupTitle": "Article"
  },
  {
    "type": "patch",
    "url": "/v1/article/unpublish/:id",
    "title": "Publish Article",
    "name": "Publish_Article",
    "group": "Article",
    "version": "0.0.0",
    "filename": "./controllers/v1/ArticleController.js",
    "groupTitle": "Article"
  },
  {
    "type": "patch",
    "url": "/v1/article/restore/:id",
    "title": "Restore Article",
    "name": "Restore_Article",
    "group": "Article",
    "version": "0.0.0",
    "filename": "./controllers/v1/ArticleController.js",
    "groupTitle": "Article"
  },
  {
    "type": "post",
    "url": "/o/token",
    "title": "Authenticate User",
    "name": "Authenticate_User",
    "group": "Auth",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>user's email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>user's password</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./controllers/v1/AuthController.js",
    "groupTitle": "Auth"
  },
  {
    "type": "post",
    "url": "v1/auth/o/token",
    "title": "Authenticate User",
    "name": "Authenticate_User",
    "group": "Auth",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "provider",
            "description": "<p>provider name e.g facebook, twitter</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "accessToken",
            "description": "<p>user's accessToken from socials</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./controllers/v1/AuthController.js",
    "groupTitle": "Auth"
  },
  {
    "type": "get",
    "url": "/v1/bookmark",
    "title": "Get Users' Bookmarks",
    "name": "Get_Bookmark",
    "group": "Bookmark",
    "version": "0.0.0",
    "filename": "./controllers/v1/BookmarkController.js",
    "groupTitle": "Bookmark"
  },
  {
    "type": "delete",
    "url": "/v1/bookmark/:id",
    "title": "Remove Bookmark",
    "name": "Remove_Bookmark",
    "group": "Bookmark",
    "version": "0.0.0",
    "filename": "./controllers/v1/BookmarkController.js",
    "groupTitle": "Bookmark"
  },
  {
    "type": "patch",
    "url": "/v1/bookmark/restore/:id",
    "title": "Restore Bookmark",
    "name": "Restore_Bookmark",
    "group": "Bookmark",
    "version": "0.0.0",
    "filename": "./controllers/v1/BookmarkController.js",
    "groupTitle": "Bookmark"
  },
  {
    "type": "get",
    "url": "/v1/bookmark/:id",
    "title": "Create Bookmark",
    "name": "Create_Bookmark",
    "group": "Bookmarks",
    "version": "0.0.0",
    "filename": "./controllers/v1/BookmarkController.js",
    "groupTitle": "Bookmarks"
  },
  {
    "type": "post",
    "url": "/v1/interest",
    "title": "Create Interest",
    "name": "Create_Interest",
    "group": "Interest",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "image",
            "description": "<p>Interest Image</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>Type of the Interest</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./controllers/v1/InterestController.js",
    "groupTitle": "Interest"
  },
  {
    "type": "get",
    "url": "/v1/interest/:id",
    "title": "Get User's Interest",
    "name": "Get_User_s_Interest",
    "group": "Interest",
    "version": "0.0.0",
    "filename": "./controllers/v1/InterestController.js",
    "groupTitle": "Interest"
  },
  {
    "type": "delete",
    "url": "/v1/interest/:id",
    "title": "Remove Interest",
    "name": "Remove_Interest",
    "group": "Interest",
    "version": "0.0.0",
    "filename": "./controllers/v1/InterestController.js",
    "groupTitle": "Interest"
  },
  {
    "type": "patch",
    "url": "/v1/interest/restore/:id",
    "title": "Restore Interest",
    "name": "Restore_Interest",
    "group": "Interest",
    "version": "0.0.0",
    "filename": "./controllers/v1/InterestController.js",
    "groupTitle": "Interest"
  }
] });
