import * as PushAPI from "@pushprotocol/restapi";
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

// Load env variables
const RPC_URL = process.env.WEBSOCKET_SEPOLIA_RPC_URL;
const CONTRACT_ADDRESS = process.env.SMARTBIN_ADDRESS;
const CHANNEL_PK = process.env.PRIVATE_KEY;
const CHAIN_ID = 11155111; // Sepolia

// Load wallet from private key
const wallet = new ethers.Wallet(CHANNEL_PK);

// Setup provider and contract listener
const provider = new ethers.WebSocketProvider(RPC_URL);
const contractABI = [
  "event BinReported(uint256 indexed binId, string location, bool isFull,uint256 timestamp, address[] authorities)"
];
const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);

async function main() {
  console.log("Checking if channel is registered...");

  const channelId = `eip155:${CHAIN_ID}:${wallet.address}`;
  const channelData = await PushAPI.channels.getChannel({
    channel: channelId,
    env: "staging"
  });

  if (!channelData) {
    console.error("No channel found for", wallet.address);
    return;
  }
  console.log("✅ Channel detected:", channelData.channel);

  // Start listening for events
  console.log("Listening for BinFull events...\n");
  contract.on("BinReported", async (binId, location, isFull, timestamp, authorities, evt) => {
    console.log(`Event: Bin ${binId} is full at ${new Date(Number(timestamp) * 1000).toLocaleString()}`);
    await sendPushNotifications(binId, authorities, timestamp);
  });
}

async function sendPushNotifications(binId, authorities, timestamp) {
  const title = "Bin Full Alert";
  const body = `Bin ${binId} is full at ${new Date(Number(timestamp) * 1000).toLocaleString()}`;
  
  for (const addr of authorities) {
    if (addr === ethers.ZeroAddress) continue;
    const recipient = `eip155:${CHAIN_ID}:${addr}`;
    try {
      await PushAPI.payloads.sendNotification({
        signer: wallet,
        type: 3,                // Direct payload
        identityType: 0,        // Minimal identity to avoid signature issues
        notification: { title, body },
        payload: { title, body, cta: '', img: '' },
        recipients: recipient,
        channel: `eip155:${CHAIN_ID}:${wallet.address}`,
        env: "staging"
      });
      console.log(`📨 Notification sent to ${addr}`);
    } catch (err) {
      console.error(`Failed to notify ${addr}:`, err.message || err);
    }
  }
}

main().catch(console.error);
