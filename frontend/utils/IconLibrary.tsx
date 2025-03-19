import React, { useContext } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { UserContext } from '../app/contexts/UserContext';

// Define all your icons here with a consistent interface and their skill_id
export const ICONS = {
  // Sports icons mapped to skills in the database
  basketball: {
    component: FontAwesome5,
    name: 'basketball-ball',
    skill_id: 1
  },
  soccer: {
    component: FontAwesome5,
    name: 'futbol',
    skill_id: 2
  },
  tennis: {
    component: MaterialIcons,
    name: 'sports-tennis',
    skill_id: 3
  },
  swimming: {
    component: FontAwesome5,
    name: 'swimming-pool',
    skill_id: 4
  },
  golf: {
    component: Ionicons,
    name: 'golf',
    skill_id: 5
  },
  running: {
    component: FontAwesome5,
    name: 'running',
    skill_id: 6
  },
  biking: {
    component: FontAwesome5,
    name: 'biking',
    skill_id: 7
  },
  yoga: {
    component: MaterialCommunityIcons,
    name: 'yoga',
    skill_id: 8
  },
  weightlifting: {
    component: FontAwesome5,
    name: 'dumbbell',
    skill_id: 9
  },
  dance: {
    component: MaterialCommunityIcons,
    name: 'dance-ballroom',
    skill_id: 10
  },
  boxing: {
    component: MaterialCommunityIcons,
    name: 'boxing-glove',
    skill_id: 11
  },
  football: {
    component: FontAwesome5,
    name: 'football-ball',
    skill_id: 12
  },
  baseball: {
    component: FontAwesome5,
    name: 'baseball-ball',
    skill_id: 13
  },
  volleyball: {
    component: MaterialCommunityIcons,
    name: 'volleyball',
    skill_id: 14
  },
  track_running: {
    component: MaterialIcons,
    name: 'directions-run',
    skill_id: 15
  },
  track_throwing: {
    component: MaterialCommunityIcons,
    name: 'hammer',
    skill_id: 16
  },
  ultimate_frisbee: {
    component: MaterialCommunityIcons,
    name: 'frisbee',
    skill_id: 17
  },
  disc_golf: {
    component: MaterialCommunityIcons,
    name: 'disc',
    skill_id: 18
  },
  wrestling: {
    component: MaterialCommunityIcons,
    name: 'karate',
    skill_id: 19
  },
  spikeball: {
    component: FontAwesome5,
    name: 'volleyball-ball', // Using volleyball as closest match
    skill_id: 20
  },
  pickleball: {
    component: MaterialIcons,
    name: 'sports-tennis', // Using tennis as closest match
    skill_id: 21
  }
};

export type IconName = keyof typeof ICONS;

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}

// A unified Icon component that handles the different icon types
export const Icon: React.FC<IconProps> = ({ name, size = 24, color = '#000' }) => {
  const iconConfig = ICONS[name];
  
  if (!iconConfig) {
    console.warn(`Icon "${name}" not found in icon library`);
    return null;
  }
  
  const IconComponent = iconConfig.component;
  return <IconComponent name={iconConfig.name} size={size} color={color} />;
};

// Helper function to get icon for CoachCard
export const getIconForCoachCard = (name: IconName, size: number = 16, color: string = '#000') => {
  return {
    skill_id: ICONS[name].skill_id.toString(), // Convert to string to match interface
    title: name, // Use the name as the title
    icon: <Icon name={name} size={size} color={color} />
  };
};


// Helper function to get icon by skill_id
export const getIconBySkillId = (skillId: number, size: number = 16, color: string = '#000') => {
  const iconEntry = Object.entries(ICONS).find(([_, config]) => config.skill_id === skillId);
  
  if (!iconEntry) {
    console.warn(`No icon found for skill_id: ${skillId}`);
    return null;
  }
  
  const [name] = iconEntry;
  return {
    skill_id: skillId.toString(), // Convert to string to match interface
    title: name, // Use the name as the title
    icon: <Icon name={name as IconName} size={size} color={color} />
  };
};


// Helper function to convert skill objects from API to icon objects
export const getIconsFromSkills = (skills: Array<{skill_id: number, title: string}>, size: number = 16, color: string = '#000') => {
  return skills.map(skill => {
    const iconEntry = Object.entries(ICONS).find(([_, config]) => config.skill_id === skill.skill_id);
    if (!iconEntry) return null;
    
    const [name] = iconEntry;
    return {
      skill_id: skill.skill_id.toString(), // Convert to string to match interface
      title: skill.title,
      icon: <Icon name={name as IconName} size={size} color={color} />
    };
  }).filter(icon => icon !== null); // Filter out any null icons
};
