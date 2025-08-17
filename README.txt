# Tech Team Management — MERN HR System #

An enterprise-level **Tech Company Human Resource Management** system built with the **MERN** stack (MongoDB, Express, React, Node.js). 
Designed to streamline HR workflows in technical organizations, this app supports manager/team management and structured data 
flows—as outlined in the included architectural diagrams.

##  Project Structure

TechTeamManagement_MERN_APP/
├── Schemas/                         # Mongoose models for data structures
├── routes/                          # Express routes (e.g., manager registration)
├── scripts/                         # Utility or migration scripts
├── backups/                         # Backup data or DB exports
├── index.js                         # Entry point of the server application
├── package.json                     # Project dependencies and scripts
├── .env (ignored)                   # Environment variables
├── HeirarchicalStructureOfTheData.drawio.png  # Logical data model diagram
└── TechTeamManagement_DFD_Level1_Refined.png  # Data flow diagram


##  Features & Components

- **User Management**: Add managers via REST endpoints (e.g., `/manager-register`) with 
fields like name, email, phone, department, and team ID.
- **Structured Data Flow**: Visualized via the included `.drawio` and DFD diagrams, 
clarifying how data moves between components.
- **Flexibility for Expansion**: The scaffolding is 
ready for additional features like team handling, authentication, or front-end integration.

##  Setup & Installation

1. **Clone the repo**
     ```bash
     git clone https://github.com/Aditya792max/TechTeamManagement_MERN_APP.git
     cd TechTeamManagement_MERN_APP

2. Install dependencies
     npm install


3. Configure Enviornnment
     npm run dev 

4. Run the server
     node index

5. Test The APIs
     Use Postman or similar tools to send a 
     POST request to http://localhost:<PORT>/manager-register with JSON body:
     { 
          "mName": "Jane Doe",
          "mEmail": "jane.doe@example.com",
          "mPhone": "9876543210",
          "mDepartment": "Engineering",
          "mTeamId": "Team42"
     }




Visual Diagrams Included
	•	Hierarchical Structure of the Data: Shows relationships and organization of data models.
	•	Data Flow Diagram (Level 1): Illustrates system input/output flow and module interactions.

Include these in presentations or documentation to explain system design intuitively.

Next Steps & Enhancements
	•	Add frontend integration (React) to provide UI for CRUD operations and dashboards.
	•	Implement authentication, such as JWT or OAuth, for secure access.
	•	Build out additional schemas and routes: teams, employees, departments, etc.
	•	Add validation (e.g., express-validator) to ensure complete request bodies and data integrity.
	•	Integrate logging, error handling middleware, and testing for robustness.

     Contributing

Feel free to contribute to this project! Fork the repo, make your changes, and submit a pull request.
Feedback and collaboration are welcome.

