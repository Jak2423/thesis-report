const [file, setFile] = useState<File | null>(null);
const { connect } = useConnect();
const { toast } = useToast();
const fileInputRef = useRef<HTMLInputElement>(null);

const { writeContract, isPending, error, data: hash, isError: issueError } = useWriteContract();
const { isLoading, isSuccess, isError } = useWaitForTransactionReceipt({
	hash,
});
const { isConnected } = useAccount();

async function onSubmit(data: z.infer<typeof formSchema>) {
	if (!isConnected) {
		connect({ connector: injected() });
	}
	try {
		if (!file) {
			return;
		}
		const res = await pinFileToIPFS(file);

		if (!res.isDuplicate) {
			writeContract({
				abi: licenseValidationAbi.abi,
				address: licenseValidationContract.contractAddress as `0x${string}`,
				functionName: 'createFile',
				args: [data.fileName, data.description, 'PDF', res.IpfsHash, data.isPublic],
			});

			if (isSuccess) {
				form.reset();
			}
		} else {
			if (fileInputRef.current) {
				fileInputRef.current.value = '';
			}

			toast({
				variant: 'destructive',
				description: 'This file has already been uploaded.',
			});
		}
	} catch (error) {
		console.error(error);
	}
}
