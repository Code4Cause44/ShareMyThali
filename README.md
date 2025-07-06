# 🍽️ ShareMyThali: Bridging Surplus Food with Those in Need

## A Platform for Food Donation and Request Management

ShareMyThali is a web application designed to combat food waste and hunger by connecting individuals and organizations with surplus food to NGOs and charities in need. Our platform facilitates seamless food donations and requests, ensuring that nutritious food reaches those who need it most, efficiently and hygienically.

---

## 📋 Table of Contents

1.  [About the Project](#about-the-project)
2.  [Features](#features)
3.  [Technologies Used](#technologies-used)
4.  [Getting Started](#getting-started)
    * [Prerequisites](#prerequisites)
    * [Installation](#installation)
    * [Environment Variables](#environment-variables)
    * [Running the Application](#running-the-application)
5.  [Usage](#usage)
6.  [Future Enhancements](#future-enhancements)

---

## 💡 About the Project

In a world where food waste is rampant and hunger persists, ShareMyThali aims to be a digital bridge. Our mission is to create a low-waste food-sharing ecosystem where excess food from homes and businesses can be easily donated, and verified NGOs can efficiently request and receive it. We prioritize food safety, transparency, and a smooth user experience to maximize impact.

---

## ✨ Features

### Core Functionality:
* **User Authentication & Authorization:** Secure registration and login for different user roles (Donors, Organizations, Admin).
* **Role-Based Access Control (RBAC):**
    * **Donors:** Can register, log in, and create food donation listings.
    * **Organizations (NGOs/Charities):** Can register, log in, browse available food donations, and submit requests.
    * **Admin:** (Future expansion for full management).
* **Food Donation Form:** Intuitive form for donors to list food details (type, cuisine, quantity, preparation time, hygiene, allergens, pickup time).
* **Available Donations Listing:** A dedicated page for organizations to view all currently available food donations.
* **Food Request System:** Organizations can request specific quantities of food from available donations.
* **My Donations Dashboard:** Donors can view and manage the status of their own donations.
* **My Requests Dashboard:** Organizations can view the status of their submitted food requests.
* **Real-time Pickup Tracking (Simulated):** A countdown timer for estimated rider arrival after a donation is submitted.
* **Impact Statistics:** Displays real-time metrics on total donations, servings, and lives impacted.
* **Theme Toggle:** Light and Dark mode support for a personalized viewing experience.
* **Chatbot Integration:** Provides quick answers and assistance to users.
* **Map Component:** Visualizes pickup locations for donations.

### Technical Highlights:
* Secure password hashing using `bcryptjs`.
* JSON Web Token (JWT) for stateless authentication.
* Protected API routes with role-based middleware.
* Client-side form validation for a better user experience.

---

## 🛠️ Technologies Used

**Backend (Node.js/Express):**
* **Node.js:** JavaScript runtime environment.
* **Express.js:** Web application framework for Node.js.
* **MongoDB:** NoSQL database for flexible data storage.
* **Mongoose:** ODM (Object Data Modeling) library for MongoDB and Node.js.
* **`bcryptjs`:** For hashing and salting passwords securely.
* **`jsonwebtoken` (JWT):** For creating and verifying authentication tokens.
* **`dotenv`:** For loading environment variables from a `.env` file.
* **`cors`:** Middleware for enabling Cross-Origin Resource Sharing.

**Frontend (React):**
* **React.js:** JavaScript library for building user interfaces.
* **React Router DOM:** For declarative routing in React applications.
* **Context API:** For global state management (authentication).
* **HTML5 & CSS3:** For structuring and styling the web pages.
* **JavaScript (ES6+):** Core language for frontend logic.

---

## 🚀 Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

* **Node.js** (LTS version recommended) & **npm** (comes with Node.js) or **Yarn**.
    * [Download Node.js](https://nodejs.org/en/download/)
* **MongoDB:**
    * [Install MongoDB Community Server](https://docs.mongodb.com/manual/installation/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd ShareMyThali
    ```

2.  **Install Backend Dependencies:**
    ```bash
    cd backend
    npm install
    # or yarn install
    ```

3.  **Install Frontend Dependencies:**
    ```bash
    cd ../frontend # Navigate back to root, then into frontend
    npm install
    # or yarn install
    ```

### Environment Variables

You need to create `.env` files for both your backend and frontend.

  **Backend `.env` file:**
    * Create a file named `.env` in the `backend` directory.
    * Add the following variables:
        ```env
        MONGO_URI=mongodb://localhost:27017/sharemythali # Or your MongoDB Atlas connection string
        PORT=5000
        JWT_SECRET=YOUR_VERY_STRONG_AND_RANDOM_SECRET_KEY_HERE # Generate a long, random string
        ```

### Running the Application

1.  **Start the MongoDB Server:**
    * If running locally, ensure your MongoDB daemon (`mongod`) is running.
    * If using MongoDB Atlas, ensure your cluster is accessible.

2.  **Start the Backend Server:**
    * Open a new terminal.
    * Navigate to the `backend` directory:
        ```bash
        cd backend
        ```
    * Start the server:
        ```bash
        npm start
        # or node server.js
        ```
    * You should see `MongoDB connected` and `Server running on port 5000` in the console.

3.  **Start the Frontend Development Server:**
    * Open another new terminal.
    * Navigate to the `frontend` directory:
        ```bash
        cd frontend
        ```
    * Start the React app:
        ```bash
        npm start
        # or yarn start
        ```
    * This will typically open your application in your browser at `http://localhost:3000`.

---

## 📝 Usage

1.  **Register:**
    * Navigate to `/register`.
    * Choose your role: "Food Donor" or "Receiving Organization".
    * Fill in the required details and register.
2.  **Login:**
    * Navigate to `/login`.
    * Enter your registered email and password to log in.
3.  **Donate Food (Donors):**
    * After logging in as a "Donor", navigate to `/donate`.
    * Fill out the donation form with details about your surplus food.
4.  **Request Food (Organizations):**
    * After logging in as an "Organization", navigate to `/request`.
    * Browse available food donations and submit requests for the quantity you need.
5.  **My Donations (Donors):**
    * Navigate to `/my-donations` to view and manage your submitted donations.
6.  **My Requests (Organizations):**
    * Navigate to `/my-requests` to view the status of your organization's food requests.

---

## 🛣️ Future Enhancements

 Here are some key features we have planned for future development to make it even more robust and advanced:

* **Donor/Organization Dashboards:** Enhanced dashboards with detailed views, filtering, and actions (e.g., donors accepting/rejecting requests, organizations cancelling requests).
* **Real-time Notifications:** Implement WebSockets to notify donors of new requests and organizations of request status changes.
* **Location-Based Matching:** Allow organizations to filter donations by proximity to their location.
* **User Profile Management:** Enable users to update their personal/organization details.
* **Review and Rating System:** Allow users to rate each other to build trust and accountability.
* **Admin Panel:** A dedicated interface for administrators to manage users, donations, and requests across the platform.
* **Automated Reminders:** Implement scheduled tasks for pickup reminders or donation expiration.
* **Deployment:** Deploy the full-stack application to cloud platforms (e.g., Render, Vercel, MongoDB Atlas).
* **Advanced UI/UX:** Further polish the user interface with animations, improved feedback, and accessibility features.
