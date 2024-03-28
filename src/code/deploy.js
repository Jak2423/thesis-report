const { ethers } = require('hardhat');

async function deployContract() {
	let contract;

	try {
		contract = await ethers.deployContract('LicenseMarketplace');
		await contract.waitForDeployment();

		console.log('Contracts deployed successfully.');
		return contract;
	} catch (error) {
		console.error('Error deploying contracts:', error);
		throw error;
	}
}

async function main() {
	let contract;

	try {
		contract = await deployContract();
		await saveContractAddress(contract);

		console.log('Contract deployment completed successfully.');
	} catch (error) {
		console.error('Unhandled error:', error);
	}
}

main().catch((error) => {
	console.error('Unhandled error:', error);
	process.exitCode = 1;
});
