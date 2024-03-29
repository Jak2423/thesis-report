const { address } = useAccount();

const {
	data: marketFiles,
	isLoading,
	error,
} = useReadContract({
	address: licenseValidationContract.contractAddress as `0x${string}`,
	abi: licenseValidationAbi.abi,
	functionName: 'getPublicFilesExceptUser',
	account: address,
}) as { data: UploadedFile[]; isLoading: boolean; error: any };
