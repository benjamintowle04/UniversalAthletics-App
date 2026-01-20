-- Migration to add EXPERT to Coach_Skill.Skill_Level enum
ALTER TABLE Coach_Skill MODIFY Skill_Level ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT') NOT NULL DEFAULT 'INTERMEDIATE';
