
# Hour Tracking System

## Overview

The Hour Tracking System is an intuitive web application designed to track and manage employee work hours. This system allows employees to clock in and out, while also providing a visual indication of their current status.

<https://youtu.be/OHfY-uhLNr4>

## Features

### Real-time Clock Display

- Displays the current time in a user-friendly format.
- Updates the time display every second for accuracy.

### Employee Clock-In and Clock-Out

- Allows employees to clock in and clock out.
- Employees enter their first and last names to register their time.

### Dynamic Employee Status Update

- Updates the status of employees in real-time as they clock in or out.
- Visual indication (such as color change) to show if an employee is clocked in or out.

### Error Handling

- Displays error messages for situations like trying to clock in or out without being registered or attempting to clock in when already clocked in.

### Log of Activities

- Keeps a log of all clock-in and clock-out activities.
- Displays a time-stamped entry for each action, providing a clear audit trail.

### User Interface

- A clean and simple interface for ease of use.
- Responsive design for compatibility with various devices.

## Installation

### Prerequisites

Before installing the application, ensure you have Node.js installed on your system. You also need a Google Service Account for interacting with Google Sheets.

### Setting Up a Google Service Account

1. **Create a Google Service Account**:
   - Visit the [Google Cloud Console](https://console.cloud.google.com/).
   - Create a new project or select an existing one.
   - Navigate to "IAM & Admin" > "Service Accounts" and create a new service account.
   - Assign a role that has permissions to access Google Sheets (e.g., Editor).
   - Download the json file containing the keys for your service account. Rename it to key.json and place in the main directory
   - Create a key for the service account in JSON format and download it. This file contains the credentials needed for your application.

2. **Enable Google Sheets API**:
   - In the Google Cloud Console, navigate to "APIs & Services" > "Dashboard".
   - Click on "ENABLE APIS AND SERVICES" and search for the Google Sheets API.
   - Enable the Google Sheets API for your project.

3. **Share Your Google Sheet**:
   - Upload Hour Tracker.xlsx to Sheets
   - Share the sheet with the email address of your Google Service Account (found in the JSON key file).

### Creating a .env File

Create a `.env` file in the root directory of your project and include the following:

- `EMAIL=your_service_account_email`
- `SHEET_ID=your_sheet_id`

To find your Google Sheet ID:

- Open your Google Sheet in a web browser.
- Look at the URL; it will be in the format `https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit`.
- Copy the `[SHEET_ID]` part. This is your Google Sheet ID, which you will place in the .env

### Clone the Repository

- Use `git clone [repository URL]` to clone the project repository.
- Replace `[repository URL]` with the URL where the project is hosted.

### Install Dependencies

- Navigate to the project directory.
- Run `npm install` to install the necessary dependencies.

### Start the Server

- Execute `node server.js` to start the server.
- The server will run on a specified port, which can be set in the server settings.

### Access the Application

- Open a web browser and navigate to `http://localhost:[port]`.
- Replace `[port]` with the port number your server is using.

## Contribution

For contributing to the project, please follow the standard git workflow:

- Fork the repository.
- Create a new branch for your features or fixes.
- Submit a pull request with a clear description of changes.
