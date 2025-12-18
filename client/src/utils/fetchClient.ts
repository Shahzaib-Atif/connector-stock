const SESSION_KEY = 'connector_stock_session_v1';

const getAuthToken = () => {
    try {
        const session = localStorage.getItem(SESSION_KEY);
        if (session) {
            const parsed = JSON.parse(session);
            return parsed.token;
        }
    } catch (e) {
        console.error("Error reading token from local storage", e);
    }
    return null;
};

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = getAuthToken();
    const headers = {
        ...options.headers,
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        // Handle unauthorized (optional: logout user)
        // localStorage.removeItem(SESSION_KEY);
        // window.location.href = '/login';
    }

    return response;
};
