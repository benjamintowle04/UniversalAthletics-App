DROP TABLE IF EXISTS Member_Skill;
DROP TABLE IF EXISTS Coach_Skill;
DROP TABLE IF EXISTS Member_Coach;
DROP TABLE IF EXISTS Member_Info;
DROP TABLE IF EXISTS Connection_Request;
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
    Receiver_Type ENUM('COACH', 'MEMBER') NOT NULL,
    Receiver_ID INT(4) NOT NULL,
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
    'Ben', 
    'Towle', 
    'btowle04@iastate.edu',
    '555-555-5555',
    'MUST SCORE BASKETBALL',
    'MUST SCORE BASKETBALL',
    "profiles/09ea502f-d3d9-4dc0-8d78-bffb2738fa72-profile-picture-pGdWihV35TbdydmijyqToZOCkLs2.jpg", 
    "",
    "",
    "Latitude: 42.03470001, Longitude: -93.62080001",
    "pGdWihV35TbdydmijyqToZOCkLs2"
);

INSERT INTO Coach (First_Name, Last_Name, Email, Phone, Biography_1, Biography_2, Profile_Pic, Bio_Pic_1, Bio_Pic_2, Location, Firebase_ID) VALUES (
    'Coach', 
    'San Diego', 
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
    'Max', 
    'Robinson', 
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
    'Coach', 
    'Eden Praire1', 
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
    'Coach', 
    'Eden Praire2', 
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
    'Coach', 
    'Hastings1', 
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
    'Coach', 
    'Hastings2', 
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
    'Coach', 
    'Keokuk2', 
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
    'Coach', 
    'Hastings3', 
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
    'Coach', 
    'Keokuk1', 
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
    'Coach', 
    'Keokuk3', 
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
    (1, 1),
    (1, 9),
    (1, 3);


INSERT INTO Connection_Request (Sender_Type, Sender_ID, Receiver_Type, Receiver_ID, Status, Message) VALUES
    ('COACH', 1, 'MEMBER', 1, 'PENDING', 'I would like to connect'), 
    ('COACH', 2, 'MEMBER', 1, 'PENDING', 'I would like to connect again'),
    ('COACH', 9, 'MEMBER', 1, 'ACCEPTED', 'I would like to connect'),
    ('COACH', 4, 'MEMBER', 1, 'REJECTED', 'I would like to connect'),
    ('COACH', 3, 'MEMBER', 1, 'ACCEPTED', 'I would like to connect'),
    ('MEMBER', 1, 'COACH', 2, 'CANCELLED', 'I would like to connect'),
    ('MEMBER', 1, 'COACH', 4, 'CANCELLED', 'I would like to connect');

    
