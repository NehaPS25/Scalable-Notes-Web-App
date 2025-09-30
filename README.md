# Scalable-Notes-Web-App

This is a Scalable Notes Web App built for the Frontend Developer Intern assignment.
The app includes user authentication, a dashboard, and CRUD operations for notes. It demonstrates responsive design, API integration, and basic security features.

Tech Stack
Frontend: React.js, Bootstrap
Backend: Python Flask API
Database: MySQL

Authentication: JWT-based login & registration (via API)
Notes Storage: LocalStorage used for CRUD operations (create, read, update, delete)
APIs Used: Registration and Login

Features
Authentication
Register/Login: Users can sign up and log in via API; JWT token stored in localStorage.
Protected Routes: Dashboard accessible only after login.
Logout: Clears token from Api and redirects to login page.

Dashboard & Notes
Create Notes: Add new notes (title + body) and display instantly.
Edit Notes: Update existing notes.
Delete Notes: Remove notes from localStorage.
Search/Filter: Filter notes by title or body content.

Instant Display: Notes appear immediately after creation or edit.
APIs Used
POST /register – User registration

Screenshot:

### Dashboard
[Dashboard]<img width="1847" height="818" alt="dashboard" src="https://github.com/user-attachments/assets/24b1c283-b1a8-4ae8-9ce0-06fb460990c0" />

[ON Dashboard Action Perform] <img width="1792" height="841" alt="dashboard2" src="https://github.com/user-attachments/assets/12aa214d-ae15-43d6-9a96-4024c7338690" />

### Login Page
[Login]<img width="1092" height="746" alt="login" src="https://github.com/user-attachments/assets/03cf982f-65ac-4613-9a14-74cba2090d30" />
<img width="1006" height="687" alt="login2" src="https://github.com/user-attachments/assets/820731b4-3abb-4940-8423-283c378ef629" />


### Registration Page
[Registraion]<img width="1063" height="698" alt="Register" src="https://github.com/user-attachments/assets/82e885ad-2904-467e-9b6b-ef65f1a0fc27" />


POST /login – User login, returns JWT token

Note: All CRUD operations for notes are done locally using localStorage for simplicity, while authentication interacts with the Flask API.
