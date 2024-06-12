import React, { createContext, useState, useEffect } from 'react';

const ThemeContext = createContext();
let initialTheme = {
    backgroundColor: "#FFFFFF",
    fontFamily: "Arial, sans-serif",
    fontColor: "#000000",
    fontSize: 20,
    lineHeight: '20px'
};

const loadTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? JSON.parse(savedTheme) : initialTheme;
};
const ReadingTheme = ({ children }) => {
    const [theme, setTheme] = useState(loadTheme);
    useEffect(() => {
        localStorage.setItem('theme', JSON.stringify(theme));
    }, [theme]);

    const updateBackgroundColor = (color) => {
        setTheme(prevTheme => ({ ...prevTheme, backgroundColor: color }));
    };

    const updateFontFamily = (fontFamily) => {
        setTheme(prevTheme => ({ ...prevTheme, fontFamily: fontFamily }));
    };

    const updateFontColor = (color) => {
        setTheme(prevTheme => ({ ...prevTheme, fontColor: color }));
    };

    const updateFontSize = (size) => {
        setTheme(prevTheme => ({ ...prevTheme, fontSize: size }));
    };

    const updateLineHeight = (lineHeight) => {
        setTheme(prevTheme => ({ ...prevTheme, lineHeight }));
    };
    return (
        <ThemeContext.Provider value={{ theme,
            updateBackgroundColor, 
            updateFontFamily, 
            updateFontColor, 
            updateFontSize, 
            updateLineHeight }}>
            {children}
        </ThemeContext.Provider>
    );
};

export  {ThemeContext, ReadingTheme};