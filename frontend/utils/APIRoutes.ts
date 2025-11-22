// Production Heroku backend URL
const BASE_URL = "https://ua-backend-app-cb2d657adc39.herokuapp.com";

export const ApiRoutes = {
    GET_SKILLS_ALL: `${BASE_URL}/api/skills`,
    POST_USER_ONBOARDING: `${BASE_URL}/api/onboarding`,
    MEMBERS: `${BASE_URL}/api/members`,
    COACHES: `${BASE_URL}/api/coaches`,
    CONNECTION_REQUESTS: `${BASE_URL}/api/requests/connections`,
    PENDING_CONNECTION_REQUESTS: `${BASE_URL}/api/requests/connections/pending`,
    SESSION_REQUESTS: `${BASE_URL}/api/requests/sessions`,
    PENDING_SESSION_REQUESTS: `${BASE_URL}/api/requests/sessions/pending`,
    SESSIONS: `${BASE_URL}/api/sessions`,
} as const