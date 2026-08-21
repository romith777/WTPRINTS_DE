# 🏢 WTPRINTS-DE: Full-Stack Merchant Control Plane

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

**Live Demo:** [wtprints-de.vercel.app](https://wtprints-de.vercel.app/)

WTPRINTS-DE serves as the comprehensive **Vendor Management System** for the WTPRINTS e-commerce platform. Unlike a simple backend microservice, this repository contains a **complete full-stack application** featuring a custom-built frontend dashboard and a dedicated Node.js backend. It empowers sellers to securely authenticate, manage product inventory, and synchronize catalog data with the consumer-facing platform.

## 🚀 Architectural Features

### 🖥️ Frontend Architecture (Client-Side)
* **Custom UI Routing:** Engineered with raw HTML5, CSS3, and Vanilla JavaScript, organized into logical views (`/home`, `/login`, `/user`, `/productSinglePage`) without the overhead of heavy frameworks.
* **Client-Side State Management:** Utilizes secure Session/LocalStorage APIs to maintain merchant authentication state and UI preferences.
* **Asynchronous API Integration:** Uses the Fetch API for non-blocking REST calls to the backend, enabling seamless catalog updates and file uploads.

### ⚙️ Backend Architecture (Server-Side)
* **RESTful Node.js Backend:** An Express.js server that strictly separates client requests from database mutations, exposing scalable endpoints for merchant operations.
* **Database & Schema Validation:** Leverages MongoDB and Mongoose (`productDBSchema`, `productMainSchema`) to enforce strict data integrity and prevent malformed inventory updates.
* **Distributed Data Synchronization:** Implements robust state-reconciliation logic to ensure that seller-side catalog changes are atomically synced and propagated correctly.
* **File & Asset Management:** Securely handles multipart form data (image/metadata uploads) required for product listings.

## 🧰 Tech Stack
* **Frontend:** HTML5, CSS3, Vanilla JavaScript
* **Backend:** Node.js, Express.js
* **Database:** MongoDB, Mongoose ODM

## 🛠️ Installation & Local Development

This repository contains both the frontend client and the backend server. You will need to run them concurrently.

**1. Clone the Repository**
```bash
git clone https://github.com/romith777/wtprints-de.git
cd wtprints-de
```

**2. Start the Backend Server**
```bash
cd backend
npm install
# Ensure MongoDB is running locally or provide a cloud MONGO_URI in your .env
node server.js
```

**3. Serve the Frontend**
Open a new terminal. You can use any static file server (like VS Code Live Server, or Python's `http.server`) to serve the `frontend/` directory.
```bash
cd frontend
# Example using Python:
python -m http.server 5500
```
Navigate to `http://localhost:5500/login/login.html` to access the merchant console.
