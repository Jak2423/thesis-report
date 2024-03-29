async function pinFileToIPFS(file: File): Promise<any> {
   const formData = new FormData();
   formData.append('file', file);

   const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
         pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY!,
         pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_API_SECRET!,
      },
      body: formData,
   });
   return res.json();
}
