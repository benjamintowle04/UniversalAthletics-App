import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import GagalinText from '../../../components/text/GagalinText';
import { Colors } from '../../../themes/colors/Colors';

import logoImg from '../../../images/logo.png';
import home1Img from '../../../images/home1.png';
import home2Img from '../../../images/home2.jpg';

const HomeWebUI: React.FC<any> = (_props) => {
  return (
    <ScrollView className="web-container min-h-screen flex flex-col bg-gray-50">
      {/* Title Header */}
      <View className="w-full py-8 px-12 bg-white flex flex-col items-center">
        <GagalinText style={{ fontSize: 40, fontWeight: '700', color: Colors.uaBlue, marginBottom: 8 }}>
          Universal Athletics
        </GagalinText>
        <GagalinText style={{ fontSize: 18, fontWeight: '600', color: Colors.uaRed }}>
          Empowering Athletes & Coaches
        </GagalinText>
      </View>

      {/* Section 1 */}
      <View className="flex flex-col py-8 px-12 bg-white">
          <GagalinText style={{ fontSize: 28, fontWeight: '700', color: Colors.uaBlue, marginBottom: 6 }}>Welcome to Universal Athletics</GagalinText>
          <GagalinText style={{ fontSize: 16, fontWeight: '600', color: Colors.uaRed, marginBottom: 12 }}>Your journey starts here</GagalinText>
          <View className="flex flex-row items-center justify-between">
          <View className="flex-1 pr-12">
            <Text className="text-lg text-gray-700">
              At Universal Athletics, we live and breathe sports. We are a tight knit team of coaches, mentors, and former athletes who are passionate about helping the next generation level up on the field and in life.

              We bring the energy, the expertise, and the love for the game. Many of our coaches are fresh out of college, ready to pass on everything we have learned to athletes who are just as hungry to grow. Whether it is building fundamentals, sharpening advanced skills, or training across multiple sports, we know how to push athletes to be their best while keeping the process fun and motivating.

              We work with youth from mid elementary school all the way through advanced high school levels, adapting our coaching to fit every stage of development. Whether someone is picking up a new sport or chasing that varsity roster spot, we are here to guide the journey.

              Our home base is the Twin Cities Metro Area, and we are growing fast across the Midwest. Wherever we go, our mission stays the same: use the power of sports to build confidence, community, and lasting impact.

              🚀 Ready to get started? Reach out and book your first session for free. Let us make something great happen together.
            </Text>
          </View>
          <Image
            source={home1Img}
            alt="Section 1"
            className="w-96 h-96 object-contain rounded-xl shadow-lg"
          />
        </View>
      </View>

      {/* Section 2 */}
      <View className="flex flex-col py-8 px-12 bg-gray-50">
          <GagalinText style={{ fontSize: 28, fontWeight: '700', color: Colors.uaBlue, marginBottom: 6 }}>Our Mission</GagalinText>
          <GagalinText style={{ fontSize: 16, fontWeight: '600', color: Colors.uaRed, marginBottom: 12 }}>With your help</GagalinText>
          <View className="flex flex-row items-center ">
          <Image
            source={home2Img}
            alt="Section 2"
            className="object-contain rounded-xl shadow-lg"
            style={{ width: 350, height: 520, resizeMode: 'contain' }}
          />
          <View className="flex-1 pl-12">
            <Text className="text-lg text-gray-700">
              For many of us at UA, sports have been at the center of our lives from childhood through college. The practices, the games, the friendships. They shaped who we are. Stepping away from competing is not easy; you miss the adrenaline, the locker room moments, and the sense of purpose that comes with being part of a team.

              Coaching gives us the chance to reignite that passion in a new way. Instead of chasing the next win for ourselves, we get to invest that same energy into athletes who are just beginning their next chapter.

              At Universal Athletics, we value teamwork, learning through fun, and building community. Our goal is to help every athlete set meaningful goals, grow with confidence, and discover the joy that keeps us coming back to the game. We hope to give others something to look forward to, the same way we once did.
            </Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View className="w-full py-8 px-4 bg-gray-900 flex flex-col items-center mt-auto">
        <Text className="text-gray-100 text-base mb-2">Contact: info@universalathletics.com</Text>
        <Text className="text-gray-400 text-sm">© Universal Athletics. All rights reserved.</Text>
      </View>
    </ScrollView>
  );
};

export default HomeWebUI;