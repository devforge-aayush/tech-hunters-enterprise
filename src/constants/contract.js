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
  "event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
  "error AccessControlUnauthorizedAccount(address account, bytes32 neededRole)",
  "error AccessControlBadConfirmation()"
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

/**
 * Extracts descriptive revert reason from Web3/Ethers error object
 */
export function extractRevertReason(err) {
  if (!err) return "Unknown transaction error.";

  // 1. User wallet rejection in MetaMask
  if (
    err.code === 4001 ||
    err.code === 'ACTION_REJECTED' ||
    (err.message && (
      err.message.includes('user rejected') || 
      err.message.includes('User denied') || 
      err.message.includes('rejected transaction')
    ))
  ) {
    return "Transaction was cancelled / rejected by the user in MetaMask.";
  }

  // 2. Decode custom error from raw revert data (e.g. AccessControlUnauthorizedAccount)
  const revertData = err?.data || err?.error?.data || err?.error?.error?.data;
  if (typeof revertData === 'string' && revertData.startsWith('0x')) {
    try {
      const iface = new ethers.utils.Interface(CONTRACT_ABI);
      const parsed = iface.parseError(revertData);
      if (parsed.name === 'AccessControlUnauthorizedAccount') {
        const account = parsed.args.account;
        return `Unauthorized: Wallet ${account.substring(0, 6)}...${account.substring(38)} lacks MANAGER_ROLE on-chain required to mint assets.`;
      }
      return `Smart contract reverted with error: ${parsed.name}`;
    } catch {
      // not in ABI
    }
  }

  // 3. Known require revert strings
  const fullErrorString = (err.reason || err.data?.message || err.error?.message || err.message || '').toString();
  if (fullErrorString.includes('URI cannot be empty')) {
    return "Contract Revert: Asset metadata URI cannot be empty.";
  }
  if (fullErrorString.includes('Cannot mint to zero address')) {
    return "Contract Revert: Cannot mint to zero address (0x0).";
  }
  if (fullErrorString.includes('AccessControlUnauthorizedAccount') || fullErrorString.includes('0xe2517d3f')) {
    return "Unauthorized: Caller lacks MANAGER_ROLE permissions required to mint assets.";
  }
  if (fullErrorString.includes('insufficient funds')) {
    return "Insufficient Sepolia ETH in your wallet to cover transaction gas fees.";
  }

  // 4. Fallback to clean reason or message
  if (err.reason) return err.reason;
  if (err.data?.message) return err.data.message;
  if (err.message) {
    const cleanMsg = err.message.split('(action=')[0].split('[ See:')[0].trim();
    return cleanMsg || err.message;
  }

  return "Smart contract execution reverted on-chain. Please verify parameters and permissions.";
}