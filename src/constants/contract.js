// src/constants/contract.js

export const CONTRACT_ADDRESS = "0x663054028415e1AE4Ba7ee54cf30256CaDAa3794";

export const CONTRACT_ABI = [
    "constructor(address rootAdmin)",
    "function grantManagerRole(address account) external",
    "function revokeManagerRole(address account) external",
    "function mintAsset(address recipient, string memory uri, string memory name, string memory assetType) external returns (uint256)",
    "function setAssetRevoked(uint256 tokenId, bool status) external",
    "function getAssetRecord(uint256 tokenId) external view returns (tuple(uint256 tokenId, string name, string assetType, address issuedBy, address currentOwner, uint256 createdAt, bool isRevoked), string memory)",
    "function getAllTokenIds() external view returns (uint256[] memory)",
    "function totalSupply() external view returns (uint256)",
    "function hasRole(bytes32 role, address account) view returns (bool)",
    "function MANAGER_ROLE() view returns (bytes32)",
    "function DEFAULT_ADMIN_ROLE() view returns (bytes32)"
];