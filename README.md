🌍 Travel Memory Log
<img src="https://github.com/user-attachments/assets/e4a250d1-6b01-4526-beba-3328db80d4bd" width="576" height="409" alt="Travel Memory Log Logo">
📚 Table of Contents
Description

Features

Technologies

Installation

Configuration

Usage

📝 Description
Travel Memory Log is a web application that enables users to document and organize their travel experiences. Users can create detailed trip entries with locations, descriptions, and images, and share memories through comments with others.

✨ Features
🔐 User Authentication: Secure registration and login system

📓 Trip Management: Create, read, update, and delete travel memories

🖼️ Image Integration: Add images to trips via URLs

💬 Comment System: Share thoughts on each trip

📱 Responsive Design: Fully functional on desktop and mobile

🗂️ Organized View: Trips categorized by date and location

🧰 Technologies
Frontend:
EJS (Embedded JavaScript Templates)

CSS3

Vanilla JavaScript

Backend:
Node.js

Express.js

Database:
MongoDB

Mongoose ODM

Other Tools:
Bcrypt – Password hashing

Express-session – Session-based authentication

Dotenv – Environment variable management

⚙️ Installation
Clone the repository:

bash
Copy
Edit
git clone https://github.com/HaiderMarhoon/Trive.git
cd trive
Install dependencies:

bash
Copy
Edit
npm install
Configure environment variables:

bash
Copy
Edit
cp .env.example .env
Edit the .env file and add your own configuration.

Start the development server:

bash
Copy
Edit
npm start
Open your browser and visit:
📍 http://localhost:3000

🛠️ Configuration
In your .env file, make sure to define the following:

ini
Copy
Edit
PORT=3000
MONGODB_URI=mongodb://localhost:27017/travel-memory-log
SESSION_SECRET=your-secret-key-here
🚀 Usage
Register a new account or login with existing credentials

Click "New Trip" to add a travel memory

Fill in trip details: title, location, date, and description

Add one or more image URLs to document your trip visually

View all trips in your personal dashboard

Click on a trip to view details or leave comments

🎒 Capture memories. Share experiences. Explore the world — one trip at a time.
