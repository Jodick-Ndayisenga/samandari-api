# Samandari API Documentation

This API powers Samandari, an educational platform designed by Jodick Ndayisenga(currently studying Computer Science, kenya), Paul Claudel Izabayo (currently studying Computer Science at Carleton College, USA), Richard Mugisha (studying Computer Engineering in Ghana), and a team of students from USIU. Our mission is to equip Burundian students with the digital resources, collaborative study tools, and a community-driven knowledge-sharing network.

## Table of Contents

- [Project Overview](#project-overview)
- [Core Features](#core-features)
- [Folder Structure](#folder-structure)
- [Installation and Setup](#installation-and-setup)
- [API Endpoints](#api-endpoints)
  - [User Management](#user-management)
  - [AWS for Books](#aws-for-books)
  - [Conversations And Study Room Management](#conversations-and-study-room-management)
  - [Messages](#messages)
  - [Posts and Challenges](#posts-and-challenges)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

---
### Project Overview

Samandari is a web platform aimed at supporting the Burundian community, particularly students, by addressing the severe shortage of educational materials. In Burundi, physical textbooks and study materials are scarce, making it challenging for students to access essential resources for their studies. Samandari fills this gap by offering an open digital platform where users can:

1. `Access and Share Educational Resources`: Electronic textbooks, past exams, test papers, and general reading materials on topics like sociology, psychology, business, philosophy, and physics or mathematics.
2. `Collaborate in Study Rooms`: Form study groups and engage in real-time discussions on subjects like mathematics, science, and more.
3. `Post and Solve Challenges`: Users can post puzzles, coding challenges, and assignments, allowing others to discuss and contribute solutions.

Through these features, Samandari encourages collaboration and knowledge-sharing, enhancing educational opportunities for Burundian students and beyond.

---
### Core Features

- `E-Library`: Users can upload, recommend, and access a wide array of electronic textbooks and general reading materials, accessible to everyone on the platform.
- `Study Rooms`: Users can form study groups around subjects and communicate in real-time, enhancing collaborative learning.
- `Posts and Challenges`: Users can post challenges, puzzles, and questions for community engagement. The platform includes an online code editor and compiler to facilitate coding collaboration, allowing users to test solutions directly within the platform.
- `Real-Time Communication`: Follow, message, and collaborate with other users for improved group and individual interaction.
- `Collaborative Learning in Technology`: Designed to introduce and strenghen interest in fields like programming, web development, and computer science for Burundian students, where these fields are still in flux.

---
### Folder Structure

The Samandari API repository is organized into the following folders to keep the codebase clean and easy to navigate:

- `models`: Contains schema and object definitions for key entities (e.g., User, Book, Post).
- `controllers`: Includes functions to handle user requests and interactions with the database.
- `routes`: Defines API endpoints such as GET, POST, PUT, and DELETE to manage resources like users, books, study rooms, and posts.
- `middleware`: Provides functions for route protection, session management, and other security features.
- `utils`: Contains configuration and utilities for third-party services, including:
    - Cloudinary for media handling
    - AWS for book storage
    - Ably for real-time communication


---
### Installation and Setup

Follow these steps to set up the project locally:

1. **Clone the Repository**:
```bash
git clone https://github.com/yourusername/samandari-api.git
cd samandari-api
```

2. **Install Dependencies**:
```bash
npm install
```

3. **Environment Variables**:Set up your `.env` file with the following variables:
```txt
cloudName= YOUR CLOUDINARY CLOUDNAME
apiKey=YOUR CLOUDINARY API KEY
apiSecret=YOUR CLOUDINARY API SECRET
DB_URL= YOUR MONGODB URL FOR PRODUCTION
DB_URL_TESTING= YOUR MONGODB URL FOR TESTING
MODE_ENV = development
JWT_SECRET = YOUR JSON WEBTONTOKEN SECRET
ABLY_API_KEY = YOUR ABLY API KEY
TOKEN_NAME = YOUR JSON_WEBTOKN_NAME
AWS_KEY=YOUR AWS ACCESS KEY
AWS_SECRET= YOUR AMAZON SECRET
REGION=YOUR REGION
BUCKET=YOUR BUCKET
```

4. **Run the Server**:
```bash
npm run dev
```

The API should now be running locally at `http://localhost:3001`

---

### API Endpoints

- Define your root API endpoint
assuming you are using react for your frontend:

```javascript
import axios from "axios";
const API = axios.create({
  baseURL: "http://localhost:3001",
  withCredentials: true,
});
```

### **1. User Management**

Endpoints for managing user registration, login, profile updates, notifications, and follow/unfollow actions.

### ***Endpoints***

**Verify Token**

- URL: `/verify-token`
- Method: `POST`
- Description: Verifies the user's session token.
- Example Request from Frontend:

```javascript
const verifyToken = async (userId) => {
  try {
    const response = await API.post('/user/verify-token', {userId});
    return response.data.valid;

  } catch (err) {
    return false;
  }
};
```


**Login**

- URL: `/login`
- Method: `POST`
- Description: Logs in a user and generates a session token.
- Example Request from Frontend:

```javascript
const userLogin = async ( email, password)=>{
  try {
      const reponse = await API.post(`/user/login`, {email, password});
      return reponse.data;
  } catch (error) {
      console.log(error);
  }
}
```

**Get User Details**

- URL: `/user-details/:id`
- Method: `GET`
- Description: Retrieves a user's profile details.
- Example Request from Frontend:

```javascript
const userLogin = async ( userId)=>{
  try {
      const reponse = await API.get(`/user/user-details`, {userId});
      return reponse.data;
  } catch (error) {
      console.log(error);
  }
}
```

**User Logout**

- URL: `/logout/:userId`
- Method: `GET`
- Description: Logs out a user and removes their session token.
- Example Request from Frontend:

```javascript
const userLogout = async (userId)=>{
  try {
      const reponse = await API.get(`/user/logout/${userId}`);
      return reponse.data;
  } catch (error) {
      console.log(error);
  }
}
```

***... Other endpoints would follow similarly, providing descriptions and frontend request examples for each one.***

### **2. AWS for Books**

### ***Endpoints***

for handling file uploads, listing, downloading, and deletion of resources in AWS.
Endpoints

Upload File

- URL: `/upload/:typeOfResource`
- Method: `POST`
- Description: Uploads a file to AWS and associates it with a specific resource type.
- Example Request:

```javascript
const formData = new FormData();
formData.append("file", selectedFile);
const uploadFile = async (typeOfResource) => {
  try {
    const response = await API.post(`/aws/upload/${typeOfResource}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
}
```

List Files

- URL: `/list`
- Method: `GET`
- Description: Retrieves a list of uploaded files.
- Example Request:

```javascript
const getFileList = async (typeOfResource) => {
  try {
    const response = await API.get(`/aws/list/${typeOfResource}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}
```

### Additional Endpoints

***... Other endpoints would follow similarly, providing descriptions and frontend request examples for each one.***

### **3. Conversations And Study Room Management**

Endpoints for creating conversations, fetching conversations, and managing conversation states.

### ***Endpoints***

Create Message

- URL: `chats/create-chat`
- Method: `POST`
- Description: Creates a new conversation.
- Example Request:

```javascript
const createConversation = async (userId1, userId2) => {
    try {
        const response = await API.post("chats/create-chat", {userId1, userId2});
        return response.data;
    } catch (error) {
        console.error("Error creating conversation", error);
        throw error;
    }
};
```

Get Conversations

- URL: `chats/conversations/:userId`
- Method: `GET`
- Description: Fetches all conversations for a specific user.
- Example Request:

```javascript
const getConversations = async (userId) => {
    try {
        const response = await API.get(`/chats/conversations/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching conversations", error);
        throw error;
    }
};
```

Find Conversation

- URL: `chats/find/:userID1/:userID2`
- Method: `GET`
- Description: Fetches a specific conversation based on user IDs.
- Example Request:

```javascript
const findConversation = async (userId1, userId2) => {
    try {
        const response = await API.get(`/chats/find/${userId1}/${userId2}`);
        return response.data;
    } catch (error) {
        console.error("Error finding conversation", error);
        throw error;
    }
};
```

#### Additional Endpoints

***... Other endpoints would follow similarly, providing descriptions and frontend request examples for each one.***



### **4. Messages**

Endpoints for managing messages in conversations, marking messages as read, and handling notifications.
Endpoints

### **Endpoints**

Create Message

- URL: `/messages/create-message`
- Method: `POST`
- Description: Creates a new message.
- Example Request:

```javascript
const createMessage = async (userId, conversationId, message) => {
    try {
        const response = await API.post("/messages/create-message", { userId, conversationId, message });
        return response.data;
    } catch (error) {
        console.error("Error creating message", error);
        throw error;
    }
};
```

Get Messages

- URL: `/messages/unread-messages/:conversationId/:userId`
- Method: `GET`
- Description: Fetches all messages in a specific conversation.
- Example Request:

```javascript
const getMessages = async (userId, conversationId) => {
    try {
        const response = await API.get(`/messages/get-messages/${userId, conversationId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching messages", error);
        throw error;
    }
};
```

Mark Message as Read

- URL: `/messages/unread-messages/:conversationId/:userId`
- Method: `POST`
- Description: Marks messages as read.
- Example Request:

```javascript
const markMessagesAsRead = async (userId, conversationId) => {
    try {
        const response = await API.post("/messages/mark-as-read", { userId, conversationId });
        return response.data;
    } catch (error) {
        console.error("Error marking messages as read", error);
        throw error;
    }
};
```

### **5. Posts and Challenges**

Endpoints for creating posts, liking/disliking posts and comments, commenting on posts, and managing shares and reposts.

### **Endpoints**

Create Post

- URL: `/posts/create-post/:theUserId/:fileStatus`
- Method: `POST`
- Description: Creates a new post for a user with a specific file status.
- Example Request:

```javascript
const createPost = async (userId, fileStatus, data) => {
    try {
        const response = await API.post(`/posts/create-post/${userId}/${fileStatus}`, data);
        return response.data;
    } catch (error) {
        console.error("Error creating post", error);
        throw error;
    }
};
```

Fetch recent posts

- URL: `/posts/get-posts/:id/:page/fetchedPostIds`
- Method: `GET`
- Description: Fetches recent posts for a user.
- Example Request:

```javascript
const fetchRecentPosts = async (id, page, fetchedPostIds) => {
  try {
    const params = {
      fetchedPostIds: fetchedPostIds.join(','), // Convert list of IDs to a comma-separated string
    };
    const response = await API.get(`/posts/get-posts/${id}/${page}`, {params});
    return response.data;
  } catch (error) {
    console.error('Error fetching recent posts:', error);
    throw error;
  }
};
``` 

Like Post

- URL: `/posts/like/:postId/:userId`
- Method: `POST`
- Description: Likes a post.
- Example Request:

```javascript
const likePost = async (postId, userId) => {
    try {
        const response = await API.post(`/posts/like/${postId}/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error liking post", error);
        throw error;
    }
};
```

Dislike Post

- URL: `/posts/dislike/:postId/:userId`
- Method: `POST`
- Description: Dislikes a post.
- Example Request:

```javascript
const dislikePost = async (postId, userId) => {
    try {
        const response = await API.post(`/posts/dislike/${postId}/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error disliking post", error);
        throw error;
    }
};
```

Comment post

- URL: `/posts/comment/:postId/`
- Method: `POST`
- Description: Comments on a post.
- Example Request:

```javascript
const commentPost = async (postId, userId, comment) => {
    try {
        const response = await API.post(`/posts/comment/${postId}`, { userId, comment });
        return response.data;
    } catch (error) {
        console.error("Error commenting on post", error);
        throw error;
    }
};
``` 

#### Additional Endpoints

***... Other endpoints would follow similarly, providing descriptions and frontend request examples for each one.***

---

### Technologies Used

1. `Backend`: *Node.js, Express*
2. `Database`: *MongoDB*
3. `Cloud Storage`: *AWS, Cloudinary*
4. `Real-Time Communication`: *Ably*
5. `Authentication`: *JSON Web Tokens (JWT)*

---

### Contributing

We welcome contributions to Samandari! To contribute:

- Fork the repository.
- Create a new branch for your feature (`git checkout -b feature-name`).
- Commit your changes (`git commit -m 'Add feature'`).
- Push to the branch (`git push origin feature-name`).
- Submit a pull request for review.

---

## License

This project is licensed under the SAMANDARI License - see the [LICENSE](LICENSE.md) file for details.
