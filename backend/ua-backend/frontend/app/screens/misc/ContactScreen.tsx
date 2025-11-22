import React from 'react';
import { View, Text, Linking } from 'react-native';
import GagalinText from '../../components/text/GagalinText';
import { Colors } from '../../themes/colors/Colors';

const ContactScreen: React.FC = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
  <GagalinText style={{ fontSize: 22, fontWeight: '700', marginBottom: 12, color: Colors.uaBlue }}>Contact Us</GagalinText>
      <Text style={{ textAlign: 'center', marginBottom: 8 }}>For More information: Reach out to universalathletics29@gmail.com</Text>
      <Text style={{ textAlign: 'center', marginBottom: 8 }}>Instagram: https://instagram.com/universal_athletics_24</Text>
      <Text style={{ textAlign: 'center', marginBottom: 8 }}>For Technical Support: Reach out to benjamintowle04@gmail.com</Text>
    </View>
  );
};

export default ContactScreen;
