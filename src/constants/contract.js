// src/constants/contract.js
import { ethers } from 'ethers';

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
  "function DEFAULT_ADMIN_ROLE() view returns (bytes32)",
  "event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender)",
  "event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender)"
];

// OpenZeppelin AccessControl cryptographic role identifiers
export const DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";
export const MANAGER_ROLE = "0x241ecf16d79d0f8dbfb92cbc07fe17840425976cf0667f022fe9877caa831b08";

export const SEPOLIA_CHAIN_ID = 11155111;

// Verified On-Chain Deployer & Operational Managers on Ethereum Sepolia
export const MASTER_ADMIN_ADDRESS = "0xB7c3A398e8e9eD1Bd1aFC6832f02b1A11c2d4677";
export const KNOWN_SEPOLIA_MANAGERS = [
  "0xcC593b055B9a8DAe2C30dbF4cfD2DF162561bA33"
];

// Public Sepolia RPC Endpoints for resilient fallback querying
export const SEPOLIA_RPC_URLS = [
  "https://ethereum-sepolia-rpc.publicnode.com",
  "https://rpc.sepolia.org",
  "https://1rpc.io/sepolia",
  "https://gateway.tenderly.co/public/sepolia"
];

let cachedProvider = null;

export function getSepoliaProvider() {
  if (cachedProvider) return cachedProvider;
  try {
    cachedProvider = new ethers.providers.JsonRpcProvider(SEPOLIA_RPC_URLS[0]);
    return cachedProvider;
  } catch (err) {
    console.warn("Could not instantiate primary Sepolia RPC provider:", err);
    return new ethers.providers.JsonRpcProvider(SEPOLIA_RPC_URLS[1]);
  }
}

export function getSepoliaContract(signerOrProvider) {
  const provider = signerOrProvider || getSepoliaProvider();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
}