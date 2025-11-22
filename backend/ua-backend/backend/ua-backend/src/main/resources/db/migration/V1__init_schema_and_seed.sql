-- Flyway V1 migration: create schema and seed initial coach/skill data
-- This migration was adapted from database/create.sql and is intended to run on MySQL (JawsDB)

SET FOREIGN_KEY_CHECKS=0;

CREATE TABLE IF NOT EXISTS hibernate_sequences (
    sequence_name VARCHAR(255) NOT NULL,
    next_val BIGINT NOT NULL,
    PRIMARY KEY (sequence_name)
);

CREATE TABLE IF NOT EXISTS Connection_Request (
    Request_ID INT(11) NOT NULL AUTO_INCREMENT,
    Sender_Type ENUM('COACH', 'MEMBER') NOT NULL,
    Sender_ID INT(11) NOT NULL,
    Sender_Firebase_ID NCHAR(30),
    Receiver_Type ENUM('COACH', 'MEMBER') NOT NULL,
    Receiver_ID INT(11) NOT NULL,
    Receiver_Firebase_ID NCHAR(30),
    Sender_First_Name NCHAR(30),
    Sender_Last_Name NCHAR(30),
    Sender_Profile_Pic LONGTEXT,
    Receiver_First_Name NCHAR(30),
    Receiver_Last_Name NCHAR(30),
    Receiver_Profile_Pic LONGTEXT,
    Status ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    Message TEXT,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (Request_ID),
    UNIQUE KEY unique_request (Sender_Type, Sender_ID, Receiver_Type, Receiver_ID, Status),
    INDEX idx_sender (Sender_Type, Sender_ID),
    INDEX idx_receiver (Receiver_Type, Receiver_ID),
    INDEX idx_status (Status)
);

CREATE TABLE IF NOT EXISTS Session_Request (
    Request_ID INT(11) NOT NULL AUTO_INCREMENT,
    Sender_Type ENUM('COACH', 'MEMBER') NOT NULL,
    Sender_ID INT(11) NOT NULL,
    Sender_Firebase_ID NCHAR(30),
    Receiver_Type ENUM('COACH', 'MEMBER') NOT NULL,
    Receiver_ID INT(11) NOT NULL,
    Receiver_Firebase_ID NCHAR(30),
    Sender_First_Name NCHAR(30),
    Sender_Last_Name NCHAR(30),
    Sender_Profile_Pic LONGTEXT,
    Receiver_First_Name NCHAR(30),
    Receiver_Last_Name NCHAR(30),
    Receiver_Profile_Pic LONGTEXT,
    Status ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    Message TEXT,
    Session_Date_1 DATE NOT NULL,
    Session_Date_2 DATE NOT NULL,
    Session_Date_3 DATE NOT NULL,
    Session_Time_1 TIME NOT NULL,
    Session_Time_2 TIME NOT NULL,
    Session_Time_3 TIME NOT NULL,
    Session_Location VARCHAR(500) NOT NULL,
    Session_Description TEXT NOT NULL,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (Request_ID),
    INDEX idx_sender (Sender_Type, Sender_ID),
    INDEX idx_receiver (Receiver_Type, Receiver_ID),
    INDEX idx_status (Status)
);

CREATE TABLE IF NOT EXISTS Session (
    Session_ID INT(11) NOT NULL AUTO_INCREMENT,
    Request_ID INT(11) NOT NULL,
    Session_Date DATE NOT NULL,
    Session_Time TIME NOT NULL,
    Session_Location VARCHAR(500) NOT NULL,
    Session_Description TEXT NOT NULL,
    Coach_Firebase_ID NCHAR(30),
    Coach_First_Name NCHAR(30),
    Coach_Last_Name NCHAR(30),
    Coach_Profile_Pic LONGTEXT,
    Coach_ID INT(11) NOT NULL,
    Member_First_Name NCHAR(30),
    Member_Last_Name NCHAR(30),
    Member_Profile_Pic LONGTEXT,
    Member_Firebase_ID NCHAR(30),
    Member_ID INT(11) NOT NULL,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (Session_ID)
);

CREATE TABLE IF NOT EXISTS Coach (
    Coach_ID INT(11) NOT NULL AUTO_INCREMENT,
    First_Name NCHAR(20),
    Last_Name NCHAR(20),
    Email NCHAR(50),
    Phone NCHAR(15),
    Biography_1 TEXT,
    Biography_2 TEXT,
    Profile_Pic VARCHAR(250),
    Bio_Pic_1 VARCHAR(250),
    Bio_Pic_2 VARCHAR(250),
    Location NCHAR(250),
    Firebase_ID NCHAR(30),
    PRIMARY KEY (Coach_ID)
);

CREATE TABLE IF NOT EXISTS Job_Title (
    Job_Title_ID INT(11) NOT NULL AUTO_INCREMENT,
    Title NCHAR(50),
    PRIMARY KEY (Job_Title_ID)
);

CREATE TABLE IF NOT EXISTS Permission (
    permission_id INT(11) NOT NULL AUTO_INCREMENT,
    title NCHAR(50),
    PRIMARY KEY (permission_id)
);

CREATE TABLE IF NOT EXISTS Coach_Job_Title (
    Coach_ID INT(11) NOT NULL,
    Job_Title_ID INT(11) NOT NULL,
    PRIMARY KEY (Coach_ID, Job_Title_ID),
    CONSTRAINT fk_JT_Coach FOREIGN KEY (Coach_ID) REFERENCES Coach(Coach_ID) ON DELETE CASCADE,
    CONSTRAINT fk_JT_Job_Title FOREIGN KEY (Job_Title_ID) REFERENCES Job_Title(Job_Title_ID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Job_Title_Permission(
    Job_Title_ID INT(11) NOT NULL,
    Permission_ID INT(11) NOT NULL,
    PRIMARY KEY (Job_Title_ID, Permission_ID),
    CONSTRAINT fk_M_Job_Title FOREIGN KEY (Job_Title_ID) REFERENCES Job_Title(Job_Title_ID) ON DELETE CASCADE,
    CONSTRAINT fk_M_Permission FOREIGN KEY (Permission_ID) REFERENCES Permission(Permission_ID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Member_Info(
    Member_ID INT(11) NOT NULL AUTO_INCREMENT,
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

CREATE TABLE IF NOT EXISTS Member_Coach (
    Member_ID INT(11) NOT NULL,
    Coach_ID INT(11) NOT NULL,
    PRIMARY KEY (Member_ID, Coach_ID),
    CONSTRAINT fk_MC_Member FOREIGN KEY (Member_ID) REFERENCES Member_Info(Member_ID) ON DELETE CASCADE,
    CONSTRAINT fk_MC_Coach FOREIGN KEY (Coach_ID) REFERENCES Coach(Coach_ID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Skill(
    Skill_ID INT(11) NOT NULL AUTO_INCREMENT,
    Title VARCHAR(50) NOT NULL,
    PRIMARY KEY (Skill_ID)
);

CREATE TABLE IF NOT EXISTS Member_Skill(
    Member_ID INT(11) NOT NULL,
    Skill_ID INT(11) NOT NULL,
    PRIMARY KEY (Member_ID, Skill_ID),
    CONSTRAINT fk_M_Member FOREIGN KEY (Member_ID) REFERENCES Member_Info(Member_ID) ON DELETE CASCADE,
    CONSTRAINT fk_M_Skill FOREIGN KEY (Skill_ID) REFERENCES Skill(Skill_ID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Coach_Skill(
    Coach_ID INT(11) NOT NULL,
    Skill_ID INT(11) NOT NULL,
    Skill_Level ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED') NOT NULL DEFAULT 'INTERMEDIATE',
    PRIMARY KEY (Coach_ID, Skill_ID),
    CONSTRAINT fk_CS_Coach FOREIGN KEY (Coach_ID) REFERENCES Coach(Coach_ID) ON DELETE CASCADE,
    CONSTRAINT fk_CS_Skill FOREIGN KEY (Skill_ID) REFERENCES Skill(Skill_ID) ON DELETE CASCADE
);

-- Seed coaches
INSERT INTO Coach (First_Name, Last_Name, Email, Phone, Biography_1, Biography_2, Profile_Pic, Bio_Pic_1, Bio_Pic_2, Location, Firebase_ID) VALUES
    ('Max','Robinson','robinsonmax80@gmail.com','(612) 757-2753','A recent college grad of Simpson College where I was on the football and Mens volleyball team and spent time in CEO club figuring out this idea. While growing up I played a handful of sports and was lucky enough to represent Eagan High School as a captain in Football and Basketball. I enjoy being active and being around my family and friends. I am ecstatic to be a part of Universal Athletics and look forward to seeing where our journey leads us.','Sports have helped me understand how valuable and blessed we are to live and to be surrounded by life. From a young age it was instilled in me that you help others without having a reason to do so. I understand the power we have as humans and much more so as humans with influence. I want to spread positivity and build community. At UA I want our athletes to grow physically, emotionally, and mentally as we continue to take on this so-called "life" together. I live for community and positive change and am excited to build a team within Universal Athletics to spread this message and mission as far as the universe will take it!','profiles/max_robinson_profile.jpg','bio_pics/max_robinson_cs_1.jpg','bio_pics/max_robinson_cs_2.jpg','Twin Cities, MN','UvK1CWDJBTV9FSesc3wCnpyOZ3h2'),
    ('Tyson','Luu','mr.tyluu@gmail.com','(515) 422-2668','I am a junior at Iowa State University majoring in Health and exercise science. I was also a former Simpson athlete on which I played football for the storm,while both colleges aren''t too far from where I grew up either . I was born and raised in Des Moines IA.  In Des Moines I am an alumni from Herbert Hoover high school where I played Football, Basketball, and was also a thrower for the track and field team. I knew of sports growing up but never thought that I''d be involved with sports, My first time officially playing for a team wasn''t until my freshman year and I also didn''t play football until my junior year. Doing so has made me become who I am today, I''ve learned that taking every opportunity that is given to me is a risk and I should always be open minded about them but always be willing to take the risk. I want to encourage the youth and younger Athletes the responsibility they will soon face on the up years they have ahead of them.','Sports has always been with me growing up, sports was also help mentally, physically, and emotionally whenever i needed to bring myself back to 100 sports was always a safe place for me to recover and recoup myself. Sports can also lead you places you've never imagined as well that''s why being to share what I've learned about being active and share in that knowledge I have to the younger generation.','profiles/tyson_luu_profile.jpg','bio_pics/tyson_luu_cs_1.jpg','bio_pics/tyson_luu_cs_2.jpg','Des Moines, IA','OsbBqVbKdRcKRL6xXIV5rJ8RBND2'),
    ('Ryan','Pangier','ryan.pangier15@gmail.com','612-900-4998','I am a Senior at UW-Stout majoring in Plastics Engineering. I am from Eagan, MN. I like to hang out with family & friends and do many fun indoor or outdoor activities. I am excited to join the Universal Athletics family and hope we can make a difference together!','This gives us the opportunity to teach younger athletes the skills and talent that we possess or have the knowledge of; passing everything we know on to them. Sports is all about a team effort and building ourselves to reach those expectations or goals. It is also about having fun and creating strong bonds with one another. With our assistance and intuition, I believe the young athletes will understand the criteria in sports, ways of achieving their goals and aspirations, and building up their confidence levels which will brighten up the future.','profiles/ryan_pangier_profile.jpg','bio_pics/ryan_pangier_cs_1.jpg','bio_pics/ryan_pangier_cs_2.jpg','Twin Cities, MN','EeEVX2smaGV8FP1LZxWELhV62A62'),
    ('Gavin','Hegstrom','gavin.hegstrom@gmail.com','515-446-1395','I am a current junior at The University of Northern Iowa majoring in physical education with a minor in coaching. I am from Perry, Iowa. I am a big sports guy, as I enjoy watching college football and basketball along with the MLB and the NFL. I love to be outdoors and I also love to be active. I can’t wait to get to work! I''m a big sports guy, as I enjoy watching college football and basketball along with the MLB and the NFL. I love to be outdoors and I like to be active. I can''t wait to get to work!','Universal Athletics is a gateway for the next generation of athletes. It allows kids with a passion for sports develop their abilities and learn new skills. It also gives me the opportunity to gain experience as a coach while learning tons of new things! UA also allows all of us the opportunity to engage and build relationships with young athletes. Sports are truly one of the most amazing things in this world, and having the opportunity to spread the knowledge I''ve gained from being a part of a college program is very exciting, to say the least!','profiles/gavin_hegstrom_profile.jpg','bio_pics/gavin_hegstrom_cs_1.jpg','bio_pics/gavin_hegstrom_cs_2.jpg','Cedar Falls, IA','Qo5gME59Qyct6z4523N5ESAjKME3'),
    ('Caden','Heck','cadenheck3@gmail.com','(515) 518-9700','I am 20 with a certification in Personal Training, Corrective Exercise, and Nutrition. Born and raised in Perry, IA. Stayed busy playing football, basketball, golf, and baseball. I was in the Air Force for a little bit before getting medically discharged. I coach football for Perry High School, calling offensive plays for the Junior Varsity level. For varsity, I was up in the box telling the coaches down on the field what the defense the opponent was in and what I thought would work best for us on the offensive side of the ball. Now I’m at the University of Northern Iowa to become a PE teacher. I enjoy watching most sports. Mainly football and golf. I like to golf whenever I get the chance if the weather lets me.','Universal Athletics gives student athletes the opportunity to put in the work and get better outside of practice and lifting. Also gives kids a great chance to network with other athletes and learn from, not only us coaches, but other athletes. Going with that, this gives us coaches to spread our knowledge on to the next generation. As coaches, we love watching other people progress and turn into the best versions of themselves. ', 'profiles/caden_heck_profile.jpg','bio_pics/caden_heck_cs_1.jpg','bio_pics/caden_heck_cs_2.jpg','Cedar Falls, IA','4wA38YbS8Xc5yc4Zf1jkRgji6Os2'),
    ('Ben','Towle','benjamintowle04@gmail.com','651-399-6269','I am a recent alumni  at Iowa State University with a Degree in Computer Engineering. I grew up in and currently live in Eagan, MN. I enjoy hanging out with friends and family, trying new things, and staying active in my daily life. My favorite sport is Basketball, but I also enjoy coaching football at a more beginner level I am excited to be a part of the Universal Athletics team and make a lasting impact on individuals near and far. ','Universal Athletics means to be a part of something greater than myself. At UA, we strive to reach out to our local communities and bring people together through sports and activities. In addition to building stronger minds and bodies, I believe our greatest impact is in building strong and inclusive communities for people who strive to better themselves','profiles/ben_towle_profile.jpg','bio_pics/ben_towle_cs_1.jpg','bio_pics/ben_towle_cs_2.jpg','Twin Cities, MN','zwSdb6VTETgdxn7LAnAkkFHiTW63'),
    ('Mekhi','Holmes','allhuncho1@gmail.com','(314)-915-1640','My name is Mekhi Holmes or K1. I am a senior  at Simpson College majoring in sociology and a 3 year starting defensive back for the Simpson Storm football team. My hometown is St. Louis MO, where I went to Hazelwood East High School and played football, basketball, and baseball. Sports have always been a big part of my life and have blessed me with many of the opportunities I have today. I am an athlete that loves competition and striving for the best! I’m fairly new to training, but I have attended a large amount of high level training sessions as an athlete in various sports and I’m excited to start my journey as a trainer!, but I have attended a large amount of high level training sessions as an athlete in various sports and I’m excited to start my journey as a trainer!','Universal Athletics gives athletes who are looking to improve in their sport the opportunity to gain a competitive advantage! For athletes who aspire to play on the next level or just want to be more confident and controlled within their game, UA offers personal training to enhance their performance and comfortability. As a coach I am extremely happy to help in the development of our future athletes','profiles/mekhi_holmes_profile.jpg','bio_pics/mekhi_holmes_cs_1.jpg','bio_pics/mekhi_holmes_cs_2.jpg','Indianola, IA','0YRttf0VsaWPfjCOCokAe6FVk3K3'),
    ('CJ','Hangartner','changartner3@gmail.com','(520)-909-8854','I am currently a senior at Simpson College majoring in psychology, I am blessed enough to be allowed to play the game of football for as long as I have. With this experience at this level being a 3-year starter, I would love to pass on my knowledge of the game and what techniques helped me succeed and be the player I am. I am originally from Tucson, Arizona, and spent the first 18 years of my life there. At Cienega High School, I participated in football, baseball, and wrestling. I ended up playing crucial roles for each of those teams I have been on. Coming into college, I just wanted to prove myself to myself, and I put my head down to work with intent and get better every single day. There is nothing more beautiful than the process itself. My passion is helping people in any way possible and watching them turn what they learned and experienced through their journey into success in any possible form. I believe I can help your game mentally and physically.  I am excited to start my process through Universal Athletics and be a part of a great group of people!','After speaking with Max, I was able to get an understanding of how this job is meant to be. After reflecting on that conversation, I was able to come up with an understanding of what UA really means to me. This opportunity would allow me to express my true emotions and self worth. I will be able to help individuals who seek to better themselves no matter what obstacle is in their way. I remember when I was playing sports at a young age and my eyes would light up with every opportunity, and I can not wait to optimize that sparkle for them.','profiles/cj_hangartner_profile.jpg','bio_pics/cj_hangartner_cs_1.jpg','bio_pics/cj_hangartner_cs_2.jpg','Indianola, IA','KCrPD4yprSPwf0HOxTIasrbtIGA3';

-- Seed skills
INSERT INTO Skill (Title) VALUES
    ('basketball'),('soccer'),('tennis'),('swimming'),('golf'),('running'),('biking'),('yoga'),('weightlifting'),('dance'),('boxing'),('football'),('baseball'),('volleyball'),('track_running'),('track_throwing'),('ultimate_frisbee'),('disc_golf'),('wrestling'),('spikeball'),('pickleball'),('lacrosse'),('hockey'),('fishing'),('rugby');

-- Seed coach_skill associations
INSERT INTO Coach_Skill (Coach_ID, Skill_ID, Skill_Level) VALUES
    (1, 1, 'ADVANCED'),
    (1, 12, 'ADVANCED'),
    (1, 14, 'ADVANCED'),
    (1, 13, 'BEGINNER'),
    (1, 3, 'BEGINNER'),
    (1, 20, 'INTERMEDIATE'),
    (1, 2, 'BEGINNER'),
    (2, 1, 'INTERMEDIATE'),
    (2, 2, 'BEGINNER'),
    (2, 3, 'ADVANCED'),
    (2, 9, 'ADVANCED'),
    (2, 12, 'ADVANCED'),
    (3, 1, 'INTERMEDIATE'),
    (3, 12, 'ADVANCED'),
    (3, 13, 'ADVANCED'),
    (4, 12, 'ADVANCED'),
    (5, 12, 'ADVANCED'),
    (5, 5, 'ADVANCED'),
    (6, 1, 'ADVANCED'),
    (6, 12, 'INTERMEDIATE'),
    (7, 12, 'ADVANCED'),
    (8, 12, 'ADVANCED'),
    (8, 9, 'ADVANCED');

-- Set hibernate sequence
INSERT INTO hibernate_sequences (sequence_name, next_val)
SELECT 'request_id', COALESCE(MAX(Request_ID), 0) + 1 FROM Connection_Request;

SET FOREIGN_KEY_CHECKS=1;
