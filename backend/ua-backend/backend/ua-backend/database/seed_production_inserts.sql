-- Idempotent seed-only SQL for production JAWSDB import
-- This file contains only INSERTs (no CREATE/DROP/USE statements).
-- Each INSERT is guarded so it won't create duplicates if run multiple times.
-- Run with: mysql -h <host> -P 3306 -u <user> -p"<pass>" <database> < seed_production_inserts.sql

SET FOREIGN_KEY_CHECKS=0;

-- Coaches (guarded by Firebase_ID)
INSERT INTO Coach (First_Name, Last_Name, Email, Phone, Biography_1, Biography_2, Profile_Pic, Bio_Pic_1, Bio_Pic_2, Location, Firebase_ID)
SELECT 'Max','Robinson','robinsonmax80@gmail.com','(612) 757-2753',
  'A recent college grad of Simpson College where I was on the football and Mens volleyball team and spent time in CEO club figuring out this idea. While growing up I played a handful of sports and was lucky enough to represent Eagan High School as a captain in Football and Basketball. I enjoy being active and being around my family and friends. I am ecstatic to be a part of Universal Athletics and look forward to seeing where our journey leads us.',
  'Sports have helped me understand how valuable and blessed we are to live and to be surrounded by life. From a young age it was instilled in me that you help others without having a reason to do so. I understand the power we have as humans and much more so as humans with influence. I want to spread positivity and build community. At UA I want our athletes to grow physically, emotionally, and mentally as we continue to take on this so-called "life" together. I live for community and positive change and am excited to build a team within Universal Athletics to spread this message and mission as far as the universe will take it!',
  'profiles/max_robinson_profile.jpg','bio_pics/max_robinson_cs_1.jpg','bio_pics/max_robinson_cs_2.jpg','Twin Cities, MN','UvK1CWDJBTV9FSesc3wCnpyOZ3h2'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM Coach WHERE Firebase_ID='UvK1CWDJBTV9FSesc3wCnpyOZ3h2');

INSERT INTO Coach (First_Name, Last_Name, Email, Phone, Biography_1, Biography_2, Profile_Pic, Bio_Pic_1, Bio_Pic_2, Location, Firebase_ID)
SELECT 'Tyson','Luu','mr.tyluu@gmail.com','(515) 422-2668',
  'I am a junior at Iowa State University majoring in Health and exercise science. I was also a former Simpson athlete on which I played football for the storm,while both colleges aren''t too far from where I grew up either . I was born and raised in Des Moines IA.  In Des Moines I am an alumni from Herbert Hoover high school where I played Football, Basketball, and was also a thrower for the track and field team. I knew of sports growing up but never thought that I''d be involved with sports, My first time officially playing for a team wasn''t until my freshman year and I also didn''t play football until my junior year. Doing so has made me become who I am today, I''ve learned that taking every opportunity that is given to me is a risk and I should always be open minded about them but always be willing to take the risk.',
  'Sports has always been with me growing up, sports was also help mentally, physically, and emotionally whenever i needed to bring myself back to 100 sports was always a safe place for me to recover and recoup myself. Sports can also lead you places you''ve never imagined as well that''s why being to share what I''ve learned about being active and share in that knowledge I have to the younger generation.',
  'profiles/tyson_luu_profile.jpg','bio_pics/tyson_luu_cs_1.jpg','bio_pics/tyson_luu_cs_2.jpg','Des Moines, IA','OsbBqVbKdRcKRL6xXIV5rJ8RBND2'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM Coach WHERE Firebase_ID='OsbBqVbKdRcKRL6xXIV5rJ8RBND2');

INSERT INTO Coach (First_Name, Last_Name, Email, Phone, Biography_1, Biography_2, Profile_Pic, Bio_Pic_1, Bio_Pic_2, Location, Firebase_ID)
SELECT 'Ryan','Pangier','ryan.pangier15@gmail.com','612-900-4998',
  'I am a Senior at UW-Stout majoring in Plastics Engineering. I am from Eagan, MN. I like to hang out with family & friends and do many fun indoor or outdoor activities. I am excited to join the Universal Athletics family and hope we can make a difference together!',
  'This gives us the opportunity to teach younger athletes the skills and talent that we possess or have the knowledge of; passing everything we know on to them. Sports is all about a team effort and building ourselves to reach those expectations or goals. It is also about having fun and creating strong bonds with one another. With our assistance and intuition, I believe the young athletes will understand the criteria in sports, ways of achieving their goals and aspirations, and building up their confidence levels which will brighten up the future.',
  'profiles/ryan_pangier_profile.jpg','bio_pics/ryan_pangier_cs_1.jpg','bio_pics/ryan_pangier_cs_2.jpg','Twin Cities, MN','EeEVX2smaGV8FP1LZxWELhV62A62'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM Coach WHERE Firebase_ID='EeEVX2smaGV8FP1LZxWELhV62A62');

INSERT INTO Coach (First_Name, Last_Name, Email, Phone, Biography_1, Biography_2, Profile_Pic, Bio_Pic_1, Bio_Pic_2, Location, Firebase_ID)
SELECT 'Gavin','Hegstrom','gavin.hegstrom@gmail.com','515-446-1395',
  'I am a current junior at The University of Northern Iowa majoring in physical education with a minor in coaching. I am from Perry, Iowa. I am a big sports guy, as I enjoy watching college football and basketball along with the MLB and the NFL. I love to be outdoors and I also love to be active. I can’t wait to get to work! I''m a big sports guy, as I enjoy watching college football and basketball along with the MLB and the NFL. I love to be outdoors and I like to be active. I can''t wait to get to work!',
  'Universal Athletics is a gateway for the next generation of athletes. It allows kids with a passion for sports develop their abilities and learn new skills. It also gives me the opportunity to gain experience as a coach while learning tons of new things! UA also allows all of us the opportunity to engage and build relationships with young athletes. Sports are truly one of the most amazing things in this world, and having the opportunity to spread the knowledge I''ve gained from being a part of a college program is very exciting, to say the least!',
  'profiles/gavin_hegstrom_profile.jpg','bio_pics/gavin_hegstrom_cs_1.jpg','bio_pics/gavin_hegstrom_cs_2.jpg','Cedar Falls, IA','Qo5gME59Qyct6z4523N5ESAjKME3'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM Coach WHERE Firebase_ID='Qo5gME59Qyct6z4523N5ESAjKME3');

INSERT INTO Coach (First_Name, Last_Name, Email, Phone, Biography_1, Biography_2, Profile_Pic, Bio_Pic_1, Bio_Pic_2, Location, Firebase_ID)
SELECT 'Caden','Heck','cadenheck3@gmail.com','(515) 518-9700',
  'I am 20 with a certification in Personal Training, Corrective Exercise, and Nutrition. Born and raised in Perry, IA. Stayed busy playing football, basketball, golf, and baseball. I was in the Air Force for a little bit before getting medically discharged. I coach football for Perry High School, calling offensive plays for the Junior Varsity level. For varsity, I was up in the box telling the coaches down on the field what the defense the opponent was in and what I thought would work best for us on the offensive side of the ball. Now I’m at the University of Northern Iowa to become a PE teacher. I enjoy watching most sports. Mainly football and golf. I like to golf whenever I get the chance if the weather lets me.',
  'Universal Athletics gives student athletes the opportunity to put in the work and get better outside of practice and lifting. Also gives kids a great chance to network with other athletes and learn from, not only us coaches, but other athletes. Going with that, this gives us coaches to spread our knowledge on to the next generation. As coaches, we love watching other people progress and turn into the best versions of themselves. ',
  'profiles/caden_heck_profile.jpg','bio_pics/caden_heck_cs_1.jpg','bio_pics/caden_heck_cs_2.jpg','Cedar Falls, IA','4wA38YbS8Xc5yc4Zf1jkRgji6Os2'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM Coach WHERE Firebase_ID='4wA38YbS8Xc5yc4Zf1jkRgji6Os2');

INSERT INTO Coach (First_Name, Last_Name, Email, Phone, Biography_1, Biography_2, Profile_Pic, Bio_Pic_1, Bio_Pic_2, Location, Firebase_ID)
SELECT 'Ben','Towle','benjamintowle04@gmail.com','651-399-6269',
  'I am a recent alumni  at Iowa State University with a Degree in Computer Engineering. I grew up in and currently live in Eagan, MN. I enjoy hanging out with friends and family, trying new things, and staying active in my daily life. My favorite sport is Basketball, but I also enjoy coaching football at a more beginner level I am excited to be a part of the Universal Athletics team and make a lasting impact on individuals near and far.',
  'Universal Athletics means to be a part of something greater than myself. At UA, we strive to reach out to our local communities and bring people together through sports and activities. In addition to building stronger minds and bodies, I believe our greatest impact is in building strong and inclusive communities for people who strive to better themselves',
  'profiles/ben_towle_profile.jpg','bio_pics/ben_towle_cs_1.jpg','bio_pics/ben_towle_cs_2.jpg','Twin Cities, MN','zwSdb6VTETgdxn7LAnAkkFHiTW63'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM Coach WHERE Firebase_ID='zwSdb6VTETgdxn7LAnAkkFHiTW63');

INSERT INTO Coach (First_Name, Last_Name, Email, Phone, Biography_1, Biography_2, Profile_Pic, Bio_Pic_1, Bio_Pic_2, Location, Firebase_ID)
SELECT 'Mekhi','Holmes','allhuncho1@gmail.com','(314)-915-1640',
  'My name is Mekhi Holmes or K1. I am a senior  at Simpson College majoring in sociology and a 3 year starting defensive back for the Simpson Storm football team. My hometown is St. Louis MO, where I went to Hazelwood East High School and played football, baseball, and wrestling. I ended up playing crucial roles for each of those teams I have been on. Coming into college, I just wanted to prove myself to myself, and I put my head down to work with intent and get better every single day. There is nothing more beautiful than the process itself. My passion is helping people in any way possible and watching them turn what they learned and experienced through their journey into success in any possible form. I believe I can help your game mentally and physically. I am excited to start my process through Universal Athletics and be a part of a great group of people!',
  'Universal Athletics gives athletes who are looking to improve in their sport the opportunity to gain a competitive advantage! For athletes who aspire to play on the next level or just want to be more confident and controlled within their game, UA offers personal training to enhance their performance and comfortability. As a coach I am extremely happy to help in the development of our future athletes',
  'profiles/mekhi_holmes_profile.jpg','bio_pics/mekhi_holmes_cs_1.jpg','bio_pics/mekhi_holmes_cs_2.jpg','Indianola, IA','0YRttf0VsaWPfjCOCokAe6FVk3K3'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM Coach WHERE Firebase_ID='0YRttf0VsaWPfjCOCokAe6FVk3K3');

INSERT INTO Coach (First_Name, Last_Name, Email, Phone, Biography_1, Biography_2, Profile_Pic, Bio_Pic_1, Bio_Pic_2, Location, Firebase_ID)
SELECT 'CJ','Hangartner','changartner3@gmail.com','(520)-909-8854',
  'I am currently a senior at Simpson College majoring in psychology, I am blessed enough to be allowed to play the game of football for as long as I have. With this experience at this level being a 3-year starter, I would love to pass on my knowledge of the game and what techniques helped me succeed and be the player I am. I am originally from Tucson, Arizona, and spent the first 18 years of my life there. At Cienega High School, I participated in football, baseball, and wrestling. I ended up playing crucial roles for each of those teams I have been on. Coming into college, I just wanted to prove myself to myself, and I put my head down to work with intent and get better every single day. At UA I will be able to help individuals who seek to better themselves no matter what obstacle is in their way. I remember when I was playing sports at a young age and my eyes would light up with every opportunity, and I can not wait to optimize that sparkle for them.',
  'After speaking with Max, I was able to get an understanding of how this job is meant to be. After reflecting on that conversation, I was able to come up with an understanding of what UA really means to me. This opportunity would allow me to express my true emotions and self worth. I will be able to help individuals who seek to better themselves no matter what obstacle is in their way. I remember when I was playing sports at a young age and my eyes would light up with every opportunity, and I can not wait to optimize that sparkle for them. I also love growing and with the leaders this company has I will be able to grow in every aspect of my life and I am grateful for what has to come.',
  'profiles/cj_hangartner_profile.jpg','bio_pics/cj_hangartner_cs_1.jpg','bio_pics/cj_hangartner_cs_2.jpg','Indianola, IA','KCrPD4yprSPwf0HOxTIasrbtIGA3'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM Coach WHERE Firebase_ID='KCrPD4yprSPwf0HOxTIasrbtIGA3');

-- Skills (guarded by Title)
INSERT INTO Skill (Title)
SELECT 'basketball' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM Skill WHERE Title='basketball');
INSERT INTO Skill (Title)
SELECT 'soccer' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM Skill WHERE Title='soccer');
INSERT INTO Skill (Title)
SELECT 'tennis' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM Skill WHERE Title='tennis');
INSERT INTO Skill (Title)
SELECT 'swimming' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM Skill WHERE Title='swimming');
INSERT INTO Skill (Title)
SELECT 'golf' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM Skill WHERE Title='golf');
INSERT INTO Skill (Title)
SELECT 'running' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM Skill WHERE Title='running');
INSERT INTO Skill (Title)
SELECT 'biking' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM Skill WHERE Title='biking');
INSERT INTO Skill (Title)
SELECT 'yoga' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM Skill WHERE Title='yoga');
INSERT INTO Skill (Title)
SELECT 'weightlifting' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM Skill WHERE Title='weightlifting');
INSERT INTO Skill (Title)
SELECT 'dance' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM Skill WHERE Title='dance');
INSERT INTO Skill (Title)
SELECT 'boxing' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM Skill WHERE Title='boxing');
INSERT INTO Skill (Title)
SELECT 'football' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM Skill WHERE Title='football');
INSERT INTO Skill (Title)
SELECT 'baseball' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM Skill WHERE Title='baseball');
INSERT INTO Skill (Title)
SELECT 'volleyball' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM Skill WHERE Title='volleyball');
INSERT INTO Skill (Title)
SELECT 'track_running' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM Skill WHERE Title='track_running');
INSERT INTO Skill (Title)
SELECT 'track_throwing' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM Skill WHERE Title='track_throwing');
INSERT INTO Skill (Title)
SELECT 'ultimate_frisbee' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM Skill WHERE Title='ultimate_frisbee');
INSERT INTO Skill (Title)
SELECT 'disc_golf' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM Skill WHERE Title='disc_golf');
INSERT INTO Skill (Title)
SELECT 'wrestling' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM Skill WHERE Title='wrestling');
INSERT INTO Skill (Title)
SELECT 'spikeball' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM Skill WHERE Title='spikeball');
INSERT INTO Skill (Title)
SELECT 'pickleball' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM Skill WHERE Title='pickleball');
INSERT INTO Skill (Title)
SELECT 'lacrosse' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM Skill WHERE Title='lacrosse');
INSERT INTO Skill (Title)
SELECT 'hockey' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM Skill WHERE Title='hockey');
INSERT INTO Skill (Title)
SELECT 'fishing' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM Skill WHERE Title='fishing');
INSERT INTO Skill (Title)
SELECT 'rugby' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM Skill WHERE Title='rugby');

-- Coach_Skill mappings: insert by joining Coach.Firebase_ID and Skill.Title; avoid duplicates
INSERT INTO Coach_Skill (Coach_ID, Skill_ID, Skill_Level)
SELECT c.Coach_ID, s.Skill_ID, 'ADVANCED'
FROM Coach c JOIN Skill s ON s.Title='basketball'
WHERE c.Firebase_ID='UvK1CWDJBTV9FSesc3wCnpyOZ3h2'
  AND NOT EXISTS (SELECT 1 FROM Coach_Skill cs WHERE cs.Coach_ID=c.Coach_ID AND cs.Skill_ID=s.Skill_ID);

INSERT INTO Coach_Skill (Coach_ID, Skill_ID, Skill_Level)
SELECT c.Coach_ID, s.Skill_ID, 'ADVANCED'
FROM Coach c JOIN Skill s ON s.Title='football'
WHERE c.Firebase_ID='UvK1CWDJBTV9FSesc3wCnpyOZ3h2'
  AND NOT EXISTS (SELECT 1 FROM Coach_Skill cs WHERE cs.Coach_ID=c.Coach_ID AND cs.Skill_ID=s.Skill_ID);

INSERT INTO Coach_Skill (Coach_ID, Skill_ID, Skill_Level)
SELECT c.Coach_ID, s.Skill_ID, 'ADVANCED'
FROM Coach c JOIN Skill s ON s.Title='volleyball'
WHERE c.Firebase_ID='UvK1CWDJBTV9FSesc3wCnpyOZ3h2'
  AND NOT EXISTS (SELECT 1 FROM Coach_Skill cs WHERE cs.Coach_ID=c.Coach_ID AND cs.Skill_ID=s.Skill_ID);

INSERT INTO Coach_Skill (Coach_ID, Skill_ID, Skill_Level)
SELECT c.Coach_ID, s.Skill_ID, 'BEGINNER'
FROM Coach c JOIN Skill s ON s.Title='baseball'
WHERE c.Firebase_ID='UvK1CWDJBTV9FSesc3wCnpyOZ3h2'
  AND NOT EXISTS (SELECT 1 FROM Coach_Skill cs WHERE cs.Coach_ID=c.Coach_ID AND cs.Skill_ID=s.Skill_ID);

INSERT INTO Coach_Skill (Coach_ID, Skill_ID, Skill_Level)
SELECT c.Coach_ID, s.Skill_ID, 'BEGINNER'
FROM Coach c JOIN Skill s ON s.Title='tennis'
WHERE c.Firebase_ID='UvK1CWDJBTV9FSesc3wCnpyOZ3h2'
  AND NOT EXISTS (SELECT 1 FROM Coach_Skill cs WHERE cs.Coach_ID=c.Coach_ID AND cs.Skill_ID=s.Skill_ID);

-- Additional example mappings for second coach (Tyson)
INSERT INTO Coach_Skill (Coach_ID, Skill_ID, Skill_Level)
SELECT c.Coach_ID, s.Skill_ID, 'INTERMEDIATE'
FROM Coach c JOIN Skill s ON s.Title='basketball'
WHERE c.Firebase_ID='OsbBqVbKdRcKRL6xXIV5rJ8RBND2'
  AND NOT EXISTS (SELECT 1 FROM Coach_Skill cs WHERE cs.Coach_ID=c.Coach_ID AND cs.Skill_ID=s.Skill_ID);

INSERT INTO Coach_Skill (Coach_ID, Skill_ID, Skill_Level)
SELECT c.Coach_ID, s.Skill_ID, 'BEGINNER'
FROM Coach c JOIN Skill s ON s.Title='soccer'
WHERE c.Firebase_ID='OsbBqVbKdRcKRL6xXIV5rJ8RBND2'
  AND NOT EXISTS (SELECT 1 FROM Coach_Skill cs WHERE cs.Coach_ID=c.Coach_ID AND cs.Skill_ID=s.Skill_ID);

-- Many more mappings exist in the original create.sql. Add any missing mappings similarly if you need the full set.

SET FOREIGN_KEY_CHECKS=1;

-- End of seed_production_inserts.sql
