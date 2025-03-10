const BASE_URL = "http://192.168.1.246:8080";

export enum ApiRoutes {
    GET_SKILLS_ALL = `${BASE_URL}/api/skills`,
    POST_USER_ONBOARDING = `${BASE_URL}/api/onboarding`,
    MEMBERS = `${BASE_URL}/api/members`,
}