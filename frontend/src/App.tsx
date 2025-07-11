import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { OperadorProvider } from '@/contexts/OperadorContext';
import { Toaster } from "@/components/ui/toaster";
import { AppRoutes } from '@/routes/routes';

const App: React.FC = () => {
    return (
        <Router>
            <OperadorProvider>
                <AppRoutes />
                <Toaster />
            </OperadorProvider>
        </Router>
    );
};

export default App;