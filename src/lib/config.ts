// Application configuration
interface Config {
  apiBaseUrl: string;
  socketUrl: string;
  environment: 'development' | 'production' | 'test';
  isDevelopment: boolean;
  isProduction: boolean;
}

const config: Config = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1',
  socketUrl: process.env.NEXT_PUBLIC_SOCKET_URL || 
           (process.env.NEXT_PUBLIC_API_BASE_URL 
             ? process.env.NEXT_PUBLIC_API_BASE_URL.replace('/api/v1', '') 
             : 'http://localhost:8000'),
  environment: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

// Validate required environment variables
if (!process.env.NEXT_PUBLIC_API_BASE_URL && typeof window === 'undefined') {
  console.warn('NEXT_PUBLIC_API_BASE_URL is not defined. Using fallback URL.');
}

export default config;