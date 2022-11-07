import { useEffect, useState } from 'react'
import { useSnackbar } from 'react-simple-snackbar'
import {
	usePrepareContractWrite,
	useBalance,
	useAccount,
	useContractWrite,
	useWaitForTransaction,
	useContractRead,
} from 'wagmi'
import { ethers } from 'ethers'

import { useDispatch } from 'react-redux'
import { StoreAccountInfo } from '../store/account/actions'

import { CONTRACTADDRESS } from '../values'
import abi from '../values/abi.json'

const useDebounce = (value, delay) => {
	const [debouncedValue, setDebouncedValue] = useState(value)

	useEffect(() => {
		const timer = setTimeout(() => setDebouncedValue(value), delay || 500)

		return () => {
			clearTimeout(timer)
		}
	}, [value, delay])

	return debouncedValue
}

export const useMintTokens = () => {
	const [openSnackbar] = useSnackbar({
		position: 'top-center',
		style: {
			backgroundColor: '#92C47C',
			color: '#000000',
		},
		closeStyle: {
			color: '#000000',
		},
	})
	const [mintAddress, setMintAddress] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [txReceipt, setTxReceipt] = useState()
	const debouncedMintAddress = useDebounce(mintAddress)

	const { address } = useAccount()

	const { data: balanceData } = useBalance({
		addressOrName: address,
		token: CONTRACTADDRESS,
		watch: true,
	})

	const { data: tokenName } = useContractRead({
		address: CONTRACTADDRESS,
		abi,
		functionName: 'name',
	})

	const { config } = usePrepareContractWrite({
		address: CONTRACTADDRESS,
		abi,
		functionName: 'mint',
		args: [debouncedMintAddress, ethers.utils.parseEther('10')],
		enabled: Boolean(debouncedMintAddress),
	})

	const { data: mintData, write } = useContractWrite({
		...config,
		onError(error) {
			setIsLoading(false)
		},
	})

	useWaitForTransaction({
		hash: mintData?.hash,

		onSuccess(data) {
			openSnackbar(`Tokens minted to address: ${mintAddress}`)
			setIsLoading(false)

			setTxReceipt(data)
		},
		onError(error) {
			setIsLoading(false)
		},
	})

	const { data: mintBalanceData } = useBalance({
		addressOrName: mintAddress,
		token: CONTRACTADDRESS,
		watch: true,
	})

	const dispatch = useDispatch()
	useEffect(() => {
		const tokenAmount = mintBalanceData
			? parseInt(mintBalanceData.formatted)
			: 0

		if (mintAddress.length === 42 && tokenAmount >= 0) {
			dispatch(
				StoreAccountInfo(mintAddress, tokenAmount, address !== mintAddress)
			)
		}
		setMintAddress('')
	}, [txReceipt])

	useSnackbar({
		position: 'top-center',
		style: {
			backgroundColor: '#92C47C',
			color: '#000000',
		},
		closeStyle: {
			color: '#000000',
		},
	})

	return {
		mintAddress,
		txReceipt,
		setMintAddress,
		balanceData,
		write,
		isLoading,
		setIsLoading,
		tokenName,
		address,
	}
}
