# Spotify App

## Project Overview

This project is a full-stack web application that integrates with the Spotify Web API to allow users to authenticate using their Spotify account, search for artists, tracks, and albums, and save favorites to a database.

The backend is built with Node.js and Express, handles Spotify OAuth authentication, manages JWT-based session persistence, and stores user data and favorites in MongoDB Atlas.
The frontend (React) provides the user interface for authentication and interacting with Spotify data.

## Core features

Spotify OAuth login (Authorization Code Flow)

Secure JWT-based session persistence

Backend API proxy for Spotify Web API requests

MongoDB storage for users and saved favorites

RESTful API architecture (models, controllers, routes)

Separation of frontend and backend concerns

## Prerequisites

To run this project locally, you will need:

Node.js (LTS version recommended)

npm (comes with Node.js)

MongoDB Atlas account (free tier is sufficient)

Spotify account (free or premium)

Spotify Developer account with a registered OAuth application

A modern web browser (Chrome, Firefox, or Edge recommended)

## Getting Started

Clone the Repository

```bash
git clone https://github.com/Baca-Micah-FS/Portfolio-3.git
```

## Install Dependencies

Server

```bash
cd server
```

Client

```bash
cd client
```

### Server dependencies used:

express

cors

cookie-parser

dotenv

mongoose

axios

jsonwebtoken

nodemon (development)

## Start the application

Server

```bash
npm run dev
```

Client

```bash
npm run dev
```
