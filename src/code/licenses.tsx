const { address } = useAccount();
const {
	data: userLicenses,
	isLoading,
	error,
} = useReadContract({
	address: licenseValidationContract.contractAddress as `0x${string}`,
	abi: licenseValidationAbi.abi,
	functionName: 'getAllUserLicenses',
	account: address,
}) as { data: License[]; isLoading: boolean; error: any };

function generatePDF(id: string) {
	const content = document.getElementById(id) as HTMLElement;

	const contentWidth = content.offsetWidth;
	const contentHeight = content.offsetHeight;

	html2canvas(content, { width: contentWidth, height: contentHeight }).then((canvas) => {
		const pdf = new jsPDF({
			orientation: 'l',
			unit: 'px',
			format: [contentWidth, contentHeight],
		});
		const imgData = canvas.toDataURL('image/png');

		pdf.addImage(imgData, 'PNG', 0, 0, contentWidth, contentHeight);
		pdf.save('license.pdf');
	});
}
