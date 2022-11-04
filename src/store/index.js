import { configureStore } from '@reduxjs/toolkit'
import accountReducer from './account/slice'
import tokenReducer from './token/slice'

const store = configureStore({
	reducer: {
		account: accountReducer,
		token: tokenReducer,
	},
})

export default store
