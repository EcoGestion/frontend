import { createSlice } from "@reduxjs/toolkit";

export interface HorariosCooperativa {
    lunes: { active: boolean, from: string, to: string };
    martes: { active: boolean, from: string, to: string };
    miercoles: { active: boolean, from: string, to: string };
    jueves: { active: boolean, from: string, to: string };
    viernes: { active: boolean, from: string, to: string };
    sabado: { active: boolean, from: string, to: string };
    domingo: { active: boolean, from: string, to: string };
}

const initialState: HorariosCooperativa = {
    lunes: { active: false, from: '', to: '' },
    martes: { active: false, from: '', to: '' },
    miercoles: { active: false, from: '', to: '' },
    jueves: { active: false, from: '', to: '' },
    viernes: { active: false, from: '', to: '' },
    sabado: { active: false, from: '', to: '' },
    domingo: { active: false, from: '', to: '' },
};

const horariosCooperativaSlice = createSlice({
    name: "horariosCooperativa",
    initialState,
    reducers: {
        setHorariosCooperativa: (state, action) => {
            const { lunes, martes, miercoles, jueves, viernes, sabado, domingo } = action.payload;
            state.lunes = lunes;
            state.martes = martes;
            state.miercoles = miercoles;
            state.jueves = jueves;
            state.viernes = viernes;
            state.sabado = sabado;
            state.domingo = domingo;
        },
        clearHorariosCooperativa: (state) => {
            state.lunes = { active: false, from: '', to: '' };
            state.martes = { active: false, from: '', to: '' };
            state.miercoles = { active: false, from: '', to: '' };
            state.jueves = { active: false, from: '', to: '' };
            state.viernes = { active: false, from: '', to: '' };
            state.sabado = { active: false, from: '', to: '' };
            state.domingo = { active: false, from: '', to: '' };
        },
    },
});

export const { setHorariosCooperativa, clearHorariosCooperativa } = horariosCooperativaSlice.actions;
export default horariosCooperativaSlice.reducer;