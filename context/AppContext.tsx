// context/AppContext.tsx
"use client";

import { ReactNode, createContext, useContext, useState } from "react";

const AppContext = createContext(null);

interface Props {
    children: ReactNode;
}
export function AppProvider({ children }: Props) {
    const [minimiseHeader, setMinimiseHeader] = useState<boolean>(true);
    return (
        <AppContext.Provider value={null}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    return useContext(AppContext);
}