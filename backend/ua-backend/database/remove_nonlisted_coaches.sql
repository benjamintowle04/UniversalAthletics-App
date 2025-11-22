-- remove_nonlisted_coaches.sql
-- Purpose: delete all Coach records whose First_Name is NOT in the keep list
-- Keep list (first names): ryan, caden, mekhi, cj, gavin, ben, max, tyson
-- This script makes backups of affected rows into _backup tables before deleting to allow reversing.
-- Usage: Review, then run in MySQL/MariaDB client connected to the ua_database. Example:
--   mysql -u <user> -p ua_database < remove_nonlisted_coaches.sql

-- Assumptions:
-- - All coach rows are in the `Coach` table and are referenced by Coach_ID foreign keys in other tables.
-- - Foreign keys in the schema use ON DELETE CASCADE where appropriate (create.sql shows many do).
-- - Some tables (Session, Session_Request, Connection_Request) store coach IDs in columns but not as FKs; we handle them explicitly.

START TRANSACTION;

-- Safety: identify coaches to delete
CREATE TEMPORARY TABLE to_delete_coaches AS
SELECT Coach_ID, First_Name, Last_Name, Firebase_ID FROM Coach
WHERE LOWER(First_Name) NOT IN ('ryan','caden','mekhi','cj','gavin','ben','max','tyson');

SELECT COUNT(*) AS coaches_to_delete FROM to_delete_coaches;

-- Back up affected coaches
DROP TABLE IF EXISTS backup_Coach_deleted;
CREATE TABLE backup_Coach_deleted AS SELECT * FROM Coach WHERE Coach_ID IN (SELECT Coach_ID FROM to_delete_coaches);

-- Back up Member_Coach rows referencing deleted coaches
DROP TABLE IF EXISTS backup_Member_Coach_deleted;
CREATE TABLE backup_Member_Coach_deleted AS
SELECT * FROM Member_Coach WHERE Coach_ID IN (SELECT Coach_ID FROM to_delete_coaches);

-- Back up Coach_Job_Title rows referencing deleted coaches
DROP TABLE IF EXISTS backup_Coach_Job_Title_deleted;
CREATE TABLE backup_Coach_Job_Title_deleted AS
SELECT * FROM Coach_Job_Title WHERE Coach_ID IN (SELECT Coach_ID FROM to_delete_coaches);

-- Back up Session rows where Coach_ID matches
DROP TABLE IF EXISTS backup_Session_deleted;
CREATE TABLE backup_Session_deleted AS
SELECT * FROM Session WHERE Coach_ID IN (SELECT Coach_ID FROM to_delete_coaches);

-- Back up Session_Request rows where Sender or Receiver is a coach and matches
DROP TABLE IF EXISTS backup_Session_Request_deleted;
CREATE TABLE backup_Session_Request_deleted AS
SELECT * FROM Session_Request WHERE
  (Sender_Type='COACH' AND Sender_ID IN (SELECT Coach_ID FROM to_delete_coaches))
  OR (Receiver_Type='COACH' AND Receiver_ID IN (SELECT Coach_ID FROM to_delete_coaches));

-- Back up Connection_Request rows where Sender or Receiver is a coach and matches
DROP TABLE IF EXISTS backup_Connection_Request_deleted;
CREATE TABLE backup_Connection_Request_deleted AS
SELECT * FROM Connection_Request WHERE
  (Sender_Type='COACH' AND Sender_ID IN (SELECT Coach_ID FROM to_delete_coaches))
  OR (Receiver_Type='COACH' AND Receiver_ID IN (SELECT Coach_ID FROM to_delete_coaches));

-- OPTIONAL: back up any other coach-related tables if present (Coach_Skill, etc.)
DROP TABLE IF EXISTS backup_Coach_Skill_deleted;
CREATE TABLE backup_Coach_Skill_deleted AS
SELECT * FROM Coach_Skill WHERE Coach_ID IN (SELECT Coach_ID FROM to_delete_coaches);

-- Now perform deletes. Order matters when constraints are present.

-- Delete from Member_Coach (FK has ON DELETE CASCADE but we'll remove explicitly to be clear)
DELETE FROM Member_Coach WHERE Coach_ID IN (SELECT Coach_ID FROM to_delete_coaches);

-- Delete from Coach_Job_Title (FK ON DELETE CASCADE exists)
DELETE FROM Coach_Job_Title WHERE Coach_ID IN (SELECT Coach_ID FROM to_delete_coaches);

-- Delete sessions that belong to these coaches
DELETE FROM Session WHERE Coach_ID IN (SELECT Coach_ID FROM to_delete_coaches);

-- Delete session requests where sender OR receiver is a deleted coach
DELETE FROM Session_Request WHERE (Sender_Type='COACH' AND Sender_ID IN (SELECT Coach_ID FROM to_delete_coaches))
  OR (Receiver_Type='COACH' AND Receiver_ID IN (SELECT Coach_ID FROM to_delete_coaches));

-- Delete connection requests where sender OR receiver is a deleted coach
DELETE FROM Connection_Request WHERE (Sender_Type='COACH' AND Sender_ID IN (SELECT Coach_ID FROM to_delete_coaches))
  OR (Receiver_Type='COACH' AND Receiver_ID IN (SELECT Coach_ID FROM to_delete_coaches));

-- Delete coach_skill rows if table exists
DELETE FROM Coach_Skill WHERE Coach_ID IN (SELECT Coach_ID FROM to_delete_coaches);

-- Finally, delete from Coach
DELETE FROM Coach WHERE Coach_ID IN (SELECT Coach_ID FROM to_delete_coaches);

-- Verification counts
SELECT (SELECT COUNT(*) FROM backup_Coach_deleted) AS backed_up_coaches,
       (SELECT COUNT(*) FROM backup_Member_Coach_deleted) AS backed_up_member_coach,
       (SELECT COUNT(*) FROM backup_Coach_Job_Title_deleted) AS backed_up_coach_job_title,
       (SELECT COUNT(*) FROM backup_Session_deleted) AS backed_up_sessions,
       (SELECT COUNT(*) FROM backup_Session_Request_deleted) AS backed_up_session_requests,
       (SELECT COUNT(*) FROM backup_Connection_Request_deleted) AS backed_up_connection_requests;

COMMIT;

-- To restore (if you want to rollback after running):
-- 1) make sure you have empty/dropped conflicting rows, then insert back from backups
--    INSERT INTO Coach SELECT * FROM backup_Coach_deleted;
--    INSERT INTO Member_Coach SELECT * FROM backup_Member_Coach_deleted;
--    INSERT INTO Coach_Job_Title SELECT * FROM backup_Coach_Job_Title_deleted;
--    INSERT INTO Session SELECT * FROM backup_Session_deleted;
--    INSERT INTO Session_Request SELECT * FROM backup_Session_Request_deleted;
--    INSERT INTO Connection_Request SELECT * FROM backup_Connection_Request_deleted;
-- 2) Or restore a full DB backup from your backup system.

-- End of script
