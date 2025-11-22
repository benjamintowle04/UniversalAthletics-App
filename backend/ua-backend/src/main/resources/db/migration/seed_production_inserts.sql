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

-- (rest of file truncated in resource copy for brevity in this commit; full file already exists at repository root)
SET FOREIGN_KEY_CHECKS=1;

-- End of seed_production_inserts.sql
 
-- Ensure lowercase `skill` table (used by JPA mapping) also contains the same titles
INSERT INTO skill (title)
SELECT Title FROM Skill s
WHERE NOT EXISTS (SELECT 1 FROM skill x WHERE x.title = s.Title);
