# College Event Management System

A comprehensive platform for managing college events with advanced features including user registration, QR code check-ins, and AI-powered attendance prediction.

## Features

- **Event Management**
  - Create, update and delete events
  - Categorize events by type
  - Set capacity limits and registration deadlines

- **User System**
  - Role-based access control (Admin/User)
  - Secure authentication with JWT

- **Registration & Check-in**
  - Event registration with confirmation
  - QR code generation for attendees
  - Easy check-in process via QR code scanning

- **AI-Powered Predictions**
  - Predict event attendance based on historical data
  - Identify events needing more promotion
  - Feature-based analysis of event popularity factors

- **Bug Reporting System**
  - Allow users to report issues
  - Track and manage bug resolution

 - **Email Notifications**
  - Event registration confirmations
  - Reminder emails before events
  - Custom HTML email templates
  - Asynchronous email delivery 

## Tech Stack

- **Frontend**:TO BE FILLED
- **Backend**: FastAPI, SQLAlchemy, PostgreSQL
- **ML Components**: scikit-learn, pandas
- **Authentication**: JWT tokens
- **Testing**: pytest
- **DevOps**: TO BE FILLED


## Setup Instructions

### Prerequisites
- Python 3.8+
- PostgreSQL
- pip

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/college_event_management_system.git
   cd college_event_management_system

2.Create a virtual environment
python -m venv venv
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate

3.Install dependencies
pip install -r backend/requirements/dev.txt

4.Configure environment variables
cp backend/.env.example backend/.env

5.Setup the database
cd backend
setup_db.bat

6.Initialize the application
python startup.py

7.Run the development server
uvicorn app.main:app --reload