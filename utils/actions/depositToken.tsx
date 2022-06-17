import	{ContractInterface, ethers} from	'ethers';
import	PARTNER_VAULT_ABI			from	'utils/abi/partner.vault.abi';

export async function	depositToken(
	provider: ethers.providers.Web3Provider,
	chainID: number,
	vaultAddress: string,
	amount: ethers.BigNumber
): Promise<boolean> {
	const	signer = provider.getSigner();

	try {
		const	contract = new ethers.Contract(
			(process.env.YEARN_PARTNER_CONTRACT_ADDRESS as ({[key: number]: string}))[chainID || 1],
			PARTNER_VAULT_ABI as ContractInterface,
			signer
		);
		const	transaction = await contract.deposit(
			vaultAddress,
			process.env.PARTNER_ID_ADDRESS as string,
			amount
		);
		const	transactionResult = await transaction.wait();
		if (transactionResult.status === 0) {
			console.error('Fail to perform transaction');
			return false;
		}

		return true;
	} catch(error) {
		console.error(error);
		return false;
	}
}