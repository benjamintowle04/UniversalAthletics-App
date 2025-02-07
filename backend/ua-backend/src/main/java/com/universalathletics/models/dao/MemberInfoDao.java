package com.universalathletics.models.dao;


import com.universalathletics.models.MemberInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class MemberInfoDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<MemberInfo> getAllMembers() {
        String sql = "SELECT * FROM Member_Info";
        return jdbcTemplate.query(sql, new MemberInfoRowMapper());
    }

    public void saveMember(MemberInfo memberInfo) {
        String sql = "INSERT INTO Member_Info (First_Name, Last_Name, Email, Phone, Biography, Profile_Pic, Location) VALUES (?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql, memberInfo.getFirstName(), memberInfo.getLastName(), memberInfo.getEmail(), memberInfo.getPhone(), memberInfo.getBiography(), memberInfo.getProfilePic(), memberInfo.getLocation());
    }

    private static class MemberInfoRowMapper implements RowMapper<MemberInfo> {
        @Override
        public MemberInfo mapRow(ResultSet rs, int rowNum) throws SQLException {
            MemberInfo memberInfo = new MemberInfo();
            memberInfo.setMemberId(rs.getInt("Member_ID"));
            memberInfo.setFirstName(rs.getString("First_Name"));
            memberInfo.setLastName(rs.getString("Last_Name"));
            memberInfo.setEmail(rs.getString("Email"));
            memberInfo.setPhone(rs.getString("Phone"));
            memberInfo.setBiography(rs.getString("Biography"));
            memberInfo.setProfilePic(rs.getString("Profile_Pic"));
            memberInfo.setLocation(rs.getString("Location"));
            return memberInfo;
        }
    }
}
