import { configureStore } from "@reduxjs/toolkit";
import userSessionReducer, { UserSession} from "./userSessionSlice";
import horariosCooperativaSliceReducer, { HorariosCooperativa } from "./horariosCooperativaSlice";
import userAddressSliceReducer, { UserAddress } from "./userAddressSlice";
import reciclablesCooperativaSliceReducer, { ReciclablesCooperativa } from "./reciclablesCooperativaSlice";


interface RootState {
    userSession: UserSession;
    horariosCooperativa: HorariosCooperativa;
    userAddress: UserAddress;
    reciclablesCooperativa: ReciclablesCooperativa;
}

export const store = configureStore({
    reducer: {
        userSession: userSessionReducer,
        horariosCooperativa: horariosCooperativaSliceReducer,
        userAddress: userAddressSliceReducer,
        reciclablesCooperativa: reciclablesCooperativaSliceReducer
    },
});

export type { RootState };