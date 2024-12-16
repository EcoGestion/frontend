import { createSlice } from "@reduxjs/toolkit";

export interface UserSession {
    name: string;
    userId: string | null;
    accessToken: string | null;
    email: string;
}

const initialState:UserSession = {
    name: "",
    userId: null,
    accessToken: null,
    email: "",
};

const userSessionSlice = createSlice({
    name: "userSession",
    initialState,
    reducers: {
        setUserSession: (state, action) => {
            const {name, userId, accessToken, email } = action.payload;
            state.name = name;
            state.userId = userId;
            state.accessToken = accessToken;
            state.email = email;
        },
        setUserName: (state, action) => {
            state.name = action.payload;
        },
        setUserEmail: (state, action) => {
            state.email = action.payload;
        },
        setUserAccessToken: (state, action) => {
            state.accessToken = action.payload;
        },
        setUserId: (state, action) => {
            state.userId = action.payload;
        },
        clearUserSession: (state) => {
            state.name = "";
            state.userId = null;
            state.accessToken = null;
            state.email = "";
        },
    },
});

export const { setUserSession, setUserName, setUserEmail, setUserId, clearUserSession } = userSessionSlice.actions;
export default userSessionSlice.reducer;
