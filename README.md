# 🏢 WTPRINTS-DE: Merchant Control Plane & Data Sync

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

**Live Demo:** [wtprints-de.vercel.app](https://wtprints-de.vercel.app/)

WTPRINTS-DE serves as the **Vendor Management System (Merchant Control Plane)** for the WTPRINTS e-commerce distributed platform. Built with Node.js and MongoDB, this microservice handles secure merchant authentication, complex inventory state management, and critical data synchronization between the seller ecosystem and the consumer-facing frontend.

## 🚀 Architectural Features

* **Distributed Data Synchronization:** Implements a robust state-reconciliation logic to ensure that seller-side catalog updates (pricing, inventory, metadata) are atomically synced to the buyer-facing production database.
* **Secure Auth & Role-Based Access:** Secures merchant endpoints using protected routes, validating payloads and restricting data mutability to authorized vendors.
* **RESTful Microservice Design:** Strictly separates the client interface from backend processing, exposing scalable API endpoints for catalog ingestion and metadata uploads.
* **Validation & Integrity Constraints:** Enforces strict schema validations at the Mongoose (ODM) level to prevent database corruption from malformed merchant inputs.
* **End-to-End Workflow Validation:** Comprehensively validated across hundreds of edge-case scenarios including network interruption, invalid payload structures, and asynchronous file handling.

## ⚙️ Tech Stack

* **Backend Environment:** Node.js, Express.js
* **Database & Data Modeling:** MongoDB, Mongoose (ODM)
* **API Integration:** RESTful architecture, Fetch API
* **Client Interface:** HTML5, CSS3, JavaScript (Vanilla)
* **State Management:** Session/LocalStorage API for non-sensitive UI state

## 🛠️ Installation & Usage

**1. Clone the Service**
```bash
git clone https://github.com/romith777/wtprints-de.git
cd wtprints-de
npm install
```

**2. Configure Environment**
Create a `.env` file at the root to connect the merchant database:
```env
MONGO_URI=mongodb://localhost:27017/wtprints_seller
PORT=3000
SECRET_KEY=your_secure_auth_key
```

**3. Run the Microservice**
```bash
# Start the backend API and serve the merchant console
npm start
```
