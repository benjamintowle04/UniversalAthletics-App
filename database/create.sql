DROP DATABASE IF EXISTS ua_database;
CREATE DATABASE ua_database;
use ua_database;


-- Create the hibernate sequences table for ID generation
CREATE TABLE hibernate_sequences (
    sequence_name VARCHAR(255) NOT NULL,
    next_val BIGINT NOT NULL,
    PRIMARY KEY (sequence_name)
);


DROP TABLE IF EXISTS Member_Skill;
DROP TABLE IF EXISTS Coach_Skill;
DROP TABLE IF EXISTS Member_Coach;
DROP TABLE IF EXISTS Member_Info;
DROP TABLE IF EXISTS Connection_Request;
DROP TABLE IF EXISTS Session_Request;
DROP TABLE IF EXISTS Session;
DROP TABLE IF EXISTS Skill;
DROP TABLE IF EXISTS Skills;
DROP TABLE IF EXISTS Coach_Job_Title;
DROP TABLE IF EXISTS Job_Title_Permission;
DROP TABLE IF EXISTS Job_Title;
DROP TABLE IF EXISTS Permission;
DROP TABLE IF EXISTS Coach;


CREATE TABLE Connection_Request (
    Request_ID INT(4) NOT NULL AUTO_INCREMENT,
    Sender_Type ENUM('COACH', 'MEMBER') NOT NULL,
    Sender_ID INT(4) NOT NULL,
    Sender_Firebase_ID NCHAR(30), 
    Receiver_Type ENUM('COACH', 'MEMBER') NOT NULL,
    Receiver_ID INT(4) NOT NULL,
    Receiver_Firebase_ID NCHAR(30),
    Sender_First_Name NCHAR(30),
    Sender_Last_Name NCHAR(30),
    Sender_Profile_Pic LONGTEXT,
    Receiver_First_Name NCHAR(30),
    Receiver_Last_Name NCHAR(30),
    Receiver_Profile_Pic LONGTEXT,
    Status ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    Message TEXT(500),
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (Request_ID),
    UNIQUE KEY unique_request (Sender_Type, Sender_ID, Receiver_Type, Receiver_ID, Status),
    INDEX idx_sender (Sender_Type, Sender_ID),
    INDEX idx_receiver (Receiver_Type, Receiver_ID),
    INDEX idx_status (Status)
);

CREATE TABLE Session_Request (
    Request_ID INT(4) NOT NULL AUTO_INCREMENT,
    Sender_Type ENUM('COACH', 'MEMBER') NOT NULL,
    Sender_ID INT(4) NOT NULL,
    Sender_Firebase_ID NCHAR(30), 
    Receiver_Type ENUM('COACH', 'MEMBER') NOT NULL,
    Receiver_ID INT(4) NOT NULL,
    Receiver_Firebase_ID NCHAR(30),
    Sender_First_Name NCHAR(30),
    Sender_Last_Name NCHAR(30),
    Sender_Profile_Pic LONGTEXT,
    Receiver_First_Name NCHAR(30),
    Receiver_Last_Name NCHAR(30),
    Receiver_Profile_Pic LONGTEXT,
    Status ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    Message TEXT(500),
    Session_Date_1 DATE NOT NULL,
    Session_Date_2 DATE NOT NULL,
    Session_Date_3 DATE NOT NULL,
    Session_Time_1 TIME NOT NULL,
    Session_Time_2 TIME NOT NULL,
    Session_Time_3 TIME NOT NULL,
    Session_Location VARCHAR(500) NOT NULL,
    Session_Description TEXT(500) NOT NULL,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (Request_ID),
    INDEX idx_sender (Sender_Type, Sender_ID),
    INDEX idx_receiver (Receiver_Type, Receiver_ID),
    INDEX idx_status (Status)
);

CREATE TABLE Session ( 
    Session_ID INT(4) NOT NULL AUTO_INCREMENT,
    Request_ID INT(4) NOT NULL,
    Session_Date DATE NOT NULL,
    Session_Time TIME NOT NULL,
    Session_Location VARCHAR(500) NOT NULL,
    Session_Description TEXT(500) NOT NULL,
    Coach_Firebase_ID NCHAR(30),
    Coach_First_Name NCHAR(30),    
    Coach_Last_Name NCHAR(30),
    Coach_Profile_Pic LONGTEXT,
    Coach_ID INT(4) NOT NULL,
    Member_First_Name NCHAR(30),
    Member_Last_Name NCHAR(30),
    Member_Profile_Pic LONGTEXT,
    Member_Firebase_ID NCHAR(30),
    Member_ID INT(4) NOT NULL,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (Session_ID)
);

CREATE TABLE Coach (
    Coach_ID INT(4) NOT NULL AUTO_INCREMENT,
    First_Name NCHAR(20),
    Last_Name NCHAR(20),
    Email NCHAR(50),
    Phone NCHAR(15),
    Biography_1 NCHAR(200),
    Biography_2 NCHAR(200),
    Profile_Pic Text(500),
    Bio_Pic_1 Text(500),
    Bio_Pic_2 Text(500),
    Location NCHAR(250),
    Firebase_ID NCHAR(30),
    PRIMARY KEY (Coach_ID)
);

CREATE TABLE Job_Title (
    Job_Title_ID INT(4) NOT NULL AUTO_INCREMENT,
    Title NCHAR(50),
    PRIMARY KEY (Job_Title_ID)
);

CREATE TABLE Permission (
    permission_id INT(4) NOT NULL AUTO_INCREMENT,
    title NCHAR(50),
    PRIMARY KEY (permission_id)
);

CREATE TABLE Coach_Job_Title (
    Coach_ID INT(4) NOT NULL,
    Job_Title_ID INT(4) NOT NULL,
    PRIMARY KEY (Coach_ID, Job_Title_ID),
    CONSTRAINT fk_JT_Coach FOREIGN KEY (Coach_ID) REFERENCES Coach(Coach_ID) ON DELETE CASCADE,
    CONSTRAINT fk_JT_Job_Title FOREIGN KEY (Job_Title_ID) REFERENCES Job_Title(Job_Title_ID) ON DELETE CASCADE
);

CREATE TABLE Job_Title_Permission(
    Job_Title_ID INT(4) NOT NULL,   
    Permission_ID INT(4) NOT NULL,
    PRIMARY KEY (Job_Title_ID, Permission_ID),
    CONSTRAINT fk_M_Job_Title FOREIGN KEY (Job_Title_ID) REFERENCES Job_Title(Job_Title_ID) ON DELETE CASCADE,
    CONSTRAINT fk_M_Permission FOREIGN KEY (Permission_ID) REFERENCES Permission(Permission_ID) ON DELETE CASCADE
);

CREATE TABLE Coach (
    Coach_ID INT(4) NOT NULL AUTO_INCREMENT,
    First_Name NCHAR(20),
    Last_Name NCHAR(20),
    Email NCHAR(50),
    Phone NCHAR(15),
    Biography_1 NCHAR(200),
    Biography_2 NCHAR(200),
    Profile_Pic Text(500),
    Bio_Pic_1 Text(500),
    Bio_Pic_2 Text(500),
    Location NCHAR(250),
    Firebase_ID NCHAR(30),
    PRIMARY KEY (Coach_ID)
);

CREATE TABLE Job_Title (
    Job_Title_ID INT(4) NOT NULL AUTO_INCREMENT,
    Title NCHAR(50),
    PRIMARY KEY (Job_Title_ID)
);

CREATE TABLE Permission (
    permission_id INT(4) NOT NULL AUTO_INCREMENT,
    title NCHAR(50),
    PRIMARY KEY (permission_id)
);

CREATE TABLE Coach_Job_Title (
    Coach_ID INT(4) NOT NULL,
    Job_Title_ID INT(4) NOT NULL,
    PRIMARY KEY (Coach_ID, Job_Title_ID),
    CONSTRAINT fk_JT_Coach FOREIGN KEY (Coach_ID) REFERENCES Coach(Coach_ID) ON DELETE CASCADE,
    CONSTRAINT fk_JT_Job_Title FOREIGN KEY (Job_Title_ID) REFERENCES Job_Title(Job_Title_ID) ON DELETE CASCADE
);

CREATE TABLE Job_Title_Permission(
    Job_Title_ID INT(4) NOT NULL,   
    Permission_ID INT(4) NOT NULL,
    PRIMARY KEY (Job_Title_ID, Permission_ID),
    CONSTRAINT fk_M_Job_Title FOREIGN KEY (Job_Title_ID) REFERENCES Job_Title(Job_Title_ID) ON DELETE CASCADE,
    CONSTRAINT fk_M_Permission FOREIGN KEY (Permission_ID) REFERENCES Permission(Permission_ID) ON DELETE CASCADE
);

INSERT INTO Coach (First_Name, Last_Name, Email, Phone, Biography_1, Biography_2, Profile_Pic, Bio_Pic_1, Bio_Pic_2, Location, Firebase_ID) VALUES (
    'Michael', 
    'Johnson', 
    'mjohnson@gmail.com',
    '555-555-5555',
    'MUST SCORE BASKETBALL',
    'MUST SCORE BASKETBALL',
    "profiles/63658376-ead5-4ed9-a7eb-3e4c19dc59aa-profile-picture-xmj9WqDAsNd9Tfrr95Od84w6Ls92.jpg", 
    "",
    "",
    "Latitude: 42.03470001, Longitude: -93.62080001",
    "pGdWihV35TbdydmijyqToZOCkLs2"
);

INSERT INTO Coach (First_Name, Last_Name, Email, Phone, Biography_1, Biography_2, Profile_Pic, Bio_Pic_1, Bio_Pic_2, Location, Firebase_ID) VALUES (
    'Sarah', 
    'Martinez', 
    'berryjones@gmail.com',
    '555-555-5555',
    'MUST SCORE BASKETBALL',
    'MUST SCORE BASKETBALL',
    "profiles/63658376-ead5-4ed9-a7eb-3e4c19dc59aa-profile-picture-xmj9WqDAsNd9Tfrr95Od84w6Ls92.jpg",
    "",
    "",
    "Latitude: 32.71570001, Longitude: -117.16110001",
    "hfjkabfjkabkj"
);

INSERT INTO Coach (First_Name, Last_Name, Email, Phone, Biography_1, Biography_2, Profile_Pic, Bio_Pic_1, Bio_Pic_2, Location, Firebase_ID) VALUES (
    'David', 
    'Thompson', 
    'robinsonmax80@gmail.com',
    '555-555-5555',
    'MUST SCORE BASKETBALL',
    'MUST SCORE BASKETBALL',
    "profiles/63658376-ead5-4ed9-a7eb-3e4c19dc59aa-profile-picture-xmj9WqDAsNd9Tfrr95Od84w6Ls92.jpg",
    "",
    "",
    "Latitude: 44.02384529218001, Longitude: -93.16454138621328",
    "xmj9WqDAsNd9Tfrr95Od84w6Ls92"
);

INSERT INTO Coach (First_Name, Last_Name, Email, Phone, Biography_1, Biography_2, Profile_Pic, Bio_Pic_1, Bio_Pic_2, Location, Firebase_ID) VALUES (
    'Jessica', 
    'Williams', 
    'berryjones@gmail.com',
    '555-555-5555',
    'MUST SCORE BASKETBALL',
    'MUST SCORE BASKETBALL',
    "profiles/63658376-ead5-4ed9-a7eb-3e4c19dc59aa-profile-picture-xmj9WqDAsNd9Tfrr95Od84w6Ls92.jpg",
    "",
    "",
    "Latitude: 44.85470001, Longitude: -93.424800001",
    "ljkjkjfkdsbjl"
);

INSERT INTO Coach (First_Name, Last_Name, Email, Phone, Biography_1, Biography_2, Profile_Pic, Bio_Pic_1, Bio_Pic_2, Location, Firebase_ID) VALUES (
    'Robert', 
    'Davis', 
    'berryjones@gmail.com',
    '555-555-5555',
    'MUST SCORE BASKETBALL',
    'MUST SCORE BASKETBALL',
    "profiles/63658376-ead5-4ed9-a7eb-3e4c19dc59aa-profile-picture-xmj9WqDAsNd9Tfrr95Od84w6Ls92.jpg",
    "",
    "",
    "Latitude: 44.85470001, Longitude: -93.424800001",
    "gdakfbjk"
);

INSERT INTO Coach (First_Name, Last_Name, Email, Phone, Biography_1, Biography_2, Profile_Pic, Bio_Pic_1, Bio_Pic_2, Location, Firebase_ID) VALUES (
    'Amanda', 
    'Garcia', 
    'berryjones@gmail.com',
    '555-555-5555',
    'MUST SCORE BASKETBALL',
    'MUST SCORE BASKETBALL',
    "profiles/63658376-ead5-4ed9-a7eb-3e4c19dc59aa-profile-picture-xmj9WqDAsNd9Tfrr95Od84w6Ls92.jpg",
    "",
    "",
    "Latitude: 44.73950001, Longitude: -92.85650001",
    "fdajlbfjkbajk"
);

INSERT INTO Coach (First_Name, Last_Name, Email, Phone, Biography_1, Biography_2, Profile_Pic, Bio_Pic_1, Bio_Pic_2, Location, Firebase_ID) VALUES (
    'Christopher', 
    'Brown', 
    'berryjones@gmail.com',
    '555-555-5555',
    'MUST SCORE BASKETBALL',
    'MUST SCORE BASKETBALL',
    "profiles/63658376-ead5-4ed9-a7eb-3e4c19dc59aa-profile-picture-xmj9WqDAsNd9Tfrr95Od84w6Ls92.jpg",
    "",
    "",
    "Latitude: 44.73950001, Longitude: -92.85650001",
    "fadafdsssssshbg"
);

INSERT INTO Coach (First_Name, Last_Name, Email, Phone, Biography_1, Biography_2, Profile_Pic, Bio_Pic_1, Bio_Pic_2, Location, Firebase_ID) VALUES (
    'Emily', 
    'Wilson', 
    'berryjones@gmail.com',
    '555-555-5555',
    'MUST SCORE BASKETBALL',
    'MUST SCORE BASKETBALL',
    "profiles/63658376-ead5-4ed9-a7eb-3e4c19dc59aa-profile-picture-xmj9WqDAsNd9Tfrr95Od84w6Ls92.jpg",
    "",
    "",
    "Latitude: 40.40280001, Longitude: -91.37700001",
    "llllllll"
);

INSERT INTO Coach (First_Name, Last_Name, Email, Phone, Biography_1, Biography_2, Profile_Pic, Bio_Pic_1, Bio_Pic_2, Location, Firebase_ID) VALUES (
    'James', 
    'Miller', 
    'berryjones@gmail.com',
    '555-555-5555',
    'MUST SCORE BASKETBALL',
    'MUST SCORE BASKETBALL',
    "profiles/63658376-ead5-4ed9-a7eb-3e4c19dc59aa-profile-picture-xmj9WqDAsNd9Tfrr95Od84w6Ls92.jpg",
    "",
    "",
    "Latitude: 44.73950001, Longitude: -92.85650001",
    "afdafdsafda"
);

INSERT INTO Coach (First_Name, Last_Name, Email, Phone, Biography_1, Biography_2, Profile_Pic, Bio_Pic_1, Bio_Pic_2, Location, Firebase_ID) VALUES (
    'Ashley', 
    'Anderson', 
    'berryjones@gmail.com',
    '555-555-5555',
    'MUST SCORE BASKETBALL',
    'MUST SCORE BASKETBALL',
    "profiles/63658376-ead5-4ed9-a7eb-3e4c19dc59aa-profile-picture-xmj9WqDAsNd9Tfrr95Od84w6Ls92.jpg",
    "",
    "",
    "Latitude: 40.40280001, Longitude: -91.37700001",
    "farfshr"
);

INSERT INTO Coach (First_Name, Last_Name, Email, Phone, Biography_1, Biography_2, Profile_Pic, Bio_Pic_1, Bio_Pic_2, Location, Firebase_ID) VALUES (
    'Daniel', 
    'Taylor', 
    'berryjones@gmail.com',
    '555-555-5555',
    'MUST SCORE BASKETBALL',
    'MUST SCORE BASKETBALL',
    "profiles/63658376-ead5-4ed9-a7eb-3e4c19dc59aa-profile-picture-xmj9WqDAsNd9Tfrr95Od84w6Ls92.jpg",
    "",
    "",
    "Latitude: 40.40280001, Longitude: -91.37700001",
    "fhjabfabjk"
);

CREATE TABLE Member_Info(
    Member_ID INT(4) NOT NULL AUTO_INCREMENT, 
    First_Name VARCHAR(20),
    Last_Name VARCHAR(20),
    Email VARCHAR(50),
    Phone VARCHAR(15) NOT NULL,
    Biography VARCHAR(200),
    Profile_Pic VARCHAR(250),
    Location VARCHAR(500),
    Firebase_ID VARCHAR(30),
    PRIMARY KEY (Member_ID)
);

CREATE TABLE Member_Coach (
    Member_ID INT(4) NOT NULL,
    Coach_ID INT(4) NOT NULL,
    PRIMARY KEY (Member_ID, Coach_ID),
    CONSTRAINT fk_MC_Member FOREIGN KEY (Member_ID) REFERENCES Member_Info(Member_ID) ON DELETE CASCADE,
    CONSTRAINT fk_MC_Coach FOREIGN KEY (Coach_ID) REFERENCES Coach(Coach_ID) ON DELETE CASCADE
);

# Insert test user
INSERT INTO Member_Info (Member_ID, First_Name, Last_Name, Email, Phone, Biography, Profile_Pic, Location, Firebase_ID) VALUES (
    1,
    'TestFirst',
    'TestLast',
    'test@gmail.com',
    '(555) 555-5555',
    'TestBio',
    'profiles/f9ebd5e2-25d4-49ce-97b3-b18c74ee2677-profile-picture-EFogg1abZOeVRPDxcp541GNzk0o2.jpg',
    'Latitude: 44.80410001, Longitude: -93.16690001',
    'EFogg1abZOeVRPDxcp541GNzk0o2'
);

CREATE TABLE Skill(
    Skill_ID INT(4) NOT NULL AUTO_INCREMENT,  
    Title VARCHAR(20) NOT NULL,
    PRIMARY KEY (Skill_ID)
);

INSERT INTO Skill (Title) VALUES 
    ('basketball'),
    ('soccer'),
    ('tennis'),
    ('swimming'),
    ('golf'),
    ('running'),
    ('biking'),
    ('yoga'),
    ('weightlifting'),
    ('dance'),
    ('boxing'),
    ('football'),
    ('baseball'),
    ('volleyball'),
    ('track_running'),
    ('track_throwing'),
    ('ultimate_frisbee'),
    ('disc_golf'),
    ('wrestling'),
    ('spikeball'),
    ('pickleball');


CREATE TABLE Member_Skill(
    Member_ID INT(4) NOT NULL,
    Skill_ID INT(4) NOT NULL,
    PRIMARY KEY (Member_ID, Skill_ID),
    CONSTRAINT fk_M_Member FOREIGN KEY (Member_ID) REFERENCES Member_Info(Member_ID) ON DELETE CASCADE,
    CONSTRAINT fk_M_Skill FOREIGN KEY (Skill_ID) REFERENCES Skill(Skill_ID) ON DELETE CASCADE
);

CREATE TABLE Coach_Skill(
    Coach_ID INT(4) NOT NULL,
    Skill_ID INT(4) NOT NULL,
    PRIMARY KEY (Coach_ID, Skill_ID),
    CONSTRAINT fk_CS_Coach FOREIGN KEY (Coach_ID) REFERENCES Coach(Coach_ID) ON DELETE CASCADE,
    CONSTRAINT fk_CS_Skill FOREIGN KEY (Skill_ID) REFERENCES Skill(Skill_ID) ON DELETE CASCADE
);

INSERT INTO Member_Skill (Member_ID, Skill_ID) VALUES 
    (1, 1),
    (1, 2);

INSERT INTO Coach_Skill (Coach_ID, Skill_ID) VALUES
    (1, 1),
    (1, 2),
    (1, 3),
    (1, 11),
    (1, 10),
    (2, 1),
    (2, 2),
    (2, 3),
    (2, 11),
    (3, 1),
    (3, 2),
    (3, 6),
    (4, 1),
    (4, 5),
    (5, 1),
    (5, 2),
    (6, 1), 
    (6, 3), 
    (7, 11), 
    (8, 1), 
    (9, 1),
    (9, 2),
    (10, 20);

INSERT INTO Member_Coach (Member_ID, Coach_ID) VALUES
    (1, 9),
    (1, 3);


INSERT INTO Connection_Request (
    Sender_Type, 
    Sender_ID, 
    Receiver_Type, 
    Receiver_ID, 
    Sender_First_Name, 
    Sender_Last_Name, 
    Sender_Profile_Pic, 
    Sender_Firebase_ID,
    Receiver_First_Name, 
    Receiver_Last_Name, 
    Receiver_Profile_Pic, 
    Receiver_Firebase_ID,
    Status, 
    Message
) VALUES    
    ('COACH', 1, 'MEMBER', 1, 'Ben', 'Towle', 'profiles/09ea502f-d3d9-4dc0-8d78-bffb2738fa72-profile-picture-pGdWihV35TbdydmijyqToZOCkLs2.jpg', 'pGdWihV35TbdydmijyqToZOCkLs2', 'TestFirst', 'TestLast', 'profiles/f9ebd5e2-25d4-49ce-97b3-b18c74ee2677-profile-picture-EFogg1abZOeVRPDxcp541GNzk0o2.jpg', 'EFogg1abZOeVRPDxcp541GNzk0o2', 'PENDING', 'I would like to connect'),
    
    ('COACH', 2, 'MEMBER', 1, 'Coach', 'San Diego', 'profiles/63658376-ead5-4ed9-a7eb-3e4c19dc59aa-profile-picture-xmj9WqDAsNd9Tfrr95Od84w6Ls92.jpg', 'hfjkabfjkabkj', 'TestFirst', 'TestLast', 'profiles/f9ebd5e2-25d4-49ce-97b3-b18c74ee2677-profile-picture-EFogg1abZOeVRPDxcp541GNzk0o2.jpg', 'EFogg1abZOeVRPDxcp541GNzk0o2', 'PENDING', 'I would like to connect again'),
     
    ('MEMBER', 1, 'COACH', 3, 'TestFirst', 'TestLast', 'profiles/f9ebd5e2-25d4-49ce-97b3-b18c74ee2677-profile-picture-EFogg1abZOeVRPDxcp541GNzk0o2.jpg', 'EFogg1abZOeVRPDxcp541GNzk0o2', 'Max', 'Robinson', 'profiles/63658376-ead5-4ed9-a7eb-3e4c19dc59aa-profile-picture-xmj9WqDAsNd9Tfrr95Od84w6Ls92.jpg', 'xmj9WqDAsNd9Tfrr95Od84w6Ls92', 'PENDING', 'I would like to connect with you'),
    
    ('MEMBER', 1, 'COACH', 4, 'TestFirst', 'TestLast', 'profiles/f9ebd5e2-25d4-49ce-97b3-b18c74ee2677-profile-picture-EFogg1abZOeVRPDxcp541GNzk0o2.jpg', 'EFogg1abZOeVRPDxcp541GNzk0o2', 'Coach', 'Eden Praire1', 'profiles/63658376-ead5-4ed9-a7eb-3e4c19dc59aa-profile-picture-xmj9WqDAsNd9Tfrr95Od84w6Ls92.jpg', 'ljkjkjfkdsbjl', 'PENDING', 'Looking forward to working together');


INSERT INTO Session_Request (
    Sender_Type, Sender_ID, Sender_Firebase_ID,
    Receiver_Type, Receiver_ID, Receiver_Firebase_ID,
    Sender_First_Name, Sender_Last_Name, Sender_Profile_Pic,
    Receiver_First_Name, Receiver_Last_Name, Receiver_Profile_Pic,
    Status, Message,
    Session_Date_1, Session_Date_2, Session_Date_3,
    Session_Time_1, Session_Time_2, Session_Time_3,
    Session_Location, Session_Description
) VALUES ('COACH', 3, 'xmj9WqDAsNd9Tfrr95Od84w6Ls92',
 'MEMBER', 1, 'EFogg1abZOeVRPDxcp541GNzk0o2',
 'Max', 'Robinson', 'profiles/63658376-ead5-4ed9-a7eb-3e4c19dc59aa-profile-picture-xmj9WqDAsNd9Tfrr95Od84w6Ls92.jpg',
 'TestFirst', 'TestLast', 'profiles/f9ebd5e2-25d4-49ce-97b3-b18c74ee2677-profile-picture-EFogg1abZOeVRPDxcp541GNzk0o2.jpg',
 'PENDING', 'Let\'s schedule a tennis session!',
 '2025-06-18', '2025-06-20', '2025-06-22',
 '10:00:00', '14:00:00', '16:00:00',
 'ISU Tennis Courts', 'Tennis skills and drills'
);

INSERT INTO Session_Request (
    Sender_Type, Sender_ID, Sender_Firebase_ID,
    Receiver_Type, Receiver_ID, Receiver_Firebase_ID,
    Sender_First_Name, Sender_Last_Name, Sender_Profile_Pic,
    Receiver_First_Name, Receiver_Last_Name, Receiver_Profile_Pic,
    Status, Message,
    Session_Date_1, Session_Date_2, Session_Date_3,
    Session_Time_1, Session_Time_2, Session_Time_3,
    Session_Location, Session_Description
) VALUES
('COACH', 9, 'farfshr',
 'MEMBER', 1, 'EFogg1abZOeVRPDxcp541GNzk0o2',
 'Coach', 'Keokuk1', 'profiles/63658376-ead5-4ed9-a7eb-3e4c19dc59aa-profile-picture-xmj9WqDAsNd9Tfrr95Od84w6Ls92.jpg',
 'TestFirst', 'TestLast', 'profiles/f9ebd5e2-25d4-49ce-97b3-b18c74ee2677-profile-picture-EFogg1abZOeVRPDxcp541GNzk0o2.jpg',
 'PENDING', 'Ready for a basketball session?',
 '2025-06-19', '2025-06-21', '2025-06-23',
 '09:00:00', '13:00:00', '15:00:00',
 'Keokuk Gym', 'Basketball fundamentals'
);

INSERT INTO Session (Request_ID, Session_Date, Session_Time, Session_Location, Session_Description, Coach_ID, Coach_Firebase_ID, Coach_First_Name, Coach_Last_Name, Coach_Profile_Pic, Member_ID, Member_First_Name, Member_Last_Name, Member_Profile_Pic, Member_Firebase_ID) VALUES
(1, '2025-06-20', '14:00:00', 'Downtown Tennis Center', 'Advanced tennis techniques and match play', 3, 'xmj9WqDAsNd9Tfrr95Od84w6Ls92', 'David', 'Thompson', 'profiles/63658376-ead5-4ed9-a7eb-3e4c19dc59aa-profile-picture-xmj9WqDAsNd9Tfrr95Od84w6Ls92.jpg', 1, 'TestFirst', 'TestLast', 'profiles/f9ebd5e2-25d4-49ce-97b3-b18c74ee2677-profile-picture-EFogg1abZOeVRPDxcp541GNzk0o2.jpg', 'EFogg1abZOeVRPDxcp541GNzk0o2'),
(2, '2025-06-21', '13:00:00', 'Community Recreation Center', 'Basketball shooting drills and defensive strategies', 10, 'farfshr', 'Ashley', 'Anderson', 'profiles/63658376-ead5-4ed9-a7eb-3e4c19dc59aa-profile-picture-xmj9WqDAsNd9Tfrr95Od84w6Ls92.jpg', 1, 'TestFirst', 'TestLast', 'profiles/f9ebd5e2-25d4-49ce-97b3-b18c74ee2677-profile-picture-EFogg1abZOeVRPDxcp541GNzk0o2.jpg', 'EFogg1abZOeVRPDxcp541GNzk0o2');


INSERT INTO hibernate_sequences (sequence_name, next_val) 
SELECT 'request_id', COALESCE(MAX(Request_ID), 0) + 1 FROM Connection_Request;