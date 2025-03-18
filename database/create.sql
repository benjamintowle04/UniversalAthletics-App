DROP TABLE IF EXISTS Member_Skill;
DROP TABLE IF EXISTS Member_Info;
DROP TABLE IF EXISTS Skill;
DROP TABLE IF EXISTS Skills;

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
