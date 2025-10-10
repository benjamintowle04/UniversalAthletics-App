import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import GagalinText from '../../../components/text/GagalinText';
import { Colors } from '../../../themes/colors/Colors';

const placeholderImg = require('../../../images/logo.png');

const HomeMobileUI: React.FC<any> = (_props) => {
  return (
    <ScrollView className="flex-1 bg-white">
      {/* Section 1 */}
      <View className="flex flex-col items-center py-8 px-4 bg-gray-50">
        <Image
          source={require('../../../images/home1.png')}
          className="w-56 h-56 rounded-xl mb-4"
          resizeMode="contain"
        />
        <GagalinText style={{ fontSize: 20, fontWeight: '700', color: Colors.uaBlue, marginBottom: 8, textAlign: 'center' }}>Welcome to Universal Athletics</GagalinText>
        <Text className="text-base text-gray-700 text-center">
          At Universal Athletics, we live and breathe sports. We are a tight-knit team of coaches, mentors, and former athletes who are passionate about helping the next generation level up — on the field and in life.

          We bring the energy, the expertise, and the love for the game. Many of our coaches are fresh out of college, ready to pass on everything we have learned to athletes who are just as hungry to grow. Whether it is building fundamentals, sharpening advanced skills, or training across multiple sports, we know how to push athletes to be their best while keeping the process fun and motivating.

          We work with youth from mid elementary school all the way through advanced high school levels, adapting our coaching to fit every stage of development. Whether someone is picking up a new sport or chasing that varsity roster spot, we are here to guide the journey.

          Our home base is the Twin Cities Metro Area, and we are growing fast across the Midwest. Wherever we go, our mission stays the same: use the power of sports to build confidence, community, and lasting impact.

          Ready to get started? Reach out and book your first session for free — let us make something great happen together.
         </Text>
      </View>

      {/* Section 2 */}
      <View className="flex flex-col items-center py-8 px-4 bg-white">
        <Image
          source={require('../../../images/home2.jpg')}
          className="w-56 h-56 rounded-xl mb-4"
          resizeMode="contain"
        />
        <GagalinText style={{ fontSize: 20, fontWeight: '700', color: Colors.uaBlue, marginBottom: 8, textAlign: 'center' }}>Discover Our Features</GagalinText>
        <Text className="text-base text-gray-700 text-center">
          For many of us at UA, sports have been at the center of our lives from childhood through college. The practices, the games, the friendships — they shaped who we are. Stepping away from competing is not easy; you miss the adrenaline, the locker room moments, and the sense of purpose that comes with being part of a team.

          Coaching gives us the chance to reignite that passion in a new way. Instead of chasing the next win for ourselves, we get to invest that same energy into athletes who are just beginning their next chapter.

          At Universal Athletics, we value teamwork, learning through fun, and building community. Our goal is to help every athlete set meaningful goals, grow with confidence, and discover the joy that keeps us coming back to the game. We hope to give others something to look forward to — the same way we once did.
        </Text>
      </View>

      {/* Footer */}
      <View className="w-full py-6 px-4 bg-gray-900 items-center mt-8">
        <Text className="text-gray-100 text-base mb-2">Contact: universalathletics29@gmail.com</Text>
      </View>
    </ScrollView>
  );
};

export default HomeMobileUI;