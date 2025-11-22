# Welcome to the Universal Athletics App! 🎉

---

![Universal Athletics](docs/images/logo.png)

## Start here if you are new to this project! 🚀
We are excited to have you on board!

---

## 📚 Documentation
- [Local Setup Guide](docs/LOCALSETUP.md)
- [Git Guide](docs/GIT.md)

---

## 🛠️ Tech Stack

### Frontend
- **React Native**: A framework for building native mobile applications using React.
- **Expo**: A set of tools and services for building, deploying, and managing React Native apps.
- **TypeScript**: Typed superset of JavaScript for better development experience.

### Backend
- **Spring Boot**: Java-based framework for building scalable, enterprise-grade applications.
- **Spring Data JPA**: Data access layer for database operations.
- **Maven**: Build automation and dependency management tool.

### UI Styling
- **NativeWind**: Tailwind CSS framework designed for React Native applications.
- **Tailwind CSS**: Utility-first CSS framework.

### Navigation
- **React Navigation**: Routing and navigation for React Native apps.

### Authentication & Cloud Services
- **Firebase**: Authentication and cloud services platform.
- **Google Cloud Storage**: Cloud storage for file uploads and management.

### Database
- **MySQL**: Open-source relational database management system.

### Development Tools
- **Lombok**: Java library for reducing boilerplate code.
- **Expo Font**: Custom font loading for React Native.
- **React Native Vector Icons**: Customizable icons for React Native.

### Additional Libraries
- **Expo Image Picker**: Image selection from device gallery or camera.
- **Expo Location**: Location services for React Native.
- **React Native Async Storage**: Local storage solution.
- **React Native Reanimated**: Advanced animations library.

---

## 📂 Naming Conventions

### Folders
- Use lowercase letters with words separated by underscores.
  - Example: `screens`, `node_modules`

### Files
- **`.tsx` files**: Capitalize the first letter of each word.
  - Example: `App.tsx`, `SignUp.tsx`
- **`.ts`, `.js`, `.png` files**: Use lowercase letters with words separated by underscores.
  - Example: `firebase_config.ts`

---

## 🚀 Quick Start

1. Follow the [Local Setup Guide](docs/LOCALSETUP.md) to install all dependencies
2. Clone the repository and set up the database
3. Start the backend server with Maven
4. Start the frontend with Expo
5. Scan the QR code with Expo Go on your mobile device

---
```

```markdown:docs/LOCALSETUP.md
# Local Setup Guide

Follow these steps to install all necessary dependencies for the Universal Athletics project.

## Prerequisites

Ensure you have the following installed on your system:
- Git
- MySQL (Shell and Workbench)
- Java Development Kit (JDK 21)
- Node.js and npm
- Maven (For Running Spring Boot)
- Expo CLI and Expo Go on iOS or Android

---

### 1. Install Git
1. Download Git from [git-scm.com](https://git-scm.com/).
2. Run the installer and follow the on-screen instructions.
3. Verify the installation:

```bash
git --version
```

### 2. Install MySQL
1. Download MySQL from [mysql.com](https://dev.mysql.com/downloads/installer/).
2. Run the installer and follow the on-screen instructions.
3. During the installation, ensure you select both MySQL Shell and MySQL Workbench.
4. Verify the installation:
   - Open MySQL Workbench and connect to your MySQL server.
   - Open MySQL Shell and verify:

```bash
mysqlsh --version
```

### 3. Install Java Development Kit (JDK 21)
1. Download JDK 21 from [oracle.com](https://www.oracle.com/java/technologies/javase/jdk21-archive-downloads.html) or use OpenJDK.
2. Run the installer and follow the on-screen instructions.
3. Set the `JAVA_HOME` environment variable:
   
   **On Windows:**
   1. Open the Start Search, type "env", and select "Edit the system environment variables".
   2. Click "Environment Variables" button.
   3. Click "New" under "System variables".
   4. Enter `JAVA_HOME` as variable name and JDK path as value (e.g., `C:\Program Files\Java\jdk-21`).
   5. Add `%JAVA_HOME%\bin` to your PATH variable.
   
   **On macOS/Linux:**
   1. Edit your shell profile file (`~/.bash_profile`, `~/.bashrc`, or `~/.zshrc`):

```bash
export JAVA_HOME=/path/to/jdk-21
export PATH=$JAVA_HOME/bin:$PATH
```

   2. Apply changes:

```bash
source ~/.bash_profile
```

4. Verify the installation:

```bash
java -version
```

### 4. Install Node.js and npm
1. Download Node.js from [nodejs.org](https://nodejs.org/) (LTS version recommended).
2. Run the installer and follow the on-screen instructions.
3. Verify the installation:

```bash
node -v
```

```bash
npm -v
```

### 5. Install Maven
1. Download Maven from [maven.apache.org](https://maven.apache.org/download.cgi).
2. Extract the archive to your preferred directory.
3. Add Maven to your PATH:
   
   **On Windows:**
   1. Add the `bin` directory to your PATH environment variable (e.g., `C:\path\to\apache-maven-3.9.x\bin`).
   
   **On macOS/Linux:**
   1. Add to your shell profile:

```bash
export PATH=/path/to/apache-maven-3.9.x/bin:$PATH
```

4. Verify the installation:

```bash
mvn -version
```

### 6. Install Expo CLI
1. Install Expo CLI globally:

```bash
npm install -g @expo/cli
```

2. Verify the installation:

```bash
expo --version
```

3. Install Expo Go app on your iOS or Android device from the App Store/Google Play Store.

---

## 🚀 Project Setup

### 7. Clone the Repository
1. Clone the repository and navigate to the project directory:

```bash
git clone https://github.com/benjamintowle04/Universal-Athletics-App.git
```

```bash
cd Universal-Athletics-App
```

### 8. Database Setup
1. Open MySQL Workbench and create a new connection to your MySQL server.
2. Create a new schema/database named `ua_database`:

```sql
CREATE DATABASE ua_database;
```

3. Configure your database connection in the Spring Boot application properties file.

### 9. Backend Setup (Spring Boot with Maven)
1. Navigate to the backend directory:

```bash
cd backend/ua-backend
```

2. Install Maven dependencies and compile:

```bash
mvn clean install
```

3. Create an `application.properties` file in `src/main/resources/` with your database configuration:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ua_database
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
```

### 10. Frontend Setup (React Native with Expo)
1. Navigate to the frontend directory:

```bash
cd ../../frontend
```

2. Install npm dependencies:

```bash
npm install
```

3. Install Tailwind CSS and NativeWind dependencies (if not already included):

```bash
npm install tailwindcss nativewind react-native-css-interop
```

4. Create environment configuration files as needed for Firebase and other services.

---

## 🏃‍♂️ Running the Applications

### 11. Start the Backend Server
1. Navigate to the backend directory:

```bash
cd backend/ua-backend
```

2. Run the Spring Boot application:

```bash
mvn spring-boot:run
```

The backend server will start on `http://localhost:8080` by default.

### 12. Start the Frontend Application
1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Start the Expo development server:

```bash
npx expo start
```

3. Scan the QR code with Expo Go on your mobile device, or press:
   - `a` for Android emulator
   - `i` for iOS simulator
   - `w` for web browser

---

## 🔧 Additional Configuration

### Firebase Setup
1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com).
2. Add your Firebase configuration to the frontend project.
3. Enable Authentication and any other required Firebase services.

### Google Cloud Storage Setup
1. Set up Google Cloud Storage credentials for file uploads.
2. Configure the backend with appropriate service account credentials.

---

## 🐛 Troubleshooting

### Common Issues:
- **Java Version**: Ensure you're using JDK 21 as specified in the pom.xml
- **MySQL Connection**: Verify MySQL is running and credentials are correct
- **Expo Issues**: Clear Expo cache with `expo start -c`
- **Node Modules**: Delete `node_modules` and run `npm install` again if needed
- **Maven Issues**: Run `mvn clean` before `mvn install`

### Useful Commands:
- Clear Expo cache: `expo start --clear`
- Reset Metro bundler: `npx expo start --clear`
- Check Java version: `java -version`
- Check Node version: `node -v`
- Check Maven version: `mvn -version`

---

## 📱 Development Tips

1. Keep Expo Go app updated on your mobile device
2. Ensure your computer and mobile device are on the same network
3. Use `expo start --tunnel` if you're having network connectivity issues
4. Check the Expo DevTools in your browser for debugging information
5. Monitor the Spring Boot console for backend logs and errors

---
