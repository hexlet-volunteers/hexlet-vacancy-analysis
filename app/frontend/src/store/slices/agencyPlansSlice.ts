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

interface AgencyPlansState {
    items: Plan[];
}

const initialState: AgencyPlansState = {
    items: [],
};

const agencyPlansSlice = createSlice({
    name: 'agencyPlans',
    initialState,
    reducers: {}, 
});

export default agencyPlansSlice.reducer;