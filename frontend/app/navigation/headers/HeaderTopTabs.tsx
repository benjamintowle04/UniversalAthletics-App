import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import GagalinText from '../../components/text/GagalinText';
import { Colors } from '../../themes/colors/Colors';

const HeaderTopTabs: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <TouchableOpacity onPress={() => (navigation as any).navigate('Home')} style={{ marginRight: 16 }}>
        <GagalinText style={{ color: Colors.uaGreen, fontSize: 16, fontWeight: '700' }}>Home</GagalinText>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => (navigation as any).navigate('Contact')} style={{ marginRight: 16 }}>
        <GagalinText style={{ color: Colors.uaRed, fontSize: 16, fontWeight: '600' }}>Contact</GagalinText>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => (navigation as any).navigate('Help')}>
        <GagalinText style={{ color: Colors.uaBlue, fontSize: 16, fontWeight: '600' }}>Help</GagalinText>
      </TouchableOpacity>
    </View>
  );
};

export default HeaderTopTabs;
