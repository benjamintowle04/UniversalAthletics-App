package com.universalathletics.modules.coach.service;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.when;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InOrder;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.universalathletics.modules.coach.repository.CoachRepository;

@ExtendWith(MockitoExtension.class)
public class CoachServiceUnitTest {

    @Mock
    private CoachRepository coachRepository;

    @Mock
    private EntityManager entityManager;

    @Mock
    private Query query;

    @InjectMocks
    private CoachService coachService;

    @Test
    public void deleteCoach_executesNativeDeletesInOrder() {
        Integer id = 42;

        when(coachRepository.existsById(id)).thenReturn(true);
        when(entityManager.createNativeQuery(anyString())).thenReturn(query);
        when(query.setParameter(anyString(), any())).thenReturn(query);
        when(query.executeUpdate()).thenReturn(1);

        coachService.deleteCoach(id);

        InOrder inOrder = inOrder(entityManager);
        inOrder.verify(entityManager).createNativeQuery("DELETE FROM Member_Coach WHERE Coach_ID = :id");
        inOrder.verify(entityManager).createNativeQuery("DELETE FROM Coach_Job_Title WHERE Coach_ID = :id");
        inOrder.verify(entityManager).createNativeQuery("DELETE FROM Session WHERE Coach_ID = :id");
        inOrder.verify(entityManager).createNativeQuery("DELETE FROM Session_Request WHERE (Sender_Type='COACH' AND Sender_ID = :id) OR (Receiver_Type='COACH' AND Receiver_ID = :id)");
        inOrder.verify(entityManager).createNativeQuery("DELETE FROM Connection_Request WHERE (Sender_Type='COACH' AND Sender_ID = :id) OR (Receiver_Type='COACH' AND Receiver_ID = :id)");
        inOrder.verify(entityManager).createNativeQuery("DELETE FROM Coach_Skill WHERE Coach_ID = :id");
        inOrder.verify(entityManager).createNativeQuery("DELETE FROM Coach WHERE Coach_ID = :id");
    }
}
