DROP TABLE IF EXISTS Member_Skill;
DROP TABLE IF EXISTS Member_Info;
DROP TABLE IF EXISTS Coach_Skill;
DROP TABLE IF EXISTS Skill;
DROP TABLE IF EXISTS Skills;
DROP TABLE IF EXISTS Coach_Job_Title;
DROP TABLE IF EXISTS Job_Title_Permission;
DROP TABLE IF EXISTS Job_Title;
DROP TABLE IF EXISTS Permission;
DROP TABLE IF EXISTS Coach;

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
    "https://storage.googleapis.com/universal-athletics-info/profiles/09ea502f-d3d9-4dc0-8d78-bffb2738fa72-profile-picture-pGdWihV35TbdydmijyqToZOCkLs2.jpg?GoogleAccessId=ua-storage-service@universal-athletics-452123.iam.gserviceaccount.com&Expires=1742609330&Signature=A5WeZWv7JGi0%2BfJG4dFivzXV6NOdP4U4VwL0fGQRPC5kDmcCpjRSvXy%2BTpwK1w7wqg3JjtyzjS4R%2FA5cUs6946sFs4Q1ykqMzXFMTxoydCvPDGPDf0Jj8vX8mlpL19i51XZEiJj4dDOlJzRXbeQbT8X6vBGxmhpBoOcCBQzjNxy2LU0ab%2FWdOvxwgJXmoupkm9tUlKRHRqj%2Bo%2BCA0aEI5Gw1GtyOB3OUCuvWEVcpC2ipSslB%2FkkgFCqexO%2BhmdV9kNa%2BgHUbdfnB9wQtaDUCA5IUgrCtCmcVWvgO8Y4dzVIHZ6xV0QL7yqzjt30%2FXLcmoA1ruqfsas47HXFne3QgSA%3D%3D", 
    "",
    "",
    "Ames, IA",
    "pGdWihV35TbdydmijyqToZOCkLs2"
);

INSERT INTO Coach (First_Name, Last_Name, Email, Phone, Biography_1, Biography_2, Profile_Pic, Bio_Pic_1, Bio_Pic_2, Location, Firebase_ID) VALUES (
    'Max', 
    'Robinson', 
    'robinsonmax80@gmail.com',
    '555-555-5555',
    'MUST SCORE BASKETBALL',
    'MUST SCORE BASKETBALL',
    "https://storage.googleapis.com/universal-athletics-info/profiles/63658376-ead5-4ed9-a7eb-3e4c19dc59aa-profile-picture-xmj9WqDAsNd9Tfrr95Od84w6Ls92.jpg?GoogleAccessId=ua-storage-service@universal-athletics-452123.iam.gserviceaccount.com&Expires=1742609493&Signature=WPBzumrrIxTfhWqlhU0ynxhJARqKYwYQz7HzXoH3z2jBZxg3knAg%2BAD7dr%2FeZ%2BD4emyJo2QzrQerQwfdg6rEY9MyP8mJyp1wmBaeBQ6JSWTo31V%2BeEGlizDej4lpScLZRRkpVWcjSOxGkT%2FrEEqaXCY1dEYrGrH3fHfGx7iIZCv%2BYQfASNpsuHdouaYEsYI03pgKXfx1Jdx3eXCzYjTIAk4zRJRXy%2F6vRF8PbAb4k89Z9bk1s%2Bn78NfbErh1Xb8Q%2F6gYQkHe1j1gD4DIfUuEvA3%2BdXgZTypZdI2v3wi07f3G4yLhwtlG9S8HRP7NLzHyU3FusazagMmSFTq9R46MbA%3D%3D", 
    "",
    "",
    "Indianola, IA",
    "xmj9WqDAsNd9Tfrr95Od84w6Ls92"
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

# Insert test user
INSERT INTO Member_Info (Member_ID, First_Name, Last_Name, Email, Phone, Biography, Profile_Pic, Location, Firebase_ID) 
VALUES (
    1,
    'TestFirst',
    'TestLast',
    'test@gmail.com',
    '(555) 555-5555',
    'TestBio',
    'https://storage.googleapis.com/universal-athletics-info/profiles/f9ebd5e2-25d4-49ce-97b3-b18c74ee2677-profile-picture-EFogg1abZOeVRPDxcp541GNzk0o2.jpg',
    'Latitude: 42.02384529218001, Longitude: -93.64541386213286',
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

# Insert test user's skills
INSERT INTO Member_Skill (Member_ID, Skill_ID) VALUES 
    (1, 1),
    (1, 2),
    (1, 3),
    (1, 4),
    (1, 5),
    (1, 6),
    (1, 7),
    (1, 8);

INSERT INTO Coach_Skill (Coach_ID, Skill_ID) VALUES
    (1, 1),
    (1, 2),
    (1, 3),
    (1, 11),
    (1, 10),
    (2, 1),
    (2, 2),
    (2, 3);

