# Samandari API Documentation

This API powers Samandari, an educational platform designed by Jodick Ndayisenga(currently studying Computer Science, kenya), Paul Claudel Izabayo (currently studying Computer Science at Carleton College, USA), Richard Mugisha (studying Computer Engineering in Ghana), and a team of students from USIU. Our mission is to equip Burundian students with the digital resources, collaborative study tools, and a community-driven knowledge-sharing network.

## Table of Contents

- [Project Overview](#project-overview)
- [Core Features](#core-features)
- [Folder Structure](#folder-structure)
- [Installation and Setup](#installation-and-setup)
- [API Endpoints](#api-endpoints)
  - [User Management](#user-management)
  - [Educational Resources](#educational-resources)
  - [Study Room Management](#study-room-management)
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
- `Collaborative Learning in Technology`: Designed to introduce and foster interest in fields like programming, web development, and computer science for Burundian students, where these fields are still emerging.

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