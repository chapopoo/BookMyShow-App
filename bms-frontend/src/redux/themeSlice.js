import { createSlice } from "@reduxjs/toolkit";

const savedTheme = localStorage.getItem("theme") || "light";

const themeSlice = createSlice({
    name: "theme",
    initialState: {
        mode: savedTheme,
    },
    reducers: {
        toggleTheme: (state) => {
            state.mode = state.mode === "light" ? "dark" : "light";
            // Save the updated theme to localStorage
            localStorage.setItem("theme", state.mode);
            document.documentElement.setAttribute("data-theme", state.mode);
        },
        initTheme: (state) => {
            // Call on app load to restore saved theme
            document.documentElement.setAttribute("data-theme", state.mode);
        },
    }
});

export const { toggleTheme, initTheme } = themeSlice.actions;
export default themeSlice.reducer;

