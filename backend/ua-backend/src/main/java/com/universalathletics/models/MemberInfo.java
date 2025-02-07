package com.universalathletics.models;


public class MemberInfo {
    private int memberId;

    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String biography;
    private String profilePic;
    private String location;

    public MemberInfo() {
    }

    public MemberInfo(int memberId, String firstName, String lastName, String email, String phone, String biography, String profilePic, String location) {
        this.memberId = memberId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.biography = biography;
        this.profilePic = profilePic;
        this.location = location;
    }

    // Getters and setters
    public int getMemberId() {
        return memberId;
    }

    public void setMemberId(int memberId) {
        this.memberId = memberId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }   


    public String getPhone() {
        return phone;
    }   

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getBiography() {
        return biography;
    }

    public void setBiography(String biography) {
        this.biography = biography;
    }

    public String getProfilePic() {
        return profilePic;
    }

    public void setProfilePic(String profilePic) {
        this.profilePic = profilePic;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }


}