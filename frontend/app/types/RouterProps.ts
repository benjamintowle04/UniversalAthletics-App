import { NavigationProp, RouteProp } from '@react-navigation/native';

export interface RouterProps {
    navigation: NavigationProp<any, any>;
    route: RouteProp<any, any>;
}
