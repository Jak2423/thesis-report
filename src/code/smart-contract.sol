// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LicenseMarketplace {
   address public owner;

   struct File {
        uint256 id;
        address fileOwner;
        string fileName;
        string description;
        string category;
        string fileCid;
        string imgUrl;
        uint256 fileSize;
        uint256 createdAt;
        uint256 price;
   }

   struct License {
        uint256 licenseNumber;
        uint256 fileId;
        address fileOwner;
        address buyer;
        string fileName;
        string description;
        string category;
        string fileCid;
        string imgUrl;
        uint256 fileSize;
        uint256 createdAt;
        uint256 price;
   }

   struct LicenseRequest {
        uint256 requestId;
        uint256 fileId;
        string fileName;
        address requester;
        address fileOwner;
        uint256 requestedAt;
        bool isApproved;
        uint256  assetPrice;
   }

      mapping(address => File[]) private userFiles;
      mapping (address => License[]) private fileLicenses;
      mapping (uint256 => LicenseRequest) private licenseRequests;

      mapping(uint256 => bool) public usedLicenses;

      mapping(address => uint256) private userFund;
      mapping(address => uint256) private userFundWithdrawable;

      File[] public publicFiles;

      uint256 public fileId;
      uint256 public requestId;

      event FileShared(address indexed  owner, string fileName);
      event FileLicense(address indexed  owner, address indexed  buyer, string fileName);
      event LicenseRequestCreated(uint256 indexed requestId, uint256 fileId, address requester, address fileOwner);
      event LicenseRequestApproved(uint256 indexed requestId, uint256 fileId, address requester, address fileOwner);
      event LicenseRequestRejected(uint256 indexed requestId, uint256 fileId, address requester, address fileOwner);

      modifier onlyOwner(){
         require(msg.sender == owner,  "Only the owner can call this function");
         _;
      }

      constructor() {
         owner = msg.sender;
      }

      function createFile(string memory _fileName, string memory _description, string memory _category,  string memory _fileCid, uint256  _fileSize, string memory _imgUrl, uint256 _price) public {
         fileId++;

         File memory newFile = File({
            id: fileId,
            fileOwner: msg.sender,
            fileName: _fileName,
            description: _description,
            category: _category,
            fileCid: _fileCid,
            imgUrl: _imgUrl,
            fileSize: _fileSize,
            createdAt: block.timestamp,
            price: _price
         });

         userFiles[msg.sender].push(newFile);
         publicFiles.push(newFile);

         emit FileShared(msg.sender, _fileName);
      }

      function requestLicense(uint256 _fileId, address _fileOwner, string memory _fileName, uint256 _assetPrice) public payable {
         require(!isFileOwnedOrLicensed(msg.sender, _fileId), "User already owns or has a license for this file");
         require(msg.value == _assetPrice, "Price not met");

         requestId++;
         LicenseRequest memory newRequest = LicenseRequest({
            requestId: requestId,
            fileId: _fileId,
            fileName: _fileName,
            requester: msg.sender,
            fileOwner: _fileOwner,
            requestedAt: block.timestamp,
            isApproved: false,
            assetPrice: _assetPrice
         });

         licenseRequests[requestId] = newRequest;
         userFund[_fileOwner] += msg.value;

         emit LicenseRequestCreated(requestId, _fileId, msg.sender, _fileOwner);
      }


      function approveLicenseRequest(uint256 _requestId) public {
         LicenseRequest storage request = licenseRequests[_requestId];
         require(request.fileOwner == msg.sender, "Only the file owner can approve the request");
         require(!request.isApproved, "Request already approved");

         request.isApproved = true;

         File memory file = getPublicFileById(request.fileId);
         uint256 licNum = generateUniqueLicense();

         License memory newLicense = License({
            licenseNumber: licNum,
            fileId: file.id,
            fileOwner: file.fileOwner,
            buyer: request.requester,
            fileName: file.fileName,
            description: file.description,
            category: file.category,
            fileCid: file.fileCid,
            imgUrl: file.imgUrl,
            fileSize: file.fileSize,
            createdAt: block.timestamp,
            price: file.price
         });

         fileLicenses[request.requester].push(newLicense);

         userFund[msg.sender] -= file.price;
         userFundWithdrawable[msg.sender] += file.price;

         emit FileLicense(file.fileOwner, request.requester, file.fileName);
         emit LicenseRequestApproved(_requestId, request.fileId, request.requester, request.fileOwner);
      }

      function rejectLicenseRequest(uint256 _requestId) public  {
         LicenseRequest storage request = licenseRequests[_requestId];
         require(request.fileOwner == msg.sender, "Only the file owner can reject the request");
         require(!request.isApproved, "Request already approved");

         userFundWithdrawable[request.requester] +=  request.assetPrice;
         userFund[msg.sender] -= request.assetPrice;


         delete licenseRequests[_requestId];
         emit LicenseRequestRejected(_requestId, request.fileId, request.requester, request.fileOwner);
      }

      function getAllUserFiles() public view returns(File[] memory) {
         return userFiles[msg.sender];
      }

      function getAllUserLicenses() public view returns(License[] memory) {
         return fileLicenses[msg.sender];
      }

    function getPublicFiles() public view returns (File[] memory) {
        return publicFiles;
    }

    function generateUniqueLicense() internal returns (uint256) {
         uint256 randomNumber = uint256(keccak256(abi.encodePacked(block.timestamp, blockhash(block.number), msg.sender)));
         uint256 license = randomNumber % 10000000000;

         while (usedLicenses[license]) {
            randomNumber = uint256(keccak256(abi.encodePacked(randomNumber, block.timestamp)));
            license = randomNumber % 10000000000;
         }

         usedLicenses[license] = true;

         return license;
      }

   function validateLicense(uint256 licenseNumber) external view returns (bool) {
         return usedLicenses[licenseNumber];
   }

   function getPublicFileById(uint256 _id) public view returns (File memory) {
         for (uint256 i = 0; i < publicFiles.length; i++) {
            if (publicFiles[i].id == _id) {
                  return publicFiles[i];
            }
         }
         revert("Public file not found");
      }

      function getUserLicenseRequests() public view returns (LicenseRequest[] memory) {
         uint256 count = 0;
         for (uint256 i = 1; i <= requestId; i++) {
            if (licenseRequests[i].requester == msg.sender) {
                  count++;
            }
         }

         LicenseRequest[] memory userRequests = new LicenseRequest[](count);
         uint256 index = 0;
         for (uint256 i = 1; i <= requestId; i++) {
            if (licenseRequests[i].requester == msg.sender) {
                  userRequests[index] = licenseRequests[i];
                  index++;
            }
         }

         return userRequests;
      }

   function getFileOwnerLicenseRequests() public view returns (LicenseRequest[] memory) {
         uint256 count = 0;
         for (uint256 i = 1; i <= requestId; i++) {
            if (licenseRequests[i].fileOwner == msg.sender) {
                  count++;
            }
         }

         LicenseRequest[] memory ownerRequests = new LicenseRequest[](count);
         uint256 index = 0;
         for (uint256 i = 1; i <= requestId; i++) {
            if (licenseRequests[i].fileOwner == msg.sender) {
                  ownerRequests[index] = licenseRequests[i];
                  index++;
            }
         }

         return ownerRequests;
   }

   function isFileOwnedOrLicensed(address _user, uint256 _fileId) public view returns (bool) {
         for (uint256 i = 0; i < userFiles[_user].length; i++) {
            if (userFiles[_user][i].id == _fileId) {
                  return true;
            }
         }

         for (uint256 j = 0; j < fileLicenses[_user].length; j++) {
            if (fileLicenses[_user][j].fileId == _fileId) {
                  return true;
            }
         }

         return false;
   }


   function getFileId() public view returns (uint256) {
         return fileId + 1;
   }

   function payTo(address to, uint256 amount) internal {
        (bool success, ) = payable(to).call{ value: amount }('');
        require(success, "Transfer fund failed");
    }

    function withdrawFund() public {
        uint256 amountToWithdraw = userFundWithdrawable[msg.sender];
        require(amountToWithdraw > 0, "No funds to withdraw");

        userFundWithdrawable[msg.sender] = 0;
        payTo(msg.sender, amountToWithdraw);
    }

    function getWithdrawableFund() public view returns (uint256) {
        return userFundWithdrawable[msg.sender];
    }

    function getFund() public view returns (uint256) {
        return userFund[msg.sender];
    }
}