import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	contractAddress: '',
	name: '',
	symbol: '',
	network: '',
}

export const tokenSlice = createSlice({
	name: 'token',
	initialState,
	reducers: {
		tokenInfo: (state, action) => {
			state.contractAddress = action.payload.contractAddress
			state.name = action.payload.tokenName
			state.symbol = action.payload.tokenSymbol
			state.network = action.payload.network
		},
	},
})

export const { tokenInfo } = tokenSlice.actions

export default tokenSlice.reducer
