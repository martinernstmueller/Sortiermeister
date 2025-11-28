const getApiUrl = () => {
    if (typeof window === 'undefined') {
        return process.env.API_URL || 'http://api:8080';
    }

    if (process.env.NEXT_PUBLIC_API_URL) {
        return process.env.NEXT_PUBLIC_API_URL;
    }
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return `${protocol}//${hostname}:8080`;
    }
    return `${protocol}//${hostname}:8080`;
};

export async function fetchFromAPI(endpoint: string, options?: RequestInit) {
    const url = `${getApiUrl()}${endpoint}`;
    console.log('Fetching from:', url); // Debug log
    
    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
}