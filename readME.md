# Samandari API

## Project Description
Samandari is a web application designed to help students in Burundi gain IT skills such as web design, AI, data science, and web development. It also teaches entrepreneurship and many other courses. The platform connects the best teachers with students most in need of these skills and provides a platform to share knowledge. Additionally, Samandari features a library containing school manuals and general books. Schools in Burundi can upload resources such as past papers, exams, and tests for others to refer to when revising or acquiring knowledge.


## Folder Structure
The project has the following folder structure:
- **models**: Contains all object instances.
- **controllers**: Contains functions to handle user requests and web interactions.
- **routes**: Contains all endpoints (e.g., GET, POST, DELETE, PUT).
- **middleware**: Includes functions to protect certain routes and manage sessions and cookies.
- **utils**: Contains necessary configurations such as Cloudinary for media handling, AWS for book storage, and Ably for real-time communication.

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
  - [API Endpoints](#api-endpoints)
- [Contact](#contact)

## Introduction
Samandari API is a powerful backend solution supporting the Samandari application. This API provides endpoints for managing users, courses, library, chats,  and other essential resources, ensuring a seamless experience for users and administrators.

## Features
- User management (registration, authentication, and authorization)
- Course management (creation, updating, and deletion)
- Library management ( reading a book or class manual, updating the library )
- Real time communication (realtime communication )
- Dynamic resource management
- Secure and scalable architecture

## Getting Started

### Prerequisites
Before you start, ensure you have the following installed:
- Node.js (version 18.x.x)
- npm (version 9.x.x) or yarn (version 9.x.x)
- MongoDB for the database

### Installation
1. **Clone the repository:**
    ```bash
    git clone https://github.com/Jodick-Ndayisenga/samandari-api.git
    cd samandari-api
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```
    or
    ```bash
    yarn install
    ```

3. **Set up environment variables:**
   - Create a `.env` file in the root directory and add the required environment variables:
     ```
      cloudName= 
      apiKey= 
      apiSecret=
      DB_URL=
      DB_URL_TESTING=
      MODE_ENV = 
      JWT_SECRET = 
      ABLY_API_KEY = 
      TOKEN_NAME = 
      AWS_KEY=
      AWS_SECRET=
      REGION=
      BUCKET=
      NODE_ENV=

     ```

4. **Start the server:**
    ```bash
    npm start
    ```
    or
    ```bash
    yarn start
    ```

## Usage

### API Endpoints

#### Authentication Routes (`authRout.js`)
- **POST** `/api/verify-token` - Verify user token
- **POST** `/api/login` - Login a user
- **GET** `/api/user-details/:id` - Get user details by ID
- **GET** `/api/logout/:userId` - Logout a user
- **GET** `/api/unread-notifications/:userId` - Get unread notifications for a user
- **GET** `/api/fetch-notifications/:userId` - Fetch notifications for a user
- **POST** `/api/notifications/mark-as-read` - Mark notifications as read
- **PUT** `/api/update/profile/:type/:userId/:field` - Update user profile picture
- **PUT** `/api/update/personal-statement/:id` - Update user personal statement
- **PUT** `/api/update/about-statement/:id` - Update user about statement
- **PUT** `/api/update/add-experience/:userId/:work` - Add work experience for a user
- **PUT** `/api/update/add-education/:userId/:work` - Add education for a user
- **PUT** `/api/add-skill/:id` - Add a new skill
- **POST** `/api/follow-unfollow` - Follow or unfollow a user
- **GET** `/api/get-users/:startIndex/:limit` - Get a list of users
- **GET** `/api/get-users-to-follow/:userId` - Get users to follow
- **POST** `/api/register` - Register a new user
- **POST** `/api/change-password` - Change user password
- **GET** `/api/forgot-password/:email` - Get email for password reset
- **POST** `/api/confirm-email` - Confirm user email
- **GET** `/api/find/:userId` - Find user by ID
- **GET** `/api/findall` - Find all users
- **GET** `/api/get-users-to-share-post/:userId` - Get users to share a post with

#### Message Routes (`messageRoutes.js`)
- **POST** `/api/create-message` - Create a new message
- **GET** `/api/get-messages/:convoId` - Get messages by conversation ID
- **GET** `/api/remove/:messageId` - Remove a message by ID
- **PATCH** `/api/update-message/read/:messageId` - Update message read status
- **PATCH** `/api/update-message/delivered/:messageId` - Update message delivered status
- **POST** `/api/mark-as-read` - Mark messages as read
- **GET** `/api/notifications/unread/:userId` - Get unread messages for a user

#### Post Routes (`postRoutes.js`)
- **POST** `/api/create-post/:theUserId/:fileStatus` - Create a new post
- **POST** `/api/comment` - Comment on a post
- **GET** `/api/get-posts/:userId/:page` - Get posts by user ID and page number
- **GET** `/api/get-comments/:postId/:startIndex/:limit` - Get comments for a post
- **PUT** `/api/:postId/like` - Like a post
- **PUT** `/api/:postId/dislike` - Dislike a post
- **PUT** `/api/comments/dislike/:commentId/:userId` - Dislike a comment
- **PUT** `/api/comments/like/:commentId/:userId` - Like a comment
- **DELETE** `/api/delete-post/:postId` - Delete a post
- **POST** `/api/comment-reply` - Reply to a comment
- **GET** `/api/comment/get-replies/:commentId/:startIndex/:limit` - Get replies to a comment
- **POST** `/api/comment-reply/like` - Like a comment reply
- **POST** `/api/comment-reply/dislike` - Dislike a comment reply
- **PUT** `/api/share-with/:userId/:postId` - Share a post with users
- **PUT** `/api/repost/:userId/:postId` - Repost a post

_For a full list of endpoints and details, please contact me on information below._


## Contact
If you have any questions or feedback, feel free to reach out to the project maintainer:
- **Name:** Jodick Ndayisenga
- **Email:** rajajodick@gmail.com
- **LinkedIn:** [Your LinkedIn Profile](https://www.linkedin.com/in/jodick-ndayisenga-1a9b28240/)
