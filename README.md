# Travel Memory Log ✈️

<img width="576" alt="Travel Memory Log Logo" src="https://github.com/user-attachments/assets/e4a250d1-6b01-4526-beba-3328db80d4bd" />

## Table of Contents
- [Description](#description)
- [Features](#features)
- [Technologies](#technologies)
- [Usage](#usage)
- [Installation](#installation)
- [Configuration](#configuration)



## Description
Travel Memory Log is a web application that allows users to document and organize their travel experiences. Users can create trip entries with details like locations, descriptions, and images, then share memories with others through comments.

## Features
- **User Authentication**: Secure registration and login system
- **Trip Management**: Create, read, update, and delete travel memories
- **Image Integration**: Add images to trips via URLs
- **Comment System**: Share thoughts on trips
- **Responsive Design**: Works on desktop and mobile devices
- **Organized View**: Trips categorized by date and location

## Technologies
**Frontend:**
- EJS (Embedded JavaScript templates)
- CSS3
- Vanilla JavaScript

**Backend:**
- Node.js
- Express.js

**Database:**
- MongoDB
- Mongoose ODM

**Other Tools:**
- Bcrypt (password hashing)
- Express-session (authentication)
- Dotenv (environment variables)

##🚀 Usage

- Register a new account or login with existing credentials

- Click "New Trip" to add a travel memory

- Fill in trip details: title, location, date, and description

- Add one or more image URLs to document your trip visually

- View all trips in your personal dashboard

- Click on a trip to view details or leave comments

## Installation
1. Clone the repository:
```bash
git clone https://github.com/HaiderMarhoon/Trive.git
cd trive
```
2. Install dependencies:
``` bash
npm install
```
3. Start the development server:
``` bash
npm start
```
4. Open your browser and visit:
📍 http://localhost:3000

##🛠️ Configuration
In your .env file, make sure to define the following:
``` init
PORT=3000
MONGODB_URI=mongodb://localhost:27017/travel-memory-log
SESSION_SECRET=your-secret-key-here
```



