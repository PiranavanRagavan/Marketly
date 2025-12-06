Download the project from GitHub
 Go to the GitHub repository in your web browser.
 Click the green “Code” button.
 Choose “Download ZIP.”
 The file will download as Marketly-main.zip into your Downloads folder.


Extract the ZIP file
 Open File Explorer and go to your Downloads folder.
 Right-click Marketly-main.zip and choose “Extract All.”
 Click “Extract.”
 This creates a new folder also named Marketly-main.
 Inside this folder is the actual project that contains package.json, src, public, and other files.


Open the correct folder in VS Code
 Launch Visual Studio Code.
 Click File → Open Folder.
 Navigate to Downloads → Marketly-main.
 Select the Marketly-main folder and open it.
 In the VS Code sidebar, you should see package.json, src, public, vite.config.* and other project files.
 If you do not see package.json, you opened the wrong folder.


Open the terminal inside VS Code
 Go to Terminal → New Terminal.
 The terminal path should end with Marketly-main.
 To double-check, type: dir
 The output should include package.json.
 If package.json does not appear, you are not in the correct folder.


Confirm Node and npm are installed
 In the terminal, type: node -v
 Then type: npm -v
 Both commands should show version numbers.
 If they do not, install Node.js LTS from nodejs.org, then restart VS Code and check again.


Install project dependencies
 Make sure the terminal is pointing to the folder that contains package.json.
 Run: npm install
 This downloads all required packages and creates a node_modules folder.
 If you see an ENOENT error, it means you are in the wrong folder and package.json cannot be found.


Start the development server
 When npm install finishes successfully, run: npm run dev
 Vite will start and show a local development URL, usually http://localhost:5173
 Open this link in your browser to view the project.


Stop or restart the development server
 To stop the server, press Ctrl + C in the terminal.
 To restart it later, open the project folder in VS Code, open the terminal, and run: npm run dev


Summary of the flow
 
Download ZIP from GitHub. Extract it.
 Open the extracted project folder in VS Code.
 Verify package.json is visible in VS Code.
 Open the terminal and check node and npm versions.
 Run npm install.
 Run npm run dev.
 Open the localhost link in your browser.

