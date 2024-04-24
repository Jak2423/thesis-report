
const client = new LitJsSdk.LitNodeClient({});
const chain = "sepolia";

const createAccessControlCondition = (id: string) => {
   return [
      {
         contractAddress: licenseValidationContract.contractAddress,
         chain: "sepolia",
         functionName: "isFileOwnedOrLicensed",
         functionParams: [":userAddress", id],
         functionAbi: {
            inputs: [
               {
                  internalType: "address",
                  name: "_user",
                  type: "address",
               },
               {
                  internalType: "uint256",
                  name: "_fileId",
                  type: "uint256",
               },
            ],
            name: "isFileOwnedOrLicensed",
            outputs: [
               {
                  internalType: "bool",
                  name: "isOwned",
                  type: "bool",
               },
            ],
            stateMutability: "view",
            type: "function",
         },
         returnValueTest: {
            key: "isOwned",
            comparator: "=",
            value: "true",
         },
      },
   ];
};
class Lit {
   litNodeClient: any;

   async connect() {
      await client.connect();
      this.litNodeClient = client;
   }

   async encryptFile(id: string, file: any) {
      if (!this.litNodeClient) await this.connect();
      const authSig = await LitJsSdk.checkAndSignAuthMessage({
         chain: "sepolia",
         nonce: this.litNodeClient.getLatestBlockhash() as string,
      });

      const encryptedZip = await LitJsSdk.encryptFileAndZipWithMetadata({
         evmContractConditions: createAccessControlCondition(String(id)),
         authSig,
         chain: "sepolia",
         file: file,
         litNodeClient: this.litNodeClient,
         readme: "Encrypted file",
      });

      const encryptedBlob = new Blob([encryptedZip], {
         type: "text/plain",
      });
      const encryptedFile = new File([encryptedBlob], file.name);

      return encryptedFile;
   }

   async decryptFile(file: any) {
      if (!this.litNodeClient) await this.connect();
      const authSig = await LitJsSdk.checkAndSignAuthMessage({
         chain: "sepolia",
         nonce: this.litNodeClient.getLatestBlockhash() as string,
      });

      const { decryptedFile } = await LitJsSdk.decryptZipFileWithMetadata(
         {
            file: file,
            litNodeClient: this.litNodeClient,
            authSig: authSig,
         },
      );

      return decryptedFile;
   }
}
const lit = new Lit();

export default lit;