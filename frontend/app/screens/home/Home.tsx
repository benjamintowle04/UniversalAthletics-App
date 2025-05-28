import { View, Text, Button, Image, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import { FIREBASE_AUTH } from '../../../firebase_config';
import { RouterProps } from '../../types/RouterProps';
import { useUser } from '../../contexts/UserContext';
import { getMemberByFirebaseId } from '../../../controllers/MemberInfoController';
import { signInWithEmailAndPassword } from 'firebase/auth';

const Home = ({ navigation }: RouterProps) => {    
  const auth = FIREBASE_AUTH;
  const { userData, setUserData, isLoading} = useUser();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const hasAttemptedSignIn = useRef(false);
  const hasAttemptedDataFetch = useRef(false);

  // Memoize user display data to prevent unnecessary re-renders
  const userDisplayData = useMemo(() => {
    if (!userData) return null;
    
    return {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone,
      biography: userData.biography,
      profilePic: userData.profilePic,
      pendingRequestsCount: userData.pendingConnectionRequests?.length || 0,
      isLoadingRequests: userData.isLoadingRequests
    };
  }, [
    userData?.firstName,
    userData?.lastName, 
    userData?.email,
    userData?.phone,
    userData?.biography,
    userData?.profilePic,
    userData?.pendingConnectionRequests?.length,
    userData?.isLoadingRequests
  ]);

  // Auto sign in - only run once when component mounts
  useEffect(() => {
    const autoSignIn = async () => {
      if (hasAttemptedSignIn.current || auth.currentUser) {
        return;
      }

      hasAttemptedSignIn.current = true;
      
      try {
        await signInWithEmailAndPassword(auth, 'test@gmail.com', 'Test123!');
        console.log('Auto sign-in successful');
      } catch (error) {
        console.error('Auto sign-in failed:', error);
      }
    }; 
    
    autoSignIn();
  }, []);

  // Fetch user data only once when authenticated
  useEffect(() => {
    const fetchUserData = async () => {
      if (hasAttemptedDataFetch.current) return;
      
      hasAttemptedDataFetch.current = true;
      
      try {
        console.log("Fetching user data by firebase ID:", auth.currentUser?.uid);
        const memberData = await getMemberByFirebaseId(auth.currentUser?.uid || "");
        console.log("Profile picture URL received:", memberData.profilePic);
        setUserData(memberData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        hasAttemptedDataFetch.current = false; // Allow retry on error
      }
    };

    if (auth.currentUser && !userData && !isLoading) {
      fetchUserData();
    }
  }, [auth.currentUser, userData, setUserData, isLoading]);

  
  // Memoize image handlers
  const handleImageLoadStart = useCallback(() => setImageLoading(true), []);
  const handleImageLoadEnd = useCallback(() => setImageLoading(false), []);
  const handleImageError = useCallback((e: any) => {
    console.error("Image loading error:", e.nativeEvent.error);
    setImageError(true);
    setImageLoading(false);
    Alert.alert("Error", "Failed to load profile image");
  }, []);

  // Show loading state while user data is being fetched
  if (isLoading || !userDisplayData) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{ marginTop: 10 }}>Loading user data...</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>First Name: {userDisplayData.firstName}</Text>
      <Text>Last Name: {userDisplayData.lastName}</Text>
      <Text>Email: {userDisplayData.email}</Text>
      <Text>Phone: {userDisplayData.phone}</Text>
      <Text>Bio: {userDisplayData.biography}</Text>
      
      {/* Display connection request info */}
      <Text style={{ marginTop: 20, fontWeight: 'bold' }}>
        Pending Connection Requests: {userDisplayData.pendingRequestsCount}
      </Text>
      
      {userDisplayData.isLoadingRequests && (
        <Text style={{ fontStyle: 'italic', color: 'gray' }}>
          Loading connection requests...
        </Text>
      )}
      
      
      {userDisplayData.profilePic ? (
        <>
          <Text>Profile Picture URL: {userDisplayData.profilePic}</Text>
          {imageLoading && <ActivityIndicator size="large" color="#0000ff" />}
          <Image
            source={{ uri: userDisplayData.profilePic }}
            style={{ 
              width: 300, 
              height: 300, 
              marginTop: 10,
              display: imageError ? 'none' : 'flex'
            }}
            resizeMode="cover"
            onLoadStart={handleImageLoadStart}
            onLoadEnd={handleImageLoadEnd}
            onError={handleImageError}
          />
          {imageError && (
            <Image
              source={require('../../images/logo.png')}
              style={{ width: 300, height: 300, marginTop: 10 }}
              resizeMode="cover"
            />
          )}
        </>
      ) : (
        <Image
          source={require('../../images/logo.png')}
          style={{ width: 300, height: 300, marginTop: 10 }}
          resizeMode="cover"
        />
      )}
    </View>
  )
}

export default Home
