import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import GagalinText from '../../components/text/GagalinText';
import { Colors } from '../../themes/colors/Colors';

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <GagalinText style={{ fontSize: 20, fontWeight: '700', marginBottom: 8, color: Colors.uaBlue }}>{children}</GagalinText>
);

const StepText: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Text style={{ fontSize: 15, lineHeight: 22, color: '#333', marginBottom: 8 }}>{children}</Text>
);

const HelpScreen: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={{ padding: 20, maxWidth: 1000, alignSelf: 'center' }}>
      <View style={{ marginBottom: 16, alignItems: 'center' }}>
        <GagalinText style={{ fontSize: 26, fontWeight: '800', color: Colors.uaGreen }}>Help & Support</GagalinText>
        <Text style={{ color: 'gray', marginTop: 6 }}>A quick guide to using Universal Athletics (mobile + web)</Text>
      </View>

      <View style={{ marginBottom: 18 }}>
        <SectionTitle>1) Sign up & Login</SectionTitle>
        <StepText>
          - Create an account from the Sign Up screen by providing your email, password, and profile details. After signing up you will receive a verification email if applicable. Use the Login screen to sign in anytime.
        </StepText>
        <StepText>
          - If you forget your password, go to Settings → Change Password and press the "Change Password" button. An email will be sent with password reset instructions (check spam/junk folders if you don't see it).
        </StepText>
      </View>

      <View style={{ marginBottom: 18 }}>
        <SectionTitle>2) Find coaches</SectionTitle>
        <StepText>
          - Navigate to the Coaches tab. Select "Explore Coaches" to browse available coaches.
          - Use filters (skill, location, experience) to narrow results. Tap a coach's card to open their profile and view bios, skills, and availability.
        </StepText>
      </View>

      <View style={{ marginBottom: 18 }}>
        <SectionTitle>3) Request to connect with a coach</SectionTitle>
        <StepText>
          - Open a coach's profile from Explore Coaches and tap "Send Connection Request". Add an optional message to introduce yourself.
          - The coach will receive your request and can Accept or Reject it. If accepted, the coach appears under your "My Coaches" (or "Connections") list.
        </StepText>
      </View>

      <View style={{ marginBottom: 18 }}>
        <SectionTitle>4) Booking a session (two-way requests)</SectionTitle>
        <StepText>
          - To request a session with a coach you are connected to: go to My Coaches and select the coach. Tap "Request a Session" and fill in the session details.
        </StepText>
        <StepText>
          Steps to create a session request:
        </StepText>
        <StepText>
          1. Choose a short description for the session (what you want to work on).
        </StepText>
        <StepText>
          2. Enter a location (address or facility) where the session will take place.
        </StepText>
        <StepText>
          3. Propose three convenient dates and times (the system will send all 3 to the coach).
        </StepText>
        <StepText>
          - The coach will review the three options and either Accept or Decline the request. If the coach accepts, they will select one of the three date/time options for the confirmed session.
        </StepText>
        <StepText>
          - Two-way flow: Coaches may also send session requests to you. In that case the coach will propose three options and you will select one of them when accepting.
        </StepText>
      </View>

      <View style={{ marginBottom: 18 }}>
        <SectionTitle>5) Schedule & Views</SectionTitle>
        <StepText>
          - Once a session is confirmed it will appear in your Schedule. Use Month view to see where sessions fall on the calendar and List view for a chronological list.
        </StepText>
        <StepText>
          - You can tap a session from either view to see details or cancel (if the app allows cancellation) — coaches will be notified of cancellations.
        </StepText>
      </View>

      <View style={{ marginBottom: 18 }}>
        <SectionTitle>6) Account settings</SectionTitle>
        <StepText>
          - Open the Settings tab to update your profile information (name, phone, biography, profile picture).
        </StepText>
        <StepText>
          - Change Password: pressing the change password button sends a password reset email to your registered email address. If you don't see it, check spam/junk folders.
        </StepText>
      </View>

      <View style={{ marginBottom: 18 }}>
        <SectionTitle>Tips & Best Practices</SectionTitle>
        <StepText>
          - Write a short, friendly message when sending connection requests — coaches are more likely to accept when you introduce yourself.
        </StepText>
        <StepText>
          - Propose times that are genuinely convenient; coaches may have limited availability and will choose the best matching slot.
        </StepText>
        <StepText>
          - Keep your profile up to date so coaches can learn about your goals and experience before you meet.
        </StepText>
      </View>

      <View style={{ marginTop: 24, marginBottom: 60, alignItems: 'center' }}>
        <Text style={{ color: 'gray', fontSize: 13 }}>Still need help? Contact support at benjamintowle04@gmail.com</Text>
      </View>
    </ScrollView>
  );
};

export default HelpScreen;
