import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './theme/ThemeProvider';
import './i18n/config';
import { useTranslation } from 'react-i18next';

function Root() {
    const { i18n } = useTranslation();
    
    useEffect(() => {
        document.documentElement.lang = i18n.language;
    }, [i18n.language]);
    
    return <App />;
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider>
            <Root />
        </ThemeProvider>
    </StrictMode>
);
