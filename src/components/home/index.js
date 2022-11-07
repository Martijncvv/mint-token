import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ConnectButton } from '@rainbow-me/rainbowkit'

import { useMintTokens } from '../../hooks'
import Row from './row'

import { tokenInfo } from '../../store/token/slice'
import { selectTokenInfo } from '../../store/token/selectors'
import { selectAccountInfo } from '../../store/account/selectors'
import { StoreAccountInfo, fetchAccountInfo } from '../../store/account/actions'

import { CONTRACTADDRESS, NETWORK } from '../../values'

function Home() {
	const dispatch = useDispatch()

	const accountData = useSelector(selectAccountInfo)
	const tokenData = useSelector(selectTokenInfo)

	const {
		mintAddress,
		txReceipt,
		setMintAddress,
		balanceData,
		write,
		isLoading,
		setIsLoading,
		tokenName,
		address,
	} = useMintTokens()

	useEffect(() => {
		if (address && balanceData) {
			const tokenAmount = balanceData ? balanceData.formatted : ''
			const tokenSymbol = balanceData ? balanceData.symbol : ''
			console.log(NETWORK)
			dispatch(fetchAccountInfo(address))
			dispatch(StoreAccountInfo(address, tokenAmount * 10 ** 18))
			dispatch(
				tokenInfo({
					contractAddress: CONTRACTADDRESS,
					tokenName,
					tokenSymbol,
					network: NETWORK,
				})
			)
		}
	}, [address, balanceData, txReceipt])

	return (
		<div className="flex justify-center">
			<div className="max-w-screen-lg">
				<nav className=" flex items-center justify-end px-5 py-3 mb-3">
					<ConnectButton showBalance={false} />
				</nav>
				<div className="flex flex-wrap ml-14">
					<div>
						<Row label="Token name:" value={tokenData ? tokenData.name : ' '} />
						<Row
							label="Token symbol:"
							value={tokenData && accountData ? tokenData.symbol : ' '}
						/>
						<Row
							label="Network:"
							value={tokenData && accountData ? tokenData.network : ' '}
						/>
						<Row
							label="User address:"
							value={tokenData && accountData ? accountData.address : ''}
						/>
						<Row
							label="User balance:"
							value={
								tokenData && accountData.tokenAmount
									? accountData.tokenAmount / 10 ** 18
									: ' '
							}
						/>
					</div>
				</div>
				<div className="flex justify-center">
					<div className="flex items-center w-full max-w-sm">
						<input
							className="justify-self-stretch font-bold text-xs appearance-none bg-transparent border border-gray-200 rounded text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none md:min-w-full"
							type="text"
							value={mintAddress}
							placeholder="Insert user address here"
							aria-label="Mint address"
							onChange={(e) => setMintAddress(e.target.value)}
						/>
						<button
							disabled={!write || isLoading}
							onClick={() => {
								setIsLoading(true)
								write?.()
							}}
							className="disabled:opacity-25 enabled:hover:scale-105 transform transition bg-blue-500 hover:bg-primary text-white font-bold py-2 px-4 rounded"
							type="button"
						>
							Mint tokens
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Home
