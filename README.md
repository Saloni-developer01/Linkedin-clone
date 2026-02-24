# LinkedIn Clone . ݁₊ ⊹ . ݁ ⟡ ݁ . ⊹ ₊ ݁.

### Project Title & Description
This project is a full-stack LinkedIn clone built to emulate key functionalities of the popular professional networking platform. Developed using Next.js for the frontend, Node.js and Express.js for the backend, and MongoDB for the database, this application allows users to create accounts, manage profiles, interact with posts, and connect with other users. It serves as a comprehensive demonstration of my full-stack development skills.

### Features ✮⋆˙
* **User Authentication:** Secure Login and Signup functionality.
* **Profile Management:** Users can create and edit their profiles, including personal details and professional information.
* **Post Creation & Management:** Users can create new posts to share updates, articles, or thoughts.
* **Interactive Posts:** Engage with posts through likes, comments, and sharing.
* **Connect with Users:** Ability to connect with other user profiles, similar to LinkedIn's connection feature.
* **Responsive Design:** Optimized for various devices to ensure a seamless user experience.

### Technologies Used
#### Frontend:
* **Next.js:** React framework for server-side rendering and static site generation.

#### Backend:
* **Node.js:** JavaScript runtime environment.
* **Express.js:** Web application framework for Node.js.

#### Database:
* **MongoDB:** NoSQL database for flexible data storage.

### Live Demo Link ⋆✴︎˚｡⋆
#### Explore the live version of the LinkedIn Clone here:
[https://linkedin-clone-seven-dusky.vercel.app/](https://linkedin-clone-seven-dusky.vercel.app/)

---

## Run via Docker 🐳

If you have Docker installed, you can get the project running locally in minutes without setting up the entire development environment.

### 1. Clone the Repository
First, clone the project to your local machine:
```bash
git clone https://github.com/Saloni-developer01/Linkedin-clone.git
cd Linkedin-clone
```

### 2. Setup Environment Variables 🔑
Create a file named .env in the root directory (where the docker-compose.yml file is located) and add your credentials:
```bash 
# MongoDB Atlas Connection String
MONGO_URI=your_mongodb_atlas_connection_string

# Port for Backend
PORT=9090

# Essential for Docker Networking
NEXT_LOCAL_BACKEND_URL=http://localhost:9090
```

### 3. Launch the Application
Run the following command to start the containers:
```bash
docker-compose up
```

Once the process finishes, you can access the app at:

* **Frontend**: http://localhost:3000

* **Backend API**: http://localhost:9090


### 4. Docker Hub Images 📦
The images will be automatically pulled from my Docker Hub:

* Frontend: saloniyadav29/linkedinclone-frontend

* Backend: saloniyadav29/linkedinclone-backend