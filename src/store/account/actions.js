import axios from 'axios'
import { startLoading, accountInfo } from './slice'

const API_URL = 'http://localhost:4000'

export const fetchAllAccounts = async (dispatch, getState) => {
	try {
		dispatch(startLoading())
		const response = await axios.get(`${API_URL}/users`)
		console.log('response: ', response)
	} catch (e) {
		console.log(e.message)
	}
}

export const AddOrUpdateAccountInfo =
	(address, tokenAmount, mintToOther) => async (dispatch, getState) => {
		if (address.length !== 42) {
			console.log(`Error, invalid data; address: ${address} `)
			return
		}
		if (!(parseInt(tokenAmount) >= 0)) {
			console.log(`Error, invalid data; tokenAmount: ${tokenAmount} `)
			return
		}

		try {
			dispatch(startLoading())

			const account = await dispatch(fetchAccountInfo(address, true))
			if (account.message === 'NO-USER') {
				console.log('User not found, create new user')

				dispatch(postAccountInfo(address, tokenAmount, mintToOther))
			} else {
				if (account.user.tokenAmount !== parseInt(tokenAmount)) {
					console.log('User found, update user')

					dispatch(putAccountInfo(address, tokenAmount, mintToOther))
				} else {
					console.log('Accountdata update halt; No change in tokenAmount')
					// console.log('HALT, address', address)
					// console.log('HALT, tokenAmount', tokenAmount)
					// dispatch(accountInfo(address, tokenAmount))
				}
			}
		} catch (e) {
			console.log(e.message)
		}
	}

export const fetchAccountInfo =
	(address, actionsCall) => async (dispatch, getState) => {
		if (address.length !== 42) {
			console.log(`Error, invalid data; address: ${address} `)
			return
		}
		try {
			dispatch(startLoading())

			const response = await axios.get(`${API_URL}/user/${address}`)
			!actionsCall && dispatch(accountInfo(response.data.user))
			return response.data
		} catch (e) {
			console.log(e.message)
		}
	}

export const postAccountInfo =
	(address, tokenAmount, mintToOther) => async (dispatch, getState) => {
		try {
			dispatch(startLoading())
			const response = await axios.post(
				`${API_URL}/user/${address}/${tokenAmount}`
			)
			console.log('POSTAccountInfo response: ', response.data)
			!mintToOther && dispatch(accountInfo(response.data.user))
		} catch (e) {
			console.log(e.message)
		}
	}

export const putAccountInfo =
	(address, tokenAmount, mintToOther) => async (dispatch, getState) => {
		try {
			dispatch(startLoading())
			const response = await axios.put(
				`${API_URL}/user/${address}/${tokenAmount}`
			)
			console.log('PUTAccountInfo response: ', response.data)
			!mintToOther && dispatch(accountInfo(response.data.user))
		} catch (e) {
			console.log(e.message)
		}
	}

export const deleteAccountInfo = (address) => async (dispatch, getState) => {
	if (address.length !== 42) {
		console.log(`Error, invalid data; address: ${address} `)
		return
	}
	try {
		dispatch(startLoading())
		const response = await axios.delete(`${API_URL}/user/${address}`)
		console.log(response.data)
		return response.data
	} catch (e) {
		console.log(e.message)
	}
}
