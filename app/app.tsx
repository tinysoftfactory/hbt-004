import AddHabitScreen from "@/app/screens/add";
import MainScreen from "@/app/screens/main";
import {memo, useCallback, useEffect, useState} from "react";
import Initializer from "@/app/model/initializer";

const App = () => {
    const [currentScreen, setCurrentScreen] = useState<'main' | 'add'>('main');
    const [refreshKey, setRefreshKey] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            await Initializer.getInstance().initialize();
            setIsLoading(false);
        })();
    }, []);

    const handleAddHabit = useCallback(() => {
        setCurrentScreen('add');
    }, []);

    const handleBackFromAdd = useCallback(() => {
        setCurrentScreen('main');
        // Trigger refresh of main screen
        setRefreshKey(prev => prev + 1);
    }, []);

    const renderScreen = () => {
        if (isLoading) {
            return null;
        }

        switch (currentScreen) {
            case 'add':
                return <AddHabitScreen onBack={handleBackFromAdd} />;
            default:
                return <MainScreen key={refreshKey} onAdd={handleAddHabit} />;
            }
    };

    return renderScreen();
};

export default memo(App);
