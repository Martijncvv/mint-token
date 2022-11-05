import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	loading: false,
	address: '',
	tokenAmount: '',
}

export const accountSlice = createSlice({
	name: 'account',
	initialState,
	reducers: {
		startLoading: (state) => {
			state.loading = true
		},
		accountInfo: (state, action) => {
			state.address = action.payload.address
			state.tokenAmount = action.payload.tokenAmount
			state.loading = false
			// console.log('ACCOUNT-INFO UPDATED')
		},
	},
})

export const { accountInfo, startLoading } = accountSlice.actions

export default accountSlice.reducer
