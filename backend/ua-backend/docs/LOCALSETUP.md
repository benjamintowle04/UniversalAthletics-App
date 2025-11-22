# Local Setup Guide

Follow these steps to install all necessary dependencies for the Universal Athletics project.

## Prerequisites

Ensure you have the following installed on your system:
- Git
- MySQL (Shell and Workbench)
- Java Development Kit (JDK)
- Node.js and npm
- Maven (For Running SpringBoot)
- Expo CLI and Expo Go on IOS or Android

### 1. Install Git
1. Download Git from [git-scm.com](https://git-scm.com/).
2. Run the installer and follow the on-screen instructions.
3. Verify the installation:
   ```sh
   git --version
   ```
   This should display the Git version number.

### 2. Install MySQL
1. Download MySQL from [mysql.com](https://dev.mysql.com/downloads/installer/).
2. Run the installer and follow the on-screen instructions.
3. During the installation, ensure you select both MySQL Shell and MySQL Workbench.
4. Verify the installation:
   - Open MySQL Workbench and connect to your MySQL server.
   - Open MySQL Shell and connect to your MySQL server:
     ```sh
     mysqlsh --version
     ```
     This should display the MySQL Shell version number.

### 3. Install Java Development Kit (If not already installed)
1. Download the JDK from [oracle.com](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html).
2. Run the installer and follow the on-screen instructions.
3. Set the `JAVA_HOME` environment variable:
   - On Windows:
     1. Open the Start Search, type in "env", and select "Edit the system environment variables".
     2. In the System Properties window, click on the "Environment Variables" button.
     3. In the Environment Variables window, click "New" under the "System variables" section.
     4. Enter `JAVA_HOME` as the variable name and the path to the JDK installation directory as the variable value (e.g., `C:\Program Files\Java\jdk-11`).
     5. Click "OK" to close all windows.
   - On macOS/Linux:
     1. Open a terminal and edit the `~/.bash_profile` (or `~/.bashrc` or `~/.zshrc` depending on your shell) file.
     2. Add the following line:
        ```sh
        export JAVA_HOME=/path/to/jdk-11
        export PATH=$JAVA_HOME/bin:$PATH
        ```
     3. Save the file and run `source ~/.bash_profile` (or the appropriate file for your shell) to apply the changes.
4. Verify the installation:
   ```sh
   java -version
   ```
   This should display the Java version number.

### 4. Install Node.js and npm
1. Download Node.js from [nodejs.org](https://nodejs.org/).
2. Run the installer and follow the on-screen instructions.
3. Verify the installation:
   ```sh
   node -v
   npm -v
   ```
   This should display the Node.js and npm version numbers.


### 5. Clone the Repository
1. Open a terminal or command prompt.
2. Run the following commands to clone the repository and navigate to the project directory:
   ```sh
   git clone https://github.com/your-repo/Universal-Athletics-App.git
   cd Universal-Athletics-App
   ```



### 6. Install Expo CLI
1. Open a terminal or command prompt and type the following command to install Expo CLI globally:
   ```bash
   npm install -g expo-cli
   ```
2. Verify the installation:
   ```bash
   expo --version   # Should return the Expo CLI version number
   ```


### 7. Install Maven
1. Download Maven from the official website: [maven.apache.org](https://maven.apache.org/download.cgi).
2. Extract the downloaded archive to a directory of your choice.
3. Add the `bin` directory of the extracted Maven directory to the `PATH` environment variable.
    - On Windows:
        1. Open the Start Search, type in "env", and select "Edit the system environment variables".
        2. In the System Properties window, click on the "Environment Variables" button.
        3. In the Environment Variables window, select the `Path` variable in the "System variables" section and click "Edit".
        4. Click "New" and add the path to the `bin` directory of the extracted Maven directory (e.g., `C:\path\to\apache-maven-3.8.4\bin`).
        5. Click "OK" to close all windows.
    - On macOS/Linux:
        1. Open a terminal and edit the `~/.bash_profile` (or `~/.bashrc` or `~/.zshrc` depending on your shell) file.
        2. Add the following line:
            ```sh
            export PATH=/path/to/apache-maven-3.8.4/bin:$PATH
            ```
        3. Save the file and run `source ~/.bash_profile` (or the appropriate file for your shell) to apply the changes.
4. Verify the installation:
    ```sh
    mvn -version
    ```
    This should display the Maven version number.


### 8. Backend Setup (Spring Boot with Maven)
1. Navigate to the backend directory:
    ```sh
    cd backend/ua-backend
    ```
2. Install Maven dependencies:
    ```sh
    mvn clean install
    ```

### 9. Frontend Setup (React Native)
1. Navigate to the frontend directory:
    ```sh
    cd ../frontend
    ```
2. Install npm dependencies:
    ```sh
    npm install
    ```

### 10. Database Setup
1. Open MySQL Workbench and create a new schema/database for the project. Name the database "ua_database".
2. Run the SQL scripts provided in the `database` directory to set up the necessary tables and data.

### 11. Running the Applications

1. Start the backend server:
    ```sh
    cd backend
    cd ua-backend
    mvn spring-boot:run
    ```
2. Start the frontend application:
    Install Expo Go on your Android or iOS device and run the following command:
    ```sh
    cd ../frontend
    npx expo start
    ```

3. If successful, you should see a QR code that you can scan to display the running app on your smartphone with Expo Go!
