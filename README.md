                            Welcome to the Universal Athletics App!



- Start here if you are new to this project! We are excited to have you on board!




                                  Installation and Setup
    
# Step 1: Install Node.js and npm
- Navigate to the following link to install Node.js and npm: https://nodejs.org/en/download/
- Choose the appropriate installer for your operating system
      - For Windows, choose the Windows Installer (.msi)
      - For macOS, choose the macOS Installer (.pkg)
- Run the installer and follow the instructions
- Once the installation is complete, open a terminal or command prompt and type the following   command to verify that Node.js and npm are installed correctly: 
      - node -v (Should return the version number)



# Step 2: Install Expo CLI
- Open a terminal or command prompt and type the following command to install Expo CLI:
      - npm install -g expo-cli
      - This will install the latest version of Expo CLI globally on your system
      - Once the installation is complete, you can verify the installation by running the following command:
        - expo --version (Should return the version number)



# Step 3: Set up the project directory
- Create a new folder for the project
- Navigate to that new folder in the terminal or command prompt
    - cd <new-folder-name>
- Clone the remote repository into your local folder
    -  git clone https://github.com/benjamintowle04/Universal-Athletics-App.git



# Step 4: Navigate to the frontend directory
cd ./frontend



# Step 5: Install the needed dependencies
- npx expo install firebase
- npm install @react-navigation/native @react-navigation/native-stack
- npx expo install react-native-screens react-native-safe-area-context
- npx expo install expo-font









                                        Running the App

# Step 1: Install Expo Go on your mobile device
- Download the Expo Go app from the App Store or Google Play Store


# Step 2: Start the development server
- npx expo start
- This will start the development server and open a QR code in the terminal or command prompt
- Scan the QR code with the Expo Go app on your mobile device
- The app should now be running on your mobile device








                                Git and Naming Conventions


- # Git rules
- Branches are categorized by features, bugs, and docs
   - "feature/<feature-name>" for new features
   - "bug/<bug-name>" for bug fixes
   - "docs/<documentation-name>" for documentation changes

- Commit messages should be in the following format:
    - Example: "feature/user-authentication: Add user authentication functionality"

- Changes should never be made directly to the main branch
    - Always create a new branch for any changes you make

- Once the changes are complete in a branch, create a pull request to merge the branch into the main branch



# Naming Conventions 
- folders
   - lowercase, words separated by underscores
   - example: "screens", "node_modules"

- files
   - .tsx files
      - Capitalize the first letter of each word
      - example: "App.tsx", "SignUp.tsx"
    - .ts, .js, and .png files
     - lowercase, words separated by underscores'
     - example: "firebase_config.ts"







                               Git Instructions

# Push Changes to git
- git add .
- git commit -m "commit message"
- git push origin <branch-name>
- push your changes often to avoid merge conflicts


# Create and Checkout a New Branch
- git checkout -b <branch-name>


# Update your branch with origin/main
- git checkout <branch-name>
- git pull origin main
- Do this often to keep your branch up-to-date with the latest changes


# Create a Pull Request (merging changes from your branch into the main branch)
- Go to the GitHub repository and click on the "Pull Requests" tab
- Click on the "New Pull Request" button
- Select the branch you want to merge into the main branch
- Add a title and description for the pull request
- Click on the "Create Pull Request" button
- The code will be reviewed by the team and merged into the main branch










                                    Git Workflow

- Decide what feature, bug, or documentation change you want to work on
- Create a new branch for the changes you want to make 
- Commit and push changes to your branch often
- If the branch takes more than a few days/weeks to finish...
    - Keep updating your branch with the latest changes from the main branch (i.e merge "origin main" into your branch)

Once you are done with your changes, create a pull request to merge your branch into the main branch
