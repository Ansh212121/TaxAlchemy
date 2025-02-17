# TaxAlchemy

TaxAlchemy is a modern web application designed to simplify tax calculations and record management. With a sleek, dark-themed interface and secure authentication powered by Clerk, TaxAlchemy enables users to effortlessly compute their tax liability and keep track of their tax history.

---
## Preview
![Screenshot 2025-02-17 145743](https://github.com/user-attachments/assets/fb75d272-c772-4fcf-a131-ccaf6bf5f023)
![Screenshot 2025-02-17 145815](https://github.com/user-attachments/assets/42d109a7-18ef-40a4-9eef-ca48a3e2f108)
![Screenshot 2025-02-17 145822](https://github.com/user-attachments/assets/243d4364-61c9-4d47-be2f-2b42fe2799d2)
![Screenshot 2025-02-17 145831](https://github.com/user-attachments/assets/cf6c9da2-d1a1-44c9-9e44-132e8ed0a31e)






## Features

- **Effortless Tax Calculation:** Quickly compute your tax liability based on your financial details.
- **Secure Authentication:** Uses Clerk for robust sign-up, sign-in, and session management.
- **Tax History:** View and store past tax calculations.
- **Modern, Dark-Themed UI:** A refined, glassmorphic design that works beautifully on both mobile and desktop.

---

## Project Structure

This project is organized as a monorepo with two main parts:

- **Frontend:** Built with React (using Vite) and styled with Tailwind CSS.
- **Backend:** A Node.js/Express server that uses MongoDB for data storage and Clerk for authentication.

 
## Installation

### Prerequisites

- Node.js 
- npm or yarn
- MongoDB instance (local or MongoDB Atlas)
- Clerk account for authentication

## Backend Setup

1. Navigate to the `backend` folder:
   cd backend
### Install dependencies
 npm install
 ### Create a .env file in the backend folder with the following variables
 MONGO_URI=mongodb+srv://your_username:your_password@cluster0.mongodb.net/TaxDB
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key
PORT=5710
### Start the backend server:
npm start


## Frontend Setup
### Navigate to the frontend folder:
 cd frontend
### Install dependencies
 npm install
 ### Create a .env file in the frontend folder with:
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
VITE_API_BASE_URL=http://localhost:5710
 ### Start the frontend development server
 npm run dev




