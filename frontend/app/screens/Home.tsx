import { View, Text, Button, Image, Alert, ActivityIndicator } from 'react-native'
import React, {useContext, useEffect, useState} from 'react'
import { FIREBASE_AUTH } from '../../firebase_config';
import { RouterProps } from '../types/RouterProps';
import { UserContext } from '../contexts/UserContext';
import { getMemberByFirebaseId } from '../../controllers/MemberInfoController';
import { signInWithEmailAndPassword } from 'firebase/auth';

const Home = ({ navigation }: RouterProps) => {    
  const auth = FIREBASE_AUTH;
  const userContext = useContext(UserContext);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  if (!userContext) {
    Alert.alert("Error loading User Data");
    return null;
  }
  const { userData, setUserData } = userContext;

   //Add automatic sign in
   useEffect(() => {
    const autoSignIn = async () => {
      try {
        await signInWithEmailAndPassword(auth, 'test@gmail.com', 'Test123!');
        console.log('Auto sign-in successful');
      } catch (error) {
        console.error('Auto sign-in failed:', error);
      }
    };
    
    autoSignIn();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("Fetching user data by firebase ID:", auth.currentUser?.uid);
        const memberData = await getMemberByFirebaseId(auth.currentUser?.uid || "");
        console.log("Profile picture URL received:", memberData.profilePic);
        setUserData(memberData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (auth.currentUser) {
      fetchUserData();
    }
  }, [auth.currentUser]);

  return (
    <View style={{ padding: 20 }}>
      <Text>First Name: {userData.firstName}</Text>
      <Text>Last Name: {userData.lastName}</Text>
      <Text>Email: {userData.email}</Text>
      <Text>Phone: {userData.phone}</Text>
      <Text>Bio: {userData.biography}</Text>
      
      {userData.profilePic ? (
        <>
          <Text>Profile Picture URL: {userData.profilePic}</Text>
          {imageLoading && <ActivityIndicator size="large" color="#0000ff" />}
          <Image
            source={{ uri: userData.profilePic }}
            style={{ 
              width: 300, 
              height: 300, 
              marginTop: 10,
              display: imageError ? 'none' : 'flex'
            }}
            resizeMode="cover"
            onLoadStart={() => setImageLoading(true)}
            onLoadEnd={() => setImageLoading(false)}
            onError={(e) => {
              console.error("Image loading error:", e.nativeEvent.error);
              setImageError(true);
              setImageLoading(false);
              Alert.alert("Error", "Failed to load profile image");
            }}
          />
          {imageError && (
            <Image
              source={require('../images/logo.png')}
              style={{ width: 300, height: 300, marginTop: 10 }}
              resizeMode="cover"
            />
          )}
        </>
      ) : (
        <Image
          source={require('../images/logo.png')}
          style={{ width: 300, height: 300, marginTop: 10 }}
          resizeMode="cover"
        />
      )}
    </View>
  )
}

export default Home
