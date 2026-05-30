// context/AppContext.tsx
"use client";

import { createContext, useContext, useState } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
    const [minimiseHeader, setMinimiseHeader] = useState<boolean>(true);
    return (
        <AppContext.Provider value={{ minimiseHeader, setMinimiseHeader }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    return useContext(AppContext);
}