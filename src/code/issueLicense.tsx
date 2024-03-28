const [fileHash, setFileHash] = useState('');
const { isConnected } = useAccount();

const {
	writeContract,
	isPending,
	error: writeError,
	data: hash,
	isError: issueError,
} = useWriteContract();

const { isLoading, isSuccess, isError } = useWaitForTransactionReceipt({
	hash,
});

const {
	data: file,
	isLoading: isReadLoading,
	error,
} = useReadContract({
	address: licenseValidationContract.contractAddress as `0x${string}`,
	abi: licenseValidationAbi.abi,
	functionName: 'getPublicFileById',
	args: [Number(params.id)],
}) as { data: UploadedFile; isLoading: boolean; error: any };

function issueLicense(data: UploadedFile) {
	if (isConnected) {
		writeContract({
			abi: licenseValidationAbi.abi,
			address: licenseValidationContract.contractAddress as `0x${string}`,
			functionName: 'issueLicense',
			args: [
				data.owner,
				data.id,
				data.fileName,
				data.description,
				data.category,
				data.fileHash,
				data.isPublic,
			],
		});
	}
}
