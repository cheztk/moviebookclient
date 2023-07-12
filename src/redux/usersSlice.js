import {createSlice} from '@reduxjs/toolkit';

const usersSlice = createSlice({
    name: "users",
    initialState: {
        user: null,
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        }
    }
});

export const {SetUser} = usersSlice.actions;

export default usersSlice.reducer;