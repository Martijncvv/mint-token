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
import { AddOrUpdateAccountInfo } from '../store/account/actions'

import { contractAddress } from '../values'
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
	// const [minted, setMinted] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [txReceipt, setTxReceipt] = useState()
	const debouncedMintAddress = useDebounce(mintAddress)

	const { address } = useAccount()

	const { data: balanceData } = useBalance({
		addressOrName: address,
		token: contractAddress,
		watch: true,
	})

	const { data: tokenName } = useContractRead({
		address: contractAddress,
		abi,
		functionName: 'name',
	})

	const { config } = usePrepareContractWrite({
		address: contractAddress,
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

	const { data: TransactionReceipt } = useWaitForTransaction({
		hash: mintData?.hash,

		onSuccess(data) {
			openSnackbar(`Tokens minted to address: ${mintAddress}`)
			setIsLoading(false)
			// setMinted(true)
			setTxReceipt(data)
		},
		onError(error) {
			setIsLoading(false)
			// setMinted(false)
		},
	})

	const { data: mintBalanceData } = useBalance({
		addressOrName: mintAddress,
		token: contractAddress,
		watch: true,
	})

	const dispatch = useDispatch()
	useEffect(() => {
		console.log('txReceipt ', txReceipt)
		const tokenAmount = mintBalanceData
			? parseInt(mintBalanceData.formatted)
			: 0

		console.log('mintAddress ', mintAddress)
		console.log('tokenAmount ', tokenAmount)
		if (mintAddress.length === 42 && tokenAmount >= 0) {
			console.log('MINT UPDATE')

			dispatch(
				AddOrUpdateAccountInfo(
					mintAddress,
					tokenAmount,
					address !== mintAddress
				)
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
		// minted,
	}
}
