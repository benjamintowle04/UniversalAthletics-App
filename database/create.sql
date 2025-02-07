use ua_database;

#DROP TABLE IF EXISTS Member_Info;
#DROP TABLE IF EXISTS Skill;
#DROP TABLE IF EXISTS Member_Skill;

CREATE TABLE Member_Info(
    Member_ID INT(4) NOT NULL, 
    First_Name NCHAR(20),
    Last_Name NCHAR(20),
    Email NCHAR(20),
    Phone NCHAR(9) NOT NULL,
    Biography NCHAR(200),
    Profile_Pic NCHAR(50),
    Location NCHAR(50),
    PRIMARY KEY (Member_ID)
);

#INSERT INTO Staff (Member_ID, First_Name, Last_Name, Email, Phone, Biography, Profile_Pic, Location) VALUES ();

CREATE TABLE Skill(
    Skill_ID INT(4) NOT NULL,  
    Title NCHAR(20) NOT NULL,
    Grade NCHAR(10) NOT NULL, 
    Info NCHAR(50) NOT NULL,
    PRIMARY KEY (Skill_ID)
);

#INSERT INTO Skill (Skill_ID, Title, Grade, Info) VALUES ();

CREATE TABLE Member_Skill(
    Member_ID INT(4) NOT NULL,
    Skill_ID INT(4) NOT NULL,
    PRIMARY KEY (Member_ID, Skill_ID),
    CONSTRAINT fk_M_Member FOREIGN KEY (Member_ID) REFERENCES Member_Info(Member_ID) ON DELETE CASCADE,
    CONSTRAINT fk_M_Skill FOREIGN KEY (Skill_ID) REFERENCES Skill(Skill_ID) ON DELETE CASCADE
);

#INSERT INTO Staff (Member_ID, Skill_ID) VALUES ();