import React from 'react';
import { View, ScrollView, Alert, Dimensions, Platform, Image} from 'react-native';
import { useState, useContext, useEffect} from 'react';
import { SkillInputButton } from '../../components/buttons/SkillInputButton';
import { HeaderText } from '../../components/text/HeaderText';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';
import { RouterProps } from '../../types/RouterProps';
import '../../../global.css';
import { LogoImageContainer } from '../../components/image_holders/LogoImageContainer';
import { UserContext } from '../../contexts/UserContext';
import { fetchSkills } from '../../../controllers/SkillsController';

interface EnterSkillsProps extends RouterProps {
    userData?: {
        firstName: string;
        lastName: string;
        phone: string;
        biography: string;
        location: string | null;
        profilePic?: string | null;
    }
}

const EnterSkills = ({ navigation, route }: EnterSkillsProps) => {
    const { width, height } = Dimensions.get('window');
    const isWeb = Platform.OS === 'web';
    const isLargeScreen = width > 768;

    // Get data from previous screen
    const previousUserData = route?.params?.userData;

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
            console.log("Loading Skills. User Data: ", userData);
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
            console.log("Loaded Skills. User Data: ", userData);
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
        // Combine all user data including any previous data and current skills
        const combinedUserData = {
            firstName: previousUserData?.firstName || userData?.firstName || '',
            lastName: previousUserData?.lastName || userData?.lastName || '',
            phone: previousUserData?.phone || userData?.phone || '',
            biography: previousUserData?.biography || (userData as any)?.biography || '',
            location: previousUserData?.location || userData?.location || null,
            skills: skills,
            profilePic: previousUserData?.profilePic || null, // Preserve profile pic
        };

        navigation.navigate("AccountSummary", { 
            combinedUserData 
        });
    };

    if (isWeb && isLargeScreen) {
        // Web Desktop Layout
        return (
            <ScrollView 
                className="flex-1 bg-gradient-to-br from-ua-blue to-blue-600"
                contentContainerStyle={{ minHeight: height }}
            >
                <View className="flex-1 justify-center items-center p-8">
                    <View className="bg-white rounded-lg p-8 w-full max-w-2xl shadow-lg">
                        {/* Header Section */}
                        <View className="items-center mb-8">
                            <View className="items-center mb-8">
                                <Image
                                    source={require('../../images/logo.png')}
                                    style={{ width:64, height: 64, marginBottom: 16 }} // 8px = very small
                                    resizeMode="contain"
                                />
                            </View>
                            <HeaderText text="What Are You Interested In?" />
                            <View className="w-16 h-1 bg-ua-blue rounded-full mt-4"></View>
                        </View>

                        {/* Skills Grid */}
                        <View className="mb-8">
                            <View className="grid grid-cols-3 gap-4">
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
                        </View>

                        {/* Continue Button */}
                        <View className="items-center">
                            <View className="w-full max-w-sm">
                                <PrimaryButton title="Continue" onPress={moveToAccountSummary} />
                            </View>
                        </View>

                        {/* Progress Indicator */}
                        <View className="flex-row justify-center items-center mt-6 space-x-2">
                            <View className="w-3 h-3 bg-ua-green rounded-full"></View>
                            <View className="w-3 h-3 bg-ua-blue rounded-full"></View>
                            <View className="w-3 h-3 bg-gray-300 rounded-full"></View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        );
    }

    // Mobile Layout 
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
