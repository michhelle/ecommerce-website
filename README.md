# CPS 630: Web Applications - E-Commerce Website

Final project for CPS630.

## Setting up the development server

- **Import the database**: If you haven't already imported the `projectdatabase.sql` into MySQL using phpMyAdmin on this computer, do so now.

### Running Node.js backend:

- **Open a terminal**: In the terminal or command prompt, navigate to the `scs-backend` folder from the project's main directory.
- **Install required modules**: Make sure you have Node.js installed, and then run `npm install` to install the necessary modules.
- **Check MySQL settings**: Verify that the MySQL host, username, and password in the `server.js` file are correct.
- **Start the backend server**: After the modules are installed, start the backend server with the command  `node server.js` (Default port is 3000).

### Running Angulat frontend:

- **Open a terminal**: In the terminal or command prompt, navigate to the `scs-shop` folder from the project's main directory.
- **Install required modules**: Make sure you have Node.js and Angular installed. Then, run `npm install --force` to install the necessary frontend modules.
- ** Ensure the backend is running**: Confirm that the Node.js backend is already up and running.
- **Start the frontend**: Once the backend is running, you can serve the frontend by running `ng serve --proxy-config proxy.config.json` in the terminal.
- **View the frontend**: When the terminal indicates that the frontend has been compiled successfully, you can view it in your web browser at http://localhost:4200.
