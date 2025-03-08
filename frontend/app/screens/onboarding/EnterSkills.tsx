import React from 'react';
import { View, ScrollView, Alert} from 'react-native';
import { useState, useContext, useEffect} from 'react';
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
     if (!userContext) {
            Alert.alert("Error Fetching User Context");
            return null;
        }
    
    const { userData, setUserData } = userContext;

    /**
     * This hook keeps track of the skills in terms of the user interface, includes a boolean checked value
     */
    const [checkedSkills, setCheckedSkills] = useState<{id: number, key: string, value: boolean }[]>([]);

    /**
     * This hook keeps track of the skills in terms of the database, includes the skill id and the skill title
     */
    const [skills, setSkills] = useState<{ skill_id: number, title: string }[]>([]);

    useEffect(() => {
        const loadSkills = async () => {
            const skillsData = await fetchSkills();
            console.log(skillsData);
            if (!skillsData) {
                console.error("Failed to fetch skills data");
                return;
            }
            const checkedSkillsArray = skillsData.map((skill: { skill_id: number, title: string }) => ({
                id: skill.skill_id,
                key: skill.title,
                value: false
            }));
            
            const skillsArray = skillsData.filter ((skill: { skill_id: number, title: string, checked: boolean }) => skill.checked)
                                          .map((skill: { skill_id: number, title: string }) => ({
                                            skill_id: skill.skill_id,
                                            title: skill.title
                                        }));
            

            setCheckedSkills(checkedSkillsArray);
            setSkills(skillsArray);
            console.log(checkedSkills)
        };
        loadSkills();
    }, []);

    const onSkillSelected = (skill: string) => {
        setCheckedSkills((prevSkills: typeof checkedSkills) => {
            const updatedSkills = prevSkills.map((skillObj) => {
                if (skillObj.key === skill) {
                    return { ...skillObj, value: !skillObj.value };
                }
                return skillObj;
            });
            return updatedSkills;
        });

        setSkills((prevSkills: typeof skills) => {
            const selectedSkill = checkedSkills.find(s => s.key === skill);
            
            if (selectedSkill) {
                const isCurrentlyChecked = !selectedSkill.value; 
                
                if (isCurrentlyChecked) {
                    return [...prevSkills, {
                        skill_id: selectedSkill.id,
                        title: selectedSkill.key
                    }];
                } else {
                    return prevSkills.filter(s => s.title !== skill);
                }
            }
            return prevSkills;
        });
    };

    const formatSkill = (skill: string) => {
        return skill.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
    };

    const moveToAccountSummary = () => {
        setUserData((prevData: typeof userData) => {
            const updatedData = { ...prevData, skills: skills };
            console.log("Updated User Data:", updatedData);
            return updatedData;
        });
        navigation.navigate("AccountSummary");
    }

    return (
        <ScrollView className="flex-1 bg-white p-4">
            <View className="items-center">
                <LogoImageContainer />
                <HeaderText text="What Are You Interested In?" />
            </View>
            <View className="mt-6 flex-row flex-wrap justify-between ml-2 mr-2">
                {checkedSkills.map(({ key, value }) => (
                    <View key={key} className="mb-4">
                        <SkillInputButton
                            skill={formatSkill(key)}
                            checked={value}
                            onChange={() => onSkillSelected(key)}
                        />
                    </View>
                ))}
            </View>
            <View className='mt-6 flex-1 items-center justify-center'>
                <View className="mx-auto w-50">
                    <PrimaryButton title="Continue" onPress={moveToAccountSummary} />
                </View>
            </View>
        </ScrollView>
    );
};

export default EnterSkills;
