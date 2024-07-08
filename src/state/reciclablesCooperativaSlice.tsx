import { createSlice } from '@reduxjs/toolkit';

export interface ReciclablesCooperativa {
    papel: boolean;
    metal: boolean;
    vidrio: boolean;
    plastico: boolean;
    carton: boolean;
    tetraBrik: boolean;
    telgopor: boolean;
    pilas: boolean;
    aceite: boolean;
    electronicos: boolean;
}

const initialState: ReciclablesCooperativa = {
    papel: false,
    metal: false,
    vidrio: false,
    plastico: false,
    carton: false,
    tetraBrik: false,
    telgopor: false,
    pilas: false,
    aceite: false,
    electronicos: false,
};

const reciclablesCooperativaSlice = createSlice({
    name: 'reciclablesCooperativa',
    initialState,
    reducers: {
        setReciclablesCooperativa: (state, action) => {
            const { papel, metal, vidrio, plastico, carton, tetraBrik, telgopor, pilas, aceite, electronicos } = action.payload;
            state.papel = papel;
            state.metal = metal;
            state.vidrio = vidrio;
            state.plastico = plastico;
            state.carton = carton;
            state.tetraBrik = tetraBrik;
            state.telgopor = telgopor;
            state.pilas = pilas;
            state.aceite = aceite;
            state.electronicos = electronicos;
        },
        clearReciclablesCooperativa: (state) => {
            state.papel = false;
            state.metal = false;
            state.vidrio = false;
            state.plastico = false;
            state.carton = false;
            state.tetraBrik = false;
            state.telgopor = false;
            state.pilas = false;
            state.aceite = false;
            state.electronicos = false;
        },
    },
});

export const { setReciclablesCooperativa, clearReciclablesCooperativa } = reciclablesCooperativaSlice.actions;
export default reciclablesCooperativaSlice.reducer;