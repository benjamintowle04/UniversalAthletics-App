package com.universalathletics.modules.coach.service;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.transaction.annotation.Transactional;

import com.universalathletics.modules.coach.entity.CoachEntity;
import com.universalathletics.modules.coach.repository.CoachRepository;
import com.universalathletics.modules.jct.coachSkill.repository.CoachSkillRepository;
import com.universalathletics.modules.jct.memberCoach.repository.MemberCoachRepository;
import com.universalathletics.modules.requests.session.repository.SessionRequestRepository;
import com.universalathletics.modules.session.repository.SessionRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;

@DataJpaTest(properties = {
    "spring.jpa.hibernate.ddl-auto=create",
    "spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1",
    "spring.datasource.driverClassName=org.h2.Driver",
    "spring.datasource.username=sa",
    "spring.datasource.password="
})
@Import(CoachService.class)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
public class CoachServiceIntegrationTest {

    @Autowired
    private CoachService coachService;

    @Autowired
    private CoachRepository coachRepository;

    @Autowired
    private CoachSkillRepository coachSkillRepository;

    @Autowired
    private MemberCoachRepository memberCoachRepository;

    @Autowired
    private SessionRequestRepository sessionRequestRepository;

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private EntityManager entityManager;

    @Test
    @Transactional
    public void testDeleteCoachRemovesDependents() {
        // Create coach
        CoachEntity coach = new CoachEntity();
        coach.setFirstName("Test");
        coach.setLastName("Coach");
        coach.setFirebaseID("test-firebase-id-delete");
        CoachEntity saved = coachRepository.save(coach);
        Integer id = saved.getId();
        assertThat(id).isNotNull();

        // Insert dependent rows via native queries
        // Member_Coach
        Query q1 = entityManager.createNativeQuery("INSERT INTO Member_Coach (Member_ID, Coach_ID) VALUES (9999, :id)");
        q1.setParameter("id", id).executeUpdate();

        // Coach_Job_Title
        Query q2 = entityManager.createNativeQuery("INSERT INTO Coach_Job_Title (Coach_ID, Job_Title_ID) VALUES (:id, 1)");
        q2.setParameter("id", id).executeUpdate();

        // Session
        Query q3 = entityManager.createNativeQuery("INSERT INTO Session (Request_ID, Session_Date, Session_Time, Session_Location, Session_Description, Coach_ID, Coach_Firebase_ID, Coach_First_Name, Coach_Last_Name, Coach_Profile_Pic, Member_ID, Member_First_Name, Member_Last_Name, Member_Profile_Pic, Member_Firebase_ID, Created_At, Updated_At) VALUES (1, '2000-01-01', '00:00:00', 'loc', 'desc', :id, 'fb', 'Test', 'Coach', '', 9999, 'M', 'N', '', 'mfb', NOW(), NOW())");
        q3.setParameter("id", id).executeUpdate();

        // Session_Request where receiver is coach
        Query q4 = entityManager.createNativeQuery("INSERT INTO Session_Request (Sender_Type, Sender_ID, Sender_Firebase_ID, Receiver_Type, Receiver_ID, Receiver_Firebase_ID, Sender_First_Name, Sender_Last_Name, Receiver_First_Name, Receiver_Last_Name, Status, Message, Session_Date_1, Session_Date_2, Session_Date_3, Session_Time_1, Session_Time_2, Session_Time_3, Session_Location, Session_Description, Created_At, Updated_At) VALUES ('MEMBER', 9999, 'mfb', 'COACH', :id, 'cfb', 'M', 'N', 'T', 'C', 'PENDING', 'msg', '2000-01-01','2000-01-02','2000-01-03','00:00:00','00:00:00','00:00:00','loc','desc', NOW(), NOW())");
        q4.setParameter("id", id).executeUpdate();

        // Coach_Skill
        Query q5 = entityManager.createNativeQuery("INSERT INTO Coach_Skill (Coach_ID, Skill_ID, Skill_Level) VALUES (:id, 1, 'BEGINNER')");
        q5.setParameter("id", id).executeUpdate();

        entityManager.flush();

        // Verify counts before delete
        Long countCoachSkills = ((Number)entityManager.createNativeQuery("SELECT COUNT(*) FROM Coach_Skill WHERE Coach_ID = :id").setParameter("id", id).getSingleResult()).longValue();
        Long countMemberCoach = ((Number)entityManager.createNativeQuery("SELECT COUNT(*) FROM Member_Coach WHERE Coach_ID = :id").setParameter("id", id).getSingleResult()).longValue();
        Long countSession = ((Number)entityManager.createNativeQuery("SELECT COUNT(*) FROM Session WHERE Coach_ID = :id").setParameter("id", id).getSingleResult()).longValue();
        Long countReq = ((Number)entityManager.createNativeQuery("SELECT COUNT(*) FROM Session_Request WHERE Receiver_ID = :id").setParameter("id", id).getSingleResult()).longValue();
        assertThat(countCoachSkills).isGreaterThan(0);
        assertThat(countMemberCoach).isGreaterThan(0);
        assertThat(countSession).isGreaterThan(0);
        assertThat(countReq).isGreaterThan(0);

        // Call delete
        coachService.deleteCoach(id);

        // Verify deletion
        Long postCoachCount = ((Number)entityManager.createNativeQuery("SELECT COUNT(*) FROM Coach WHERE Coach_ID = :id").setParameter("id", id).getSingleResult()).longValue();
        Long postCS = ((Number)entityManager.createNativeQuery("SELECT COUNT(*) FROM Coach_Skill WHERE Coach_ID = :id").setParameter("id", id).getSingleResult()).longValue();
        Long postMC = ((Number)entityManager.createNativeQuery("SELECT COUNT(*) FROM Member_Coach WHERE Coach_ID = :id").setParameter("id", id).getSingleResult()).longValue();
        Long postSess = ((Number)entityManager.createNativeQuery("SELECT COUNT(*) FROM Session WHERE Coach_ID = :id").setParameter("id", id).getSingleResult()).longValue();
        Long postReq = ((Number)entityManager.createNativeQuery("SELECT COUNT(*) FROM Session_Request WHERE Receiver_ID = :id OR Sender_ID = :id").setParameter("id", id).getSingleResult()).longValue();

        assertThat(postCoachCount).isEqualTo(0);
        assertThat(postCS).isEqualTo(0);
        assertThat(postMC).isEqualTo(0);
        assertThat(postSess).isEqualTo(0);
        assertThat(postReq).isEqualTo(0);
    }
}
