import { createSlice } from "@reduxjs/toolkit";

export interface UserSession {
    name: string;
    userId: string | null;
    email: string;
    firebaseToken: string | null;
}

const initialState:UserSession = {
    name: "",
    userId: null,
    email: "",
    firebaseToken: null,
};

const userSessionSlice = createSlice({
    name: "userSession",
    initialState,
    reducers: {
        setUserSession: (state, action) => {
            const {name, userId, email, firebaseToken } = action.payload;
            state.name = name;
            state.userId = userId;
            state.email = email;
            state.firebaseToken = firebaseToken;
        },
        setUserName: (state, action) => {
            state.name = action.payload;
        },
        setUserEmail: (state, action) => {
            state.email = action.payload;
        },
        clearUserSession: (state) => {
            state.name = "";
            state.userId = null;
            state.email = "";
            state.firebaseToken = null;
        },
    },
});

export const { setUserSession, setUserName, setUserEmail, clearUserSession } = userSessionSlice.actions;
export default userSessionSlice.reducer;