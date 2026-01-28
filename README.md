# MediaHub App

## Project Overview

This project is a full-stack web application that integrates with Google OAuth and a third-party movie API (TMDB) to allow users to authenticate using their Google account, search for movies, and save titles to a personal watchlist.

The backend is built with Node.js and Express, handles Google OAuth authentication, manages session-based login persistence and JWT issuance, refreshes Google access tokens when needed, and stores user data and saved movies in MongoDB Atlas.
The frontend (React) provides the user interface for authentication, searching media, and managing a watchlist.

## Core features

Google OAuth login (Authorization Code Flow)

Session-based authentication with MongoDB session store

JWT creation and validation for application use

Google access token refresh using stored refresh tokens

Backend API proxy for TMDB movie searches

MongoDB storage for users and saved watchlist items

RESTful API architecture (models, controllers, routes)

Protected backend routes requiring authentication

Watchlist add/remove functionality

Toast notifications for user feedback

Responsive media card layout

Separation of frontend and backend concerns

## Prerequisites

To run this project locally, you will need:

Node.js (LTS version recommended)

npm (comes with Node.js)

MongoDB Atlas account (free tier is sufficient)

Google account

Google Cloud project with OAuth credentials

TMDB API key

A modern web browser (Chrome, Firefox, or Edge recommended)

## Getting Started

Clone the Repository

```bash
git clone https://github.com/Baca-Micah-FS/Portfolio-3.git
```

## Server dependencies used:

express

cors

cookie-parser

dotenv

mongoose

axios

jsonwebtoken

express-session

connect-mongo

nodemon (development)

Start the application

## Server

```bash
cd server
npm install
npm run dev
```

## Client

```bash
cd client
npm install
npm run dev
```
