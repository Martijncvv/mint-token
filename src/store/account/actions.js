import axios from 'axios'
import { startLoading, accountInfo } from './slice'
import { SERVER_API_BASE_URL } from '../../values'

/// @notice Fetches all user data
/// @return Data of all users
export const fetchAllAccounts = async (dispatch, getState) => {
	try {
		dispatch(startLoading())
		const response = await axios.get(`${SERVER_API_BASE_URL}/users`)
		return response.data
	} catch (e) {
		console.log(e.message)
	}
}

/// @notice Store account info
/// @notice Verifies input
/// @notice Verifies if user already exists in DB and if any data changed
/// @notice Calls POST or PUT request if needed
/// @param address, string: Address of user
/// @param tokenAmount, string: Token amount of user in wei format
/// @param noStoreUpdate?, boolean: TRUE to avoid accountStore update
export const StoreAccountInfo =
	(address, tokenAmount, noStoreUpdate) => async (dispatch, getState) => {
		if (address.length !== 42) {
			console.log(`Error, invalid data; address: ${address} `)
			return
		}
		if (!(Number(tokenAmount) >= 0)) {
			console.log(`Error, invalid data; tokenAmount: ${tokenAmount} `)
			return
		}

		try {
			dispatch(startLoading())

			const account = await dispatch(fetchAccountInfo(address, true))

			if (account.message === 'NO-USER') {
				console.log('User not found, create new user')

				dispatch(postAccountInfo(address, tokenAmount, noStoreUpdate))
			} else {
				if (Number(account.user.tokenAmount) !== Number(tokenAmount)) {
					console.log('User found, update user')
					dispatch(putAccountInfo(address, tokenAmount, noStoreUpdate))
				} else {
					console.log('Accountdata update halt; No change in tokenAmount')
				}
			}
		} catch (e) {
			console.log(e.message)
		}
	}

/// @notice Fetches account info and updates AccountStore
/// @param address, string: Address of user
/// @param noStoreUpdate?, boolean: TRUE to avoid accountStore update
/// @return User data
export const fetchAccountInfo =
	(address, noStoreUpdate) => async (dispatch, getState) => {
		if (address.length !== 42) {
			console.log(`Error, invalid data; address: ${address} `)
			return
		}
		try {
			dispatch(startLoading())

			const response = await axios.get(`${SERVER_API_BASE_URL}/user/${address}`)
			!noStoreUpdate && dispatch(accountInfo(response.data.user))
			return response.data
		} catch (e) {
			console.log(e.message)
		}
	}

/// @notice Stores new account info and updates AccountStore
/// @param address, string: Address of user
/// @param tokenAmount, string: Token amount of user in wei format
/// @param noStoreUpdate?, boolean: TRUE to avoid accountStore update
/// @return User data
export const postAccountInfo =
	(address, tokenAmount, noStoreUpdate) => async (dispatch, getState) => {
		try {
			dispatch(startLoading())

			const response = await axios.post(
				`${SERVER_API_BASE_URL}/user/${address}/${tokenAmount}`
			)
			console.log('POSTAccountInfo response: ', response.data)
			!noStoreUpdate && dispatch(accountInfo(response.data.user))
		} catch (e) {
			console.log(e.message)
		}
	}

/// @notice Updates account info and updates AccountStore
/// @param address, string: Address of user
/// @param tokenAmount, string: Token amount of user in wei format
/// @param noStoreUpdate?, boolean: TRUE to avoid accountStore update
/// @return User data
export const putAccountInfo =
	(address, tokenAmount, noStoreUpdate) => async (dispatch, getState) => {
		try {
			dispatch(startLoading())
			const response = await axios.put(
				`${SERVER_API_BASE_URL}/user/${address}/${tokenAmount}`
			)
			console.log('PUTAccountInfo response: ', response.data)
			!noStoreUpdate && dispatch(accountInfo(response.data.user))
		} catch (e) {
			console.log(e.message)
		}
	}

/// @notice Delete account info
/// @param address, string: Address of user
/// @return Deleted user data
export const deleteAccountInfo = (address) => async (dispatch, getState) => {
	if (address.length !== 42) {
		console.log(`Error, invalid data; address: ${address} `)
		return
	}
	try {
		dispatch(startLoading())
		const response = await axios.delete(
			`${SERVER_API_BASE_URL}/user/${address}`
		)
		console.log(response.data)
		return response.data
	} catch (e) {
		console.log(e.message)
	}
}
