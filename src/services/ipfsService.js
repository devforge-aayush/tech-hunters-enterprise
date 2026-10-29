// src/services/ipfsService.js

const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;
const PINATA_GATEWAY = import.meta.env.VITE_PINATA_GATEWAY || 'gateway.pinata.cloud';

/**
 * 1. Upload a physical document or image file to Pinata IPFS
 * @param {File} file - Browser File object from <input type="file" />
 * @param {string} customName - Optional label for Pinata dashboard
 * @returns {Promise<{ ipfsHash: string, ipfsUri: string, gatewayUrl: string }>}
 */
export async function uploadFileToIPFS(file, customName = '') {
  if (!PINATA_JWT) {
    throw new Error("Pinata JWT token is missing. Please verify VITE_PINATA_JWT in your .env file.");
  }

  const formData = new FormData();
  formData.append('file', file);

  const metadata = JSON.stringify({
    name: customName || file.name || 'enterprise-asset-document'
  });
  formData.append('pinataMetadata', metadata);

  const options = JSON.stringify({ cidVersion: 1 });
  formData.append('pinataOptions', options);

  const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`
    },
    body: formData
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.details || errorData.error || `IPFS file upload failed with HTTP ${response.status}`);
  }

  const result = await response.json();
  const ipfsHash = result.IpfsHash;

  return {
    ipfsHash,
    ipfsUri: `ipfs://${ipfsHash}`,
    gatewayUrl: `https://${PINATA_GATEWAY}/ipfs/${ipfsHash}`
  };
}

/**
 * 2. Upload ERC-721 standard metadata JSON to Pinata IPFS
 * @param {Object} metadataObj - Standard NFT metadata schema
 * @param {string} customName - Optional label for Pinata dashboard
 * @returns {Promise<{ ipfsHash: string, ipfsUri: string, gatewayUrl: string }>}
 */
export async function uploadJSONToIPFS(metadataObj, customName = '') {
  if (!PINATA_JWT) {
    throw new Error("Pinata JWT token is missing. Please verify VITE_PINATA_JWT in your .env file.");
  }

  const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${PINATA_JWT}`
    },
    body: JSON.stringify({
      pinataMetadata: {
        name: customName || `${metadataObj.name || 'asset'}-metadata.json`
      },
      pinataOptions: {
        cidVersion: 1
      },
      pinataContent: metadataObj
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.details || errorData.error || `IPFS metadata upload failed with HTTP ${response.status}`);
  }

  const result = await response.json();
  const ipfsHash = result.IpfsHash;

  return {
    ipfsHash,
    ipfsUri: `ipfs://${ipfsHash}`,
    gatewayUrl: `https://${PINATA_GATEWAY}/ipfs/${ipfsHash}`
  };
}

/**
 * 3. Complete automated 2-stage pipeline:
 * Uploads physical document -> binds into ERC-721 JSON schema -> pins JSON to IPFS
 * @param {File} file - Attached document file (PDF, PNG, JPG, etc.)
 * @param {Object} assetDetails - Form fields (name, type, department, recipient)
 * @returns {Promise<{ metadataUri: string, documentUri: string, gatewayUrl: string, documentGatewayUrl: string, metadata: Object }>}
 */
export async function uploadAssetPipeline(file, assetDetails) {
  // Stage 1: Pin Document File
  const fileResult = await uploadFileToIPFS(file, `${assetDetails.name || 'asset'}-document`);

  // Stage 2: Construct ERC-721 compliant metadata JSON
  const metadata = {
    name: assetDetails.name,
    description: `Verifiable institutional credential issued to ${assetDetails.recipient}.`,
    image: fileResult.gatewayUrl,
    document_uri: fileResult.ipfsUri,
    attributes: [
      { trait_type: "Asset Type", value: assetDetails.type || "Identity Document" },
      { trait_type: "Department", value: assetDetails.department || "Enterprise Core" },
      { trait_type: "Recipient", value: assetDetails.recipient },
      { trait_type: "Issuance Timestamp", value: Math.floor(Date.now() / 1000) },
      { trait_type: "Verification Protocol", value: "Tech Hunters ERC-721" }
    ]
  };

  // Stage 3: Pin Metadata JSON
  const jsonResult = await uploadJSONToIPFS(metadata, `${assetDetails.name || 'asset'}-metadata`);

  return {
    metadataUri: jsonResult.ipfsUri,
    documentUri: fileResult.ipfsUri,
    gatewayUrl: jsonResult.gatewayUrl,
    documentGatewayUrl: fileResult.gatewayUrl,
    metadata
  };
}
