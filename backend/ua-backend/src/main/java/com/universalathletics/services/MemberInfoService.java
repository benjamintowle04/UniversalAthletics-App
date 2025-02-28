package com.universalathletics.services;

//------------------------------- imports ------------------------------------//
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.universalathletics.entities.MemberInfoEntity;
import com.universalathletics.repositories.MemberInfoRepository;
import java.util.List;
import jakarta.persistence.EntityNotFoundException;

//--------------------- MemberInfo Service Class -----------------------------//
/**
 * MemberInfoService handles all business logic related to member operations in
 * the
 * Universal Athletics application.
 * This service layer acts as an intermediary between the controller and
 * repository layers.
 * 
 * Responsibilities:
 * - Member creation and management
 * - Member data validation
 * - Member information processing
 */
@Service
public class MemberInfoService {

    /**
     * Autowired instance of MemberInfoRepository for database operations.
     * Following Spring best practices for dependency injection.
     */
    @Autowired
    private MemberInfoRepository memberInfoRepository;

// -------------------------------- Create Member ----------------------------//
    /**
     * Creates or updates a member in the database.(POST)
     * 
     * @param memberInfo The MemberInfoEntity object containing member information
     * @return MemberInfoEntity The saved member object with generated ID
     * @throws IllegalArgumentException if memberInfo is null
     */
    public MemberInfoEntity saveMember(MemberInfoEntity memberInfo) {
        if (memberInfo == null) {
            throw new IllegalArgumentException("Member information cannot be null");
        }
        return memberInfoRepository.save(memberInfo);
    }

// -------------------------------- Get Member By ID -------------------------//
    /**
     * Retrieves a member by their ID.(GET)
     *
     * @param id The ID of the member to find
     * @return MemberInfoEntity if found
     * @throws EntityNotFoundException if member not found
     */
    public MemberInfoEntity findMemberById(Integer id) {
        return memberInfoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Member not found with id: " + id));
    }

//--------------------------------- Get All Members --------------------------//
    /**
     * Retrieves all members from the database.(GET)
     *
     * @return List<MemberInfoEntity> containing all members
     */
    public List<MemberInfoEntity> findAllMembers() {
        return memberInfoRepository.findAll();
    }

//--------------------------------- Delete Member ----------------------------//
    /**
     * Deletes a member from the database.(DELETE)
     * 
     * @param id The ID of the member to delete
     * @return String Success message indicating member deletion
     * @throws EntityNotFoundException if member not found
     */
    public String deleteMember(Integer id) {
        if (!memberInfoRepository.existsById(id)) {
            throw new EntityNotFoundException("Member not found with id: " + id);
        }
        memberInfoRepository.deleteById(id);
        return "Member with ID: " + id + " has been successfully deleted";
    }
}
