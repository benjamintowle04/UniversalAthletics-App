import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { useState } from 'react';
import { SkillInputButton } from '../components/buttons/SkillInputButton';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { HeaderText } from '../components/text/HeaderText';
import '../../global.css';


const EnterSkills = () => {

    //Will need to be refactored later once skills are in the database
    const [checked, setChecked] = useState<{ [key: string]: boolean }>({
        basketball: false,
        soccer: false,
        tennis: false,
        swimming: false,
        golf: false,
        running: false,
        biking: false,
        yoga: false,
        weightlifting: false,
        dance: false,     
        boxing: false,
        football: false,
        baseball: false,
        volleyball: false,
        track: false,
        frisbee: false,
      });

      const [skillIcon, setSkillIcon] = useState<{ [key: string]: string }>({
        basketball: "basketball-sharp",
        soccer: "football-sharp",
        tennis: "tennisball-sharp",
        swimming: "water-sharp",
        golf: "golf-sharp",
        running: "fitness-sharp",
        biking: "bicycle-sharp",
        yoga: "fitness-sharp",
        weightlifting: "barbell-sharp",
        dance: "musical-notes-sharp",
        casualGames: "game-controller-sharp",
        boxing: "boxing-glove",
        football: "american-football-sharp",
        baseball: "baseball-sharp",
        volleyball: "volleyball",
        track: "fitness-sharp",
        frisbee: "disc-sharp",
      });


    const onSkillSelected = (skill: string) => {
        setChecked({ ...checked, [skill]: !checked[skill] });
    }

    return (
        <ScrollView className="mt-12 flex-1 bg-white p-4">
            <View className="items-center">
                <Image
                    source={require('../images/logo.png')}
                    className="w-32 h-32"
                    resizeMode="contain"
                />
                <HeaderText text="What Are You Interested In?" />
            </View>
            <View className="mt-6 flex-row flex-wrap justify-between ml-2 mr-2">
                {Object.keys(checked).map((key) => (
                    <View key={key} className="mb-4">
                        <SkillInputButton
                            skill={key}
                            icon={(key === "boxing" || key === "volleyball") ? (
                                    <MaterialIcon name={skillIcon[key]} size={24} color="black" />
                                ) : (
                                    <Icon name={skillIcon[key]} size={24} color="black" />
                                )
                                }
                            checked={checked[key]}
                            onChange={() => onSkillSelected(key)}
                        />
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

export default EnterSkills;