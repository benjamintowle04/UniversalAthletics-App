import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { useState, useContext } from 'react';
import { SkillInputButton } from '../../components/buttons/SkillInputButton';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { HeaderText } from '../../components/text/HeaderText';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';
import { RouterProps } from '../../types/RouterProps';
import '../../../global.css';
import { LogoImageContainer } from '../../components/image_holders/LogoImageContainer';
import { UserContext } from '../../contexts/UserContext';




const EnterSkills = ({ navigation }: RouterProps) => {
    const userContext = useContext(UserContext);
    const [userSkills, setUserSkills] = useState([]);


    //Will need to be refactored when skills can be pulled from the database
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
        track_running: false,
        track_throwing: false,
        ultimate_frisbee: false,
        disc_golf: false,
        wrestling: false,
        spikeball: false, 
        pickleball: false,
    });

    const onSkillSelected = (skill: string) => {
        setChecked({ ...checked, [skill]: !checked[skill] });
    }

    const moveToUploadProfilePicture = () => {
        navigation.navigate("UploadProfilePicture");
        console.log("Moving to Upload Profile Picture");
    } 

    return (
        <ScrollView className="flex-1 bg-white p-4">
            <View className="items-center">
                <LogoImageContainer />
                <HeaderText text="What Are You Interested In?" />
            </View>
            <View className="mt-6 flex-row flex-wrap justify-between ml-2 mr-2">
                {Object.keys(checked).map((key) => (
                    <View key={key} className="mb-4">
                        <SkillInputButton
                            skill={key}
                            checked={checked[key]}
                            onChange={() => onSkillSelected(key)}
                        />
                    </View>
                ))}
            </View>
            <View className='mt-6 flex-1 items-center justify-center'>
                <View className="mx-auto w-50">
                    <PrimaryButton title="Continue" onPress={moveToUploadProfilePicture} />
                </View>
            </View>
        </ScrollView>
    );
};

export default EnterSkills;