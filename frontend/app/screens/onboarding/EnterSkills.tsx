import React from 'react';
import { View, ScrollView } from 'react-native';
import { useState, useContext, useEffect } from 'react';
import { SkillInputButton } from '../../components/buttons/SkillInputButton';
import { HeaderText } from '../../components/text/HeaderText';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';
import { RouterProps } from '../../types/RouterProps';
import '../../../global.css';
import { LogoImageContainer } from '../../components/image_holders/LogoImageContainer';
import { UserContext } from '../../contexts/UserContext';
import { fetchSkills } from '../../../controllers/SkillsController';




const EnterSkills = ({ navigation }: RouterProps) => {
    const userContext = useContext(UserContext);
    const [checkedSkills, setCheckedSkills] = useState<{key: string, value: boolean }[]>([]);


    useEffect(() => {
        const loadSkills = async () => {
            const skillsData = await fetchSkills();
            console.log(skillsData);
            // if (!skillsData) {
            //     console.error("Failed to fetch skills data");
            //     return;
            // }
            // const skillsArray = skillsData.map((skill: { title: string }) => ({
            //     key: skill.title,
            //     value: false,
            // }));

            // setCheckedSkills(skillsArray);
        };
        loadSkills();
    }, []);

    // const onSkillSelected = (skill: string) => {
    //     setCheckedSkills((prevSkills) => {
    //         const updatedSkills = prevSkills.map((skillObj) => {
    //             if (skillObj.key === skill) {
    //                 return { ...skillObj, value: !skillObj.value };
    //             }
    //             return skillObj;
    //         });
    //         return updatedSkills;
    //     });
    // };

    const moveToUploadProfilePicture = () => {
        navigation.navigate("AccountSummary");
        console.log("Moving to Upload Profile Picture");
    } 

    return (
        <ScrollView className="flex-1 bg-white p-4">
            <View className="items-center">
                <LogoImageContainer />
                <HeaderText text="What Are You Interested In?" />
            </View>
            <View className="mt-6 flex-row flex-wrap justify-between ml-2 mr-2">
                {/*Object.keys(checkedSkills).map((key: string) => (
                    <View key={key} className="mb-4">
                        <SkillInputButton
                            skill={key}
                            checked={checkedSkills.find((skillObj) => skillObj.key === key)?.value || false}
                            onChange={() => onSkillSelected(key)}
                        />
                    </View>
                ))*/}
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