import { createSlice } from '@reduxjs/toolkit';

type Features = {
    name: string;
}

type Plan = {
    id: string;
    name: string;
    description: string;
    price: string;
    currency: string;
    period: string;
    features: Features[];
};

interface PlansState {
    items: Plan[];
}

const initialState: PlansState = {
    items: [],
};

const plansSlice = createSlice({
    name: 'plans',
    initialState,
    reducers: {}, 
});

export default plansSlice.reducer;
