const { writeContract, isPending, data: hash } = useWriteContract();
const { isLoading, isSuccess, isError } = useWaitForTransactionReceipt({
   hash,
});
const { isConnected, address } = useAccount();

async function onSubmit(data: z.infer<typeof formSchema>) {
   if (!isConnected) {
      connect({ connector: injected() });
   }

   if (!file) {
      toast({
         variant: "destructive",
         description: "Please select a file to upload.",
      });
      return;
   }

   setUploading(true);

   try {
      if (!thumbnail) {
         if (data.category === "Video") {
            const fileUrl = URL.createObjectURL(file);
            const thumbnailVideo = await getThumbnailForVideo(
               fileUrl,
               file.name,
            );
            setThumbnail(thumbnailVideo as File);
         }
      }
      let thumbnailRes = null;

      if (thumbnail) {
         thumbnailRes = await pinFileToIPFS(thumbnail);
      }

      const encryptedFile = await lit.encryptFile(String(fileId), file);
      const res = await pinFileToIPFS(encryptedFile);

      if (res.isDuplicate) {
         if (fileInputRef.current) {
            fileInputRef.current.value = "";
         }
         toast({
            variant: "destructive",
            description: "This file has already been uploaded.",
         });
      } else {
         writeContract({
            abi: licenseValidationAbi.abi,
            address:
               licenseValidationContract.contractAddress as `0x${string}`,
            functionName: "createFile",
            args: [
               data.fileName,
               data.description,
               data.category,
               res.IpfsHash,
               file.size,
               thumbnailRes?.IpfsHash || "",
               parseEther(String(data.price)),
            ],
         });
      }
   } catch (error) {
      console.error("Error uploading file:", error);
      toast({
         variant: "destructive",
         description:
            "An error occurred while uploading the file. Please try again.",
      });
   } finally {
      setUploading(false);
      refetch();
   }
}
