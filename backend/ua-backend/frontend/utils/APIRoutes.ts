// Use relative API paths so Netlify can proxy /api/* to backend (avoids CORS)
const BASE_URL = "";

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