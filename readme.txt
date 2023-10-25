Readme
-------
To run iterations 1&2 (using XAMPP):
- Copy all files from the "project-php" folder into the "htdocs" folder in XAMPP
- Import "projectdatabase.sql" using phpMyAdmin
- The site can now be accessed through localhost or 127.0.0.1

To run iteration 3 (Angular, Node.js, MySQL):
- Please ensure you have Node.js installed on your computer

- First, import "projectdatabase.sql" into a MySQL instance; if the database has already been imported on the same computer
with phpMyAdmin, the same database can be used.

- To run the Node.js backend:
--- 1. cd to "project-angular/scs-backend" from the project root on a terminal/command prompt
--- 2. With Node.js installed, run "npm install" to install all required modules
--- 3. Ensure that the MySQL host/username/password are correct in the server.js file
--- 4. Once modules are installed, the backend server can be run using the command "node server.js" (Default port is 3000)

- To run the Angular frontend:
--- 1. cd to "project-angular/scs-shop" from the project root on a terminal/command prompt
--- 2. With Node.js and/or Angular installed, run "npm install --force" to install all required modules
--- 3. Ensure the Node.js backend is running. Once running, the frontend can be served by running 
the command "ng serve --proxy-config proxy.config.json"
--- 4. Once the terminal states the frontend has been compiled successfully, the frontend can then be viewed 
at http://localhost:4200

Instructions have been tested on macOS.
