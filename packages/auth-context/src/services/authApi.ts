import type { User } from '@bmb-inc/types';

export const fetchCurrentUser = async (): Promise<User | null> => {
  try {
    // Implement your actual API call here
    const response = await fetch('https://apps.bmbinc.com/api/auth/whoami');
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
};

export async function logout() {
    try {
        const response = await fetch('https://apps.bmbinc.com/api/auth/logout-v2', {
            credentials: 'include',
        });
        if (!response.ok) {
            return null;
        }
        return await response.json();
    } catch (error) {
        return null;
    }
}

export async function isUserAuthenticated(redirect = true) {
    try {
        const response = await fetch('https://apps.bmbinc.com/api/auth/whoami', {
            credentials: 'include',
        });
        if (!response.ok) {
            if (redirect) {
                window.location.href = 'https://apps.bmbinc.com/api/auth/login-v2';
            }
            return;
        }
        return await response.json();
    } catch (error) {
        if (redirect) {
            window.location.href = 'https://apps.bmbinc.com/api/auth/login-v2';
        }
        return;
    }
}