import { View, Text, Button, Image, Alert} from 'react-native'
import React, {useContext, useEffect} from 'react'
import { FIREBASE_AUTH } from '../../firebase_config';
import { RouterProps } from '../types/RouterProps';
import { UserContext } from '../contexts/UserContext';
import { getMemberByFirebaseId } from '../../controllers/MemberInfoController';


const Home = ({ navigation }: RouterProps) => {    
  const auth = FIREBASE_AUTH;
  const userContext = useContext(UserContext);

  if (!userContext) {
    Alert.alert("Error loading User Data");
    return null;
  }
  const { userData, setUserData } = userContext;


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("Fetching user data by firebase ID:", userData.firebaseID);
        const memberData = await getMemberByFirebaseId(userData.firebaseID);
        setUserData(memberData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    console.log("Current userData:", userData);
    console.log("Image source:", { uri: userData.profilePic });
  }, [userData.profilePic]);


  console.log("Profile picture URL:", userData.profilePic);


  return (
    <View>
      <Text>{userData.firstName}</Text>
      <Text>{userData.lastName}</Text>
      <Text>{userData.email}</Text>
      <Text>{userData.phone}</Text>
      <Text>{userData.biography}</Text>

      <Image
        source={{ uri: userData.profilePic }}
        style={{ width: 300, height: 300 }} // Set explicit dimensions
        resizeMode="cover"
        defaultSource={require('../images/logo.png')}
      />  
    </View>
  )
}

export default Home
