const { address } = useAccount();
const {
	data: userFiles,
	isLoading,
	error,
} = useReadContract({
	address: licenseValidationContract.contractAddress as `0x${string}`,
	abi: licenseValidationAbi.abi,
	functionName: 'getAllUserFiles',
	account: address,
}) as { data: UploadedFile[]; isLoading: boolean; error: any };
