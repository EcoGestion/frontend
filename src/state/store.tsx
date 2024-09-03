import { configureStore } from "@reduxjs/toolkit";
import userSessionReducer, { UserSession} from "./userSessionSlice";

interface RootState {
    userSession: UserSession;
}

export const store = configureStore({
    reducer: {
        userSession: userSessionReducer
    },
});

export type { RootState };
export type AppDispatch = typeof store.dispatch;
