## WTPRINTS-DE: Seller Management Full Stack - https://wtprints-de.vercel.app/

**WTPRINTS-DE** is the **seller-side application** of the WTPRINTS e-commerce platform.  
It is built using **HTML, CSS, JavaScript (Frontend)** and **Node.js with Express & MongoDB (Backend)**.

This project enables sellers to securely log in, upload and edit product data, and synchronize updates with the buyer-facing website, ensuring consistent product information across the platform.

---

## Features

- **Seller Authentication** – Secure login for sellers with protected routes  
- **Product Upload & Editing** – Add and modify product details with validation  
- **File Management** – Upload and manage product-related files and metadata  
- **Data Synchronization** – Sync seller-side updates to the buyer application  
- **RESTful API Architecture** – Clear separation between seller frontend and backend  
- **Error Handling & Validation** – Prevents incomplete or invalid product updates  
- **Modular Code Structure** – Easy to maintain and extend  

---

## How It Works

### Seller Frontend
Built with **HTML, CSS, and JavaScript**, providing a simple interface for sellers to manage products and initiate synchronization.

### Seller Backend
Developed using **Node.js** and **Express**, handling authentication, product management, and sync logic through REST APIs.

### Database
Uses **MongoDB** with **Mongoose** to store seller accounts, product data, and update information.

### Synchronization
- Seller-side changes are processed and validated on the backend  
- Updates are safely propagated to the buyer application  
- Focuses on data consistency and reliability  

---

## Testing

- Manually tested seller workflows (upload, edit, sync) **100+ times**
- Verified correct behavior for invalid inputs and edge cases
- Focused on reliability and correctness during repeated usage

---

## Tech Stack

**Frontend:** HTML, CSS, JavaScript  
**Backend:** Node.js, Express.js  
**Database:** MongoDB (Mongoose)  
**APIs:** REST APIs, Fetch API  
**Client-side State:** LocalStorage API  

---

## Requirements

- Modern web browser (Chrome, Firefox, Edge)  
- Node.js and npm installed  
- MongoDB running locally or via cloud service  

---

## Notes

- This repository contains **only the seller-side logic**
- Buyer-side website is maintained as a separate project
- LocalStorage is used only for non-sensitive client-side state

---

## License

This project is licensed under the **MIT License**.
