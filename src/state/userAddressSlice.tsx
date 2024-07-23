import { createSlice } from "@reduxjs/toolkit";

export interface UserAddress {
    calle: string;
    altura: string;
    ciudad: string;
    provincia: string;
    codigoPostal: string;
}

const initialState: UserAddress = {
    calle: '',
    altura: '',
    ciudad: '',
    provincia: '',
    codigoPostal: '',
};

const userAddressSlice = createSlice({
    name: "userAddress",
    initialState,
    reducers: {
        setUserAddress: (state, action) => {
            const { calle, altura, ciudad, provincia, codigoPostal } = action.payload;
            state.calle = calle;
            state.altura = altura;
            state.ciudad = ciudad;
            state.provincia = provincia;
            state.codigoPostal = codigoPostal;
        },
        clearUserAddress: (state) => {
            state.calle = '';
            state.altura = '';
            state.ciudad = '';
            state.provincia = '';
            state.codigoPostal = '';
        },
    },
});

export const { setUserAddress, clearUserAddress } = userAddressSlice.actions;
export default userAddressSlice.reducer;