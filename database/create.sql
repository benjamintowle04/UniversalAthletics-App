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
    Biography_1 TEXT(500),
    Biography_2 TEXT(500),
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
    'Max', 
    'Robinson', 
    'robinsonmax80@gmail.com',
    '(612) 757-2753',
    'I am a senior dual sport student athlete at Simpson College majoring in Sports Administration and minoring in Coaching and Sports Communications. I am on the football and volleyball team. While growing up I played a handful of sports and was lucky enough to represent Eagan High School as a captain in Football and Basketball. I enjoy being active and being around my family and friends. I am ecstatic to be a part of Universal Athletics and look forward to seeing where our journey leads us.',
    'Sports have helped me understand how valuable and blessed we are to live and to be surrounded by life. From a young age it was instilled in me that you help others without having a reason to do so. I understand the power we have as humans and much more so as humans with influence. I want to spread positivity and build community. At UA I want our athletes to grow physically, emotionally, and mentally as we continue to take on this so-called "life" together. I live for community and positive change and am excited to build a team within Universal Athletics to spread this message and mission as far as the universe will take it!',
    "profiles/max_robinson_profile.jpg", 
    "bio_pics/max_robinson_cs_1.jpg",
    "bio_pics/max_robinson_cs_2.jpg",
    "Latitude: 42.03470001, Longitude: -93.62080001",
    "UvK1CWDJBTV9FSesc3wCnpyOZ3h2"
);

INSERT INTO Coach (First_Name, Last_Name, Email, Phone, Biography_1, Biography_2, Profile_Pic, Bio_Pic_1, Bio_Pic_2, Location, Firebase_ID) VALUES (
    'Ellie', 
    'Robinson', 
    'ellierobinson135@gmail.com',
    '(651) 492-5110',
    'I am a sophomore at Drake University majoring in Public Relations and Business Studies. I am from Eagan, MN and still live there. In my free time I love to hang out with friends, watch sports, bake, do things outdoors, go on adventures, and shop! I can''t wait to meet you and am thrilled to be a part of your journey here at Universal Athletics!',
    'Being a part of Universal Athletics means I have the chance to make a difference. I''m beyond excited to meet new people and create connections with others. My past coaches have had a profound impact on my life, and I aspire to have a similar influence on others. Furthermore, having the chance to be a part of UA will allow me to step out of my comfort zone and challenge myself with new opportunities. Sports provided me with a place to excel, and I believe everyone deserves to have such a space in their life. At UA, you''ll have that.',
    "profiles/ellie_robinson_profile.jpg",
    "bio_pics/ellie_robinson_cs_1.jpg",
    "bio_pics/ellie_robinson_cs_2.jpg",
    "Latitude: 32.71570001, Longitude: -117.16110001",
    "L6tBRk1b3sZxxeAQDsA44mkQp9P2"
);

INSERT INTO Coach (First_Name, Last_Name, Email, Phone, Biography_1, Biography_2, Profile_Pic, Bio_Pic_1, Bio_Pic_2, Location, Firebase_ID) VALUES (
    'Jesse', 
    'Pladsen', 
    'jesseplads@gmail.com',
    '(319) 310-4165',
    'I am a senior  student athlete at Simpson College majoring in History and minoring in Spanish. I am involved in the Football team as well as the Speech and Debate team. In highschool I was involved in Soccer, Football, baseball, and Basketball. I was always an active kid growing up on a 60 acre farm with my brother Alex (23) sisters Faith (25) and Danisha (30) I quickly learned how important being active is. From playing catch with my brother to just walking around our farm I loved being outside. Just being outside and getting active was always so important and beneficial to me. It helped me take my mind off any stressors or anything I was worried about and live in the moment.',
    'Through Universal Athletics, I know that I can be a difference maker. As an aspiring teacher I have wanted to make a lasting change in the world I live in from a young age. And with this UA I know that I can be the change. Through making sports accessible in ways that other companies don''t, helping get each and every kid active and outside no matter the cost, and finally bettering already devoted student athletes and facilitating the love they have for sports. Sports have always been a part of my life and given this opportunity to pass my knowledge of sports down just gives me another reason to get out of the bed in the morning.',
    "profiles/jesse_pladsen_profile.png",
    "bio_pics/jesse_pladsen_cs_1.jpg",
    "bio_pics/jesse_pladsen_cs_2.jpg",
    "Latitude: 44.02384529218001, Longitude: -93.16454138621328",
    "K0qmQWU33cghGOeOg7EfJ3We0WZ2"
);

INSERT INTO Coach (First_Name, Last_Name, Email, Phone, Biography_1, Biography_2, Profile_Pic, Bio_Pic_1, Bio_Pic_2, Location, Firebase_ID) VALUES (
    'Anthony', 
    'Potratz', 
    'uapotratzanthony@gmail.com',
    '(319) 520-0534',
    'I am a senior  student athlete at Simpson College majoring in Mathematics and Educational Studies, and minoring in Coaching. I am on the Simpson men''s volleyball team. While growing up I played a bunch of sports at Keokuk High School as a captain for basketball, football and track. I was named first team all district in basketball and football in my junior and senior year. I was also unanimously selected as conference player of the year in basketball. I also qualified to run at the state track meet during my sophomore and senior season. I have always loved doing sports with my friends and family and I would love to help other student athletes have and keep that same love for their sports. The opportunity to be a part of Universal Athletics is a once in a lifetime opportunity for me and I cannot wait to see where this program leads me and other young minds.',
    'When I talk about Universal Athletics, the first item that I think of is the word, "opportunity". Universal Athletics gives opportunities for every single athlete no matter the age. Universal Athletics allows opportunities for people to grow in their sport of choice and as an individual person. This opportunity also allows people and the coaches to grow as a part of a family. Everyone on the Universal Athletics staff wants every person to succeed in their sport and in life. This program allows for people to make life long bonds that they will cherish for the rest of their lives. Universal Athletics is that opportunity that allows every person to utilize and enjoy sports in their own way.',
    "profiles/anthony_potratz_profile.png",
    "bio_pics/anthony_potratz_cs_1.jpg",
    "bio_pics/anthony_potratz_cs_2.jpg",
    "Latitude: 44.85470001, Longitude: -93.424800001",
    "mLLijUzTYIcwOOVFaDSNlCzPSTC3"
);

INSERT INTO Coach (First_Name, Last_Name, Email, Phone, Biography_1, Biography_2, Profile_Pic, Bio_Pic_1, Bio_Pic_2, Location, Firebase_ID) VALUES (
    'Tyosn', 
    'Luu', 
    'mr.tyluu@gmail.com',
    '(515) 422-2668',
    'I am a junior at Iowa State University majoring in Health and exercise science. I was also a former Simpson athlete on which I played football for the storm,while both colleges aren''t too far from where I grew up either . I was born and raised in Des Moines IA.  In Des Moines I am an alumni from Herbert Hoover high school where I played Football, Basketball, and was also a thrower for the track and field team. I knew of sports growing up but never thought that I''d be involved with sports, My first time officially playing for a team wasn''t until my freshman year and I also didn''t play football until my junior year. Doing so has made me become who I am today, I''ve learned that taking every opportunity that is given to me is a risk and I should always be open minded about them but always be willing to take the risk. I want to encourage the youth and younger Athletes the responsibility they will soon face on the up years they have ahead of them.',
    'Sports has always been with me growing up, sports was also help mentally, physically, and emotionally whenever i needed to bring myself back to 100 sports was always a safe place for me to recover and recoup myself. Sports can also lead you places you''ve never imagined as well that''s why being to share what I''ve learned about being active and share in that knowledge I have to the younger generation.',
    "profiles/tyson_luu_profile.jpg",
    "bio_pics/tyson_luu_cs_1.jpg",
    "bio_pics/tyson_luu_cs_2.jpg",
    "Latitude: 44.85470001, Longitude: -93.424800001",
    "OsbBqVbKdRcKRL6xXIV5rJ8RBND2"
);

INSERT INTO Coach (First_Name, Last_Name, Email, Phone, Biography_1, Biography_2, Profile_Pic, Bio_Pic_1, Bio_Pic_2, Location, Firebase_ID) VALUES (
    'Nate', 
    'Birhane', 
    'nate.birhane23@gmail.com',
    '(651) 354-7098',
    'I am a student at the University of Minnesota majoring in Business and Marketing Education along with a minor in Leadership. I graduated from Eagan High School in 2021 where I was a captain for the Football and Track & Field teams. I enjoy playing sports in my free time and staying active in the gym. I love striving for goals and collaborating with others to reach a greater good in any aspect.',
    'UA is special because it gives kids a chance to take steps in their sports while also gaining skills for the life ahead of them. In my experience with sports and staying active, I can look back to see the healthy habits I didn''t know I was forming and how those elevated me to become a better person overall. I''m grateful that I can also look back to acknowledge the coaches and adults who helped me on this path because I know what that impact can do. Being active and playing sports are a crucial part of our lives - especially growing up. I want to help kids continue to grow their outlook in a positive way.',
    "profiles/nate_birhane_profile.jpg",
    "bio_pics/nate_birhane_cs_1.jpg",
    "bio_pics/nate_birhane_cs_2.jpg",
    "Latitude: 44.73950001, Longitude: -92.85650001",
    "cb0QIlN7a1g4YQlMttxeSMQhyJI3"
);

INSERT INTO Coach (First_Name, Last_Name, Email, Phone, Biography_1, Biography_2, Profile_Pic, Bio_Pic_1, Bio_Pic_2, Location, Firebase_ID) VALUES (
    'Ryan', 
    'Pangier', 
    'ryan.pangier15@gmail.com',
    '612-900-4998',
    'I am a Senior at UW-Stout majoring in Plastics Engineering. I am from Eagan, MN. I like to hang out with family & friends and do many fun indoor or outdoor activities. I am excited to join the Universal Athletics family and hope we can make a difference together.',
    'This gives us the opportunity to teach younger athletes the skills and talent that we possess or have the knowledge of; passing everything we know on to them. Sports is all about a team effort and building ourselves to reach those expectations or goals. It is also about having fun and creating strong bonds with one another. With our assistance and intuition, I believe the young athletes will understand the criteria in sports, ways of achieving their goals and aspirations, and building up their confidence levels which will brighten up the future.',
    "profiles/ryan_pangier_profile.jpg",
    "bio_pics/ryan_pangier_cs_1.jpg",
    "bio_pics/ryan_pangier_cs_2.jpg",
    "Latitude: 44.73950001, Longitude: -92.85650001",
    "EeEVX2smaGV8FP1LZxWELhV62A62"
);

INSERT INTO Coach (First_Name, Last_Name, Email, Phone, Biography_1, Biography_2, Profile_Pic, Bio_Pic_1, Bio_Pic_2, Location, Firebase_ID) VALUES (
    'Bella', 
    'Tranquilino', 
    'isabellatranquilino@gmail.com',
    '641-242-0085',
    'I am a recent grad of  Simpson College, majoring in biology and nursing. I plan to attend Mercy College of Health Sciences in the fall of 2025, with hopes of passing my boards, starting a career in pediatrics, and eventually becoming a Nurse Practitioner. Growing up, I played basketball and volleyball, and eventually, I went on to play at Simpson for four years. Currently, I am an assistant tennis professional at Des Moines Golf and Country Club, where I teach tennis to children who are beginners as well as high-performance high school players from the Des Moines area.',
    'UA represents the perfect place to foster athletic growth and create a positive environment for kids to thrive. I deeply resonate with UAs mission of inclusivity and empowerment, as I love working with kids in sports to help them not only improve their skills but also find joy, confidence, and resilience through competition. UA provides a space where kids feel encouraged, supported, and motivated to be their best. It creates a developmental space where kids can grow through sports – I hold this value very close seeing I started sports at a very young age. The UA vision of cultivating a love for sports aligns with my passion for helping young athletes grow as individuals and as teammates.',
    "profiles/bella_tranquilano_profile.jpg",
    "bio_pics/bella_tranquilano_cs_1.jpg",
    "bio_pics/bella_tranquilano_cs_2.jpg",
    "Latitude: 40.40280001, Longitude: -91.37700001",
    "N7xXsHbXr2T0YrrvmKm9JxfGpIA2"
);

INSERT INTO Coach (First_Name, Last_Name, Email, Phone, Biography_1, Biography_2, Profile_Pic, Bio_Pic_1, Bio_Pic_2, Location, Firebase_ID) VALUES (
    'Gavin', 
    'Hegstrom', 
    'gavin.hegstrom@gmail.com',
    '515-446-1395',
    'I am a current sophomore at Simpson College majoring in physical education with a minor in coaching. I am from Perry, Iowa. I''m a big sports guy, as I enjoy watching college football and basketball along with the MLB and the NFL. I love to be outdoors and I like to be active. I can''t wait to get to work!',
    'Universal Athletics is a gateway for the next generation of athletes. It allows kids with a passion for sports develop their abilities and learn new skills. It also gives me the opportunity to gain experience as a coach while learning tons of new things! UA also allows all of us the opportunity to engage and build relationships with young athletes. Sports are truly one of the most amazing things in this world, and having the opportunity to spread the knowledge I''ve gained from being a part of a college program is very exciting, to say the least!',
    "profiles/gavin_hegstrom_profile.jpg",
    "bio_pics/gavin_hegstrom_cs_1.jpg",
    "bio_pics/gavin_hegstrom_cs_2.jpg",
    "Latitude: 44.73950001, Longitude: -92.85650001",
    "Qo5gME59Qyct6z4523N5ESAjKME3"
);

INSERT INTO Coach (First_Name, Last_Name, Email, Phone, Biography_1, Biography_2, Profile_Pic, Bio_Pic_1, Bio_Pic_2, Location, Firebase_ID) VALUES (
    'Caden', 
    'Heck', 
    'cadenheck3@gmail.com',
    '(515) 518-9700',
    'I am 19 with a certification in Personal Training, Corrective Exercise, and Nutrition. Born and raised in Perry, IA. Stayed busy playing football, basketball, golf, and baseball. I was in the Air Force for a little bit before getting medically discharged. I coach football for Perry High School, calling offensive plays for the Junior Varsity level. For varsity, I was up in the box telling the coaches down on the field what the defense the opponent was in and what I thought would work best for us on the offensive side of the ball. I enjoy watching most sports. Mainly football and golf. I like to golf whenever I get the chance if the weather lets me.',
    'Universal Athletics gives student athletes the opportunity to put in the work and get better outside of practice and lifting. Also gives kids a great chance to network with other athletes and learn from, not only us coaches, but other athletes. Going with that, this gives us coaches to spread our knowledge on to the next generation. As coaches, we love watching other people progress and turn into the best versions of themselves. ',
    "profiles/caden_heck_profile.jpg",
    "bio_pics/caden_heck_cs_1.jpg",
    "bio_pics/caden_heck_cs_2.jpg",
    "Latitude: 40.40280001, Longitude: -91.37700001",
    "4wA38YbS8Xc5yc4Zf1jkRgji6Os2"
);

INSERT INTO Coach (First_Name, Last_Name, Email, Phone, Biography_1, Biography_2, Profile_Pic, Bio_Pic_1, Bio_Pic_2, Location, Firebase_ID) VALUES (
    'Ben', 
    'Towle', 
    'coachben@gmail.com', 
    '555-555-5555', 
    'MUST SCORE BASKETBALL',    
    'MUST SCORE BASKETBALL',
    'profiles/ben_towle_profile.jpg',
    'bio_pics/ben_towle_cs_1.jpg',
    'bio_pics/ben_towle_cs_2.jpg',
    'Latitude: 44.80410001, Longitude: -93.16690001',
    'zwSdb6VTETgdxn7LAnAkkFHiTW63'
);

INSERT INTO Coach (First_Name, Last_Name, Email, Phone, Biography_1, Biography_2, Profile_Pic, Bio_Pic_1, Bio_Pic_2, Location, Firebase_ID) VALUES (
    'Alivia', 
    'Eaton', 
    'eatona730@gmail.com',
    '641-691-7556',
    'I am a junior at Simpson College majoring in biology and education studies. I grew up in Marshalltown, Iowa and played a lot of sports until my junior year of high school when my connective tissue disorder made participating in organized sports an unsafe choice. I played soccer and volleyball and have coached camps in both including running speciality drills for goalies. I have worked as a swim lesson instructor and swim coach since 2020 in both large group and one on one settings. I prefer to work with beginners in building confidence and creating a basic skill set that can be developed further with other coaches. I have worked with students as young at 8 months in parent-tot lessons and as old as 27 years in standard private lessons. Currently, I work as a TA for introductory biology courses at Simpson and as a seasonal educator at the Blank Park Zoo. I have first aid, CPR/AED PRO, deep water rescue assist, KultureCity Autism and Sensory Needs Inclusion, and allergy safe schools certifications',
    'UA is a place to develop skills with supportive coaches who can offer more individual attention than traditional practices can. This allows us to support athletes of various incoming ability and confidence levels in becoming better every day through adaptive techniques.',
    "profiles/alivia_eaton_profile.jpg",
    "bio_pics/alivia_eaton_cs_1.jpg",
    "bio_pics/alivia_eaton_cs_2.jpg",
    "Latitude: 40.40280001, Longitude: -91.37700001",
    "fTA4zIcJlsbGmQsyQ3DuT8YXSnD3"
);

INSERT INTO Coach (First_Name, Last_Name, Email, Phone, Biography_1, Biography_2, Profile_Pic, Bio_Pic_1, Bio_Pic_2, Location, Firebase_ID) VALUES (
    'Zach', 
    'Benge', 
    'Zabenge13@gmail.com',
    '(515)-414-9785',
    'I am a Junior at Indianola High School currently being recruited for baseball. This season will be my 3rd year on the varsity baseball team and 2nd year as a starter. I am a Catcher mainly but I am our teams closing pitcher and I play the outfield. I play travel baseball through the Iowa Sticks and the Spects National. I have coached youth hitting and pitching camps through the high school.I currently work as a courtesy clerk at Hy-Vee, but will be changing jobs soon to SportsPlex West in Waukee.  Working with beginners to intermediate players is my specialty, given that I have a lot of knowledge of the game of baseball and know what is needed to help the players become better athletes.',
    'UA is a way for athletes to make the jump from being average, to being the best player they can be. It is a way not only to improve their game physically but mentally.',
    "profiles/zach_benge_profile.jpg",
    "bio_pics/zach_benge_cs_1.jpg",
    "bio_pics/zach_benge_cs_2.jpg",
    "Latitude: 40.40280001, Longitude: -91.37700001",
    "W0dufqgR3jWiAdvDSli5lWU68gG2"
);

INSERT INTO Coach (First_Name, Last_Name, Email, Phone, Biography_1, Biography_2, Profile_Pic, Bio_Pic_1, Bio_Pic_2, Location, Firebase_ID) VALUES (
    'Mekhi', 
    'Holmes', 
    'allhuncho1@gmail.com',
    '(314)-915-1640',
    'My name is Mekhi Holmes or K1. I am a Junior at Simpson College majoring in sociology and a 3 year starting defensive back for the Simpson Storm football team. My hometown is St. Louis MO, where I went to Hazelwood East High School and played football, basketball, and baseball. Sports have always been a big part of my life and have blessed me with many of the opportunities I have today. I am an athlete that loves competition and striving for the best! I’m fairly new to training, but I have attended a large amount of high level training sessions as an athlete in various sports and I’m excited to start my journey as a trainer!',
    'Universal Athletics gives athletes who are looking to improve in their sport the opportunity to gain a competitive advantage! For athletes who aspire to play on the next level or just want to be more confident and controlled within their game, UA offers personal training to enhance their performance and comfortability. As a coach I am extremely happy to help in the development of our future athletes',
    "profiles/mekhi_holmes_profile.jpg",
    "bio_pics/mekhi_holmes_cs_1.jpg",
    "bio_pics/mekhi_holmes_cs_2.jpg",
    "Latitude: 40.40280001, Longitude: -91.37700001",
    "0YRttf0VsaWPfjCOCokAe6FVk3K3"
);

INSERT INTO Coach (First_Name, Last_Name, Email, Phone, Biography_1, Biography_2, Profile_Pic, Bio_Pic_1, Bio_Pic_2, Location, Firebase_ID) VALUES (
    'Blane', 
    'Wallace', 
    'blwallace03@gmail.com',
    '641-217-1047',
    'My name is Blane Wallace, I’m a sophomore going to be a junior at Simpson College. My major is Sports Administration, and I’m minoring in coaching and sports communications. My hometown is Chariton, Iowa where I did 5 different sports in high school because we were a smaller town. At Simpson College I ran cross country and track for a year, and played on the men’s Simpson basketball team for two years. Next year I’ll be taking a change in position and becoming a basketball manager for the team, while I also continue my tennis career for the Simpson Storm. I’ve grown up around sports all my life so for me sports is my life and I’d love to help others and to continue to be around sports for my future. I’d like to say I’m very knowledgeable in most sports but I can always learn more in life and in sports.',
    'Being involved in athletics all my life and all the accomplishments has taught me and helped me understand how valuable and blessed we are in life to get some of these opportunities. Being apart of UA gives me a chance to learn, learning to be a better leader, coach, learn in life from others and their sports, also just being blessed to have a chance to work and coach kids because they will be the next generation of athletes and I want them to be better and do better than us and the people before us. UA also gives kids with a passion and love for sports to develop their abilities and learn more skills along the way. Also UA isn’t all about sports. I believe I can teach life lessons and make people closer to God who gives us these opportunities in  life. UA also allows all of us the opportunity to engage and build relationships with young athletes. I want to have fun and learn and help kids become better than we are in life and sports.',
    "profiles/blane_wallace_profile.jpg",
    "bio_pics/blane_wallace_cs_1.jpg",
    "bio_pics/blane_wallace_cs_2.jpg",
    "Latitude: 40.40280001, Longitude: -91.37700001",
    "cIbXF5AjRCXv4KfEILCqEqddfhj1"
);

INSERT INTO Coach (First_Name, Last_Name, Email, Phone, Biography_1, Biography_2, Profile_Pic, Bio_Pic_1, Bio_Pic_2, Location, Firebase_ID) VALUES (
    'CJ', 
    'Hangartner', 
    'changartner3@gmail.com',
    '(520)-909-8854',
    'I am currently a junior at Simpson College majoring in psychology, I am blessed enough to be allowed to play the game of football for as long as I have. With this experience at this level being a 3-year starter, I would love to pass on my knowledge of the game and what techniques helped me succeed and be the player I am. I am originally from Tucson, Arizona, and spent the first 18 years of my life there. At Cienega High School, I participated in football, baseball, and wrestling. I ended up playing crucial roles for each of those teams I have been on. Coming into college, I just wanted to prove myself to myself, and I put my head down to work with intent and get better every single day. There is nothing more beautiful than the process itself. My passion is helping people in any way possible and watching them turn what they learned and experienced through their journey into success in any possible form. I believe I can help your game mentally and physically.  I am excited to start my process through Universal Athletics and be a part of a great group of people!',
    'After speaking with Max, I was able to get an understanding of how this job is meant to be. After reflecting on that conversation, I was able to come up with an understanding of what UA really means to me. This opportunity would allow me to express my true emotions and self worth. I will be able to help individuals who seek to better themselves no matter what obstacle is in their way. I remember when I was playing sports at a young age and my eyes would light up with every opportunity, and I can not wait to optimize that sparkle for them. I also love growing and with the leaders this company has I will be able to grow in every aspect of my life and I am grateful for what has to come.',
    "profiles/cj_hangartner_profile.jpg",
    "bio_pics/cj_hangartner_cs_1.jpg",
    "bio_pics/cj_hangartner_cs_2.jpg",
    "Latitude: 40.40280001, Longitude: -91.37700001",
    "KCrPD4yprSPwf0HOxTIasrbtIGA3"
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

INSERT INTO Member_Info (Member_ID, First_Name, Last_Name, Email, Phone, Biography, Profile_Pic, Location, Firebase_ID) VALUES (
    2,
    'Benjamin',
    'Towle',
    'benjamintowle04@gmail.com',
    '(555) 555-5555',
    'TestBio',
    'profiles/ben_towle_profile.jpg',
    'Latitude: 44.80410001, Longitude: -93.16690001',
    'KDCMIgU1EcYi3ILUdMpo7y5JT372'
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
    (1, 2),
    (2, 5),
    (2, 11);

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
    (10, 20),
    (11, 1), 
    (11, 2),
    (12, 4), 
    (12, 6), 
    (13, 5),
    (13, 8),
    (13, 3),
    (14, 11), 
    (14, 1),
    (15, 16),
    (15, 12),
    (16, 20),
    (16, 3);


INSERT INTO Member_Coach (Member_ID, Coach_ID) VALUES
    (1, 9),
    (1, 3), 
    (1, 10),
    (2, 1),
    (2, 8), 
    (2, 11);


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

('COACH', 3, 'MEMBER', 2, 'Jesse', 'Pladsen', 'profiles/jesse_pladsen_profile.png', 'K0qmQWU33cghGOeOg7EfJ3We0WZ2', 'Ben', 'Towle', 'profiles/ben_towle_profile.jpg', 'KDCMIgU1EcYi3ILUdMpo7y5JT372', 'PENDING', 'Looking forward to working together');



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
    ('COACH', 1, 'UvK1CWDJBTV9FSesc3wCnpyOZ3h2',
    'MEMBER', 2, 'KDCMIgU1EcYi3ILUdMpo7y5JT372',
    'Max', 'Robinson', 'profiles/max_robinson_profile.jpg',
    'Benjamin', 'Towle', 'profiles/ben_towle_profile.jpg',
    'PENDING', 'Ready for a basketball session?',
    '2025-07-20', '2025-07-21', '2025-07-23',
    '09:00:00', '13:00:00', '15:00:00',
    'Eagan YMCA', 'Basketball fundamentals'
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
('COACH', 11, 'zwSdb6VTETgdxn7LAnAkkFHiTW63',
 'MEMBER', 2, 'KDCMIgU1EcYi3ILUdMpo7y5JT372',
 'Ben', 'Towle', 'profiles/42693e11-8069-48cc-a835-0728c08c0cda-KDCMIgU1EcYi3ILUdMpo7y5JT372.jpg',
 'Benjamin', 'Towle', 'profiles/42693e11-8069-48cc-a835-0728c08c0cda-KDCMIgU1EcYi3ILUdMpo7y5JT372.jpg',
 'PENDING', 'Ready for a basketball session?',
 '2025-07-19', '2025-07-21', '2025-07-23',
 '09:00:00', '13:00:00', '15:00:00',
 'Keokuk Gym', 'Basketball fundamentals'
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
('MEMBER', 2, 'KDCMIgU1EcYi3ILUdMpo7y5JT372',
 'MEMBER', 11, 'zwSdb6VTETgdxn7LAnAkkFHiTW63',
 'Benjamin', 'Towle', 'profiles/42693e11-8069-48cc-a835-0728c08c0cda-KDCMIgU1EcYi3ILUdMpo7y5JT372.jpg',
 'Ben', 'Towle', 'profiles/42693e11-8069-48cc-a835-0728c08c0cda-KDCMIgU1EcYi3ILUdMpo7y5JT372.jpg',
 'PENDING', 'Ready for a basketball session?',
 '2025-07-11', '2025-07-14', '2025-06-30',
 '09:00:00', '13:00:00', '15:00:00',
 'Ames Gym', 'Volleyball fundamentals'
);

INSERT INTO Session (Request_ID, Session_Date, Session_Time, Session_Location, Session_Description, Coach_ID, Coach_Firebase_ID, Coach_First_Name, Coach_Last_Name, Coach_Profile_Pic, Member_ID, Member_First_Name, Member_Last_Name, Member_Profile_Pic, Member_Firebase_ID) VALUES
(   
    1, '2025-07-02', '14:00:00', 'Downtown Football Center', 
    'Advanced football techniques and match play', 
    11, 'zwSdb6VTETgdxn7LAnAkkFHiTW63', 'Ben', 'Towle', 'profiles/42693e11-8069-48cc-a835-0728c08c0cda-KDCMIgU1EcYi3ILUdMpo7y5JT372.jpg', 
    2, 'Benjamin', 'Towle', 'profiles/42693e11-8069-48cc-a835-0728c08c0cda-KDCMIgU1EcYi3ILUdMpo7y5JT372.jpg', 
    'KDCMIgU1EcYi3ILUdMpo7y5JT372'
),

(   
    2, '2025-06-30', '14:00:00', 'Downtown Tennis Center', 
    'Advanced tennis techniques and match play', 
    11, 'zwSdb6VTETgdxn7LAnAkkFHiTW63', 'Ben', 'Towle', 'profiles/42693e11-8069-48cc-a835-0728c08c0cda-KDCMIgU1EcYi3ILUdMpo7y5JT372.jpg', 
    2, 'Benjamin', 'Towle', 'profiles/42693e11-8069-48cc-a835-0728c08c0cda-KDCMIgU1EcYi3ILUdMpo7y5JT372.jpg',
    'KDCMIgU1EcYi3ILUdMpo7y5JT372'
);


INSERT INTO hibernate_sequences (sequence_name, next_val) 
SELECT 'request_id', COALESCE(MAX(Request_ID), 0) + 1 FROM Connection_Request;
