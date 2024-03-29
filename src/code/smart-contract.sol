pragma solidity ^0.8.0;

contract LicenseMarketplace {
    address public owner;

    struct File {
        uint256 id;
        address owner;
        string fileName;
        string description;
        string category;
        string fileHash;
        bool isPublic;
        uint256 createdAt;
    }

    struct License {
        uint256 licenseNumber;
        uint256 fileId;
        address owner;
        string fileName;
        string description;
        string category;
        string fileHash;
        bool isPublic;
        uint256 createdAt;
    }

    mapping(address => File[]) private userFiles;
    mapping (address => License[]) private fileLicenses;
    mapping(uint256 => bool) public usedLicenses;

    File[] public publicFiles;
    uint256 public fileId;

    constructor() {
        owner = msg.sender;
    }

    function createFile(string memory _fileName, string memory _description, string memory _category,
        string memory _fileHash, bool  _isPublic) external{
        fileId++;
        uint256 newId = fileId;

        File memory newFile = File({
            id: newId,
            owner: msg.sender,
            fileName: _fileName,
            description: _description,
            category: _category,
            fileHash: _fileHash,
            isPublic: _isPublic,
            createdAt: block.timestamp
        });

        userFiles[msg.sender].push(newFile);

        if(_isPublic) {
            publicFiles.push(newFile);
        }
    }

    function issueLicense(address _owner, uint256 _id, string memory _fileName, string memory _description, string memory _category,
        string memory _fileHash, bool  _isPublic) external {

        uint256 licNum = generateUniqueLicense();

        License memory newFile = License({
            licenseNumber: licNum,
            fileId: _id,
            owner: _owner,
            fileName: _fileName,
            description: _description,
            category: _category,
            fileHash: _fileHash,
            isPublic: _isPublic,
            createdAt: block.timestamp
        });

        fileLicenses[msg.sender].push(newFile);
    }

    function getAllPublicFiles() external view returns(File[] memory) {
        return publicFiles;
    }

    function getAllUserFiles() external view returns(File[] memory) {
        return userFiles[msg.sender];
    }

    function getAllUserLicenses() external view returns(License[] memory) {
        return fileLicenses[msg.sender];
    }


    function validateLicense(uint256 licenseNumber) external view returns (bool) {
        return usedLicenses[licenseNumber];
    }

    function getPublicFileById(uint256 _id) external view returns (File memory) {
        for (uint256 i = 0; i < publicFiles.length; i++) {
            if (publicFiles[i].id == _id) {
                return publicFiles[i];
            }
        }
        revert("Public file not found");
    }


    function getMarketplaceFiles() external view returns (File[] memory) {
        uint256 senderFilesCount = userFiles[msg.sender].length;
        uint256 totalPublicFilesCount = publicFiles.length;

        uint256 excludedFilesCount = senderFilesCount;
        for (uint256 i = 0; i < fileLicenses[msg.sender].length; i++) {
            if (fileLicenses[msg.sender][i].isPublic) {
                excludedFilesCount++;
            }
        }

        File[] memory result = new File[](totalPublicFilesCount - excludedFilesCount);
        uint256 index = 0;

        for (uint256 i = 0; i < totalPublicFilesCount; i++) {
            bool isUserFile = false;
            bool hasUserLicense = false;

            for (uint256 j = 0; j < senderFilesCount; j++) {
                if (publicFiles[i].id == userFiles[msg.sender][j].id) {
                    isUserFile = true;
                    break;
                }
            }

            for (uint256 k = 0; k < fileLicenses[msg.sender].length; k++) {
                if (publicFiles[i].id == fileLicenses[msg.sender][k].fileId) {
                    hasUserLicense = true;
                    break;
                }
            }

            if (!isUserFile && !hasUserLicense) {
                result[index] = publicFiles[i];
                index++;
            }
        }

        return result;
    }

     function generateUniqueLicense() internal returns (uint256) {
        uint256 randomNumber = uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, msg.sender)));
        uint256 license = randomNumber % 10000000000;

        while (usedLicenses[license]) {
            randomNumber = uint256(keccak256(abi.encodePacked(randomNumber, block.timestamp)));
            license = randomNumber % 10000000000;
        }

        usedLicenses[license] = true;

        return license;
    }
}