import { useState } from "react";
import { ethers } from "ethers";
import { SMARTBIN_ADDRESS, SMARTBIN_ABI } from "./contractConfig";

export default function App() {
  const [role, setRole] = useState(null); // "manager" or "authority"
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);

  const [binId, setBinId] = useState("");
  const [location, setLocation] = useState("");
  const [binInfo, setBinInfo] = useState(null);

  const [authoritiesInput, setAuthoritiesInput] = useState("");
  const [authoritiesList, setAuthoritiesList] = useState([]);

  async function connectWallet() {
    if (!window.ethereum) return alert("Please install MetaMask!");
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    setAccount(await signer.getAddress());
    setContract(new ethers.Contract(SMARTBIN_ADDRESS, SMARTBIN_ABI, signer));
  }

  function goHome() {
    setRole(null);
    setAccount(null);
    setContract(null);
    setBinId("");
    setBinInfo(null);
    setAuthoritiesInput("");
    setAuthoritiesList([]);
  }

  async function addBin() {
    if (!contract) return alert("Connect wallet first");
    const tx = await contract.addBin(Number(binId), location);
    await tx.wait();
    alert("Bin added!");
  }

  async function fetchBin() {
    if (!contract) return;
    const bin = await contract.bins(Number(binId));
    setBinInfo(bin);
  }

  async function reportBinFull() {
    if (!contract) return;

    const tx = await contract.reportBin(Number(binId), location, true);
    await tx.wait();
    alert("Bin reported full!");
  }

  async function emptyBin() {
    if (!contract) return;
    const tx = await contract.emptyBin(Number(binId));
    await tx.wait();
    alert("Bin emptied!");
  }

  async function assignAuthorities() {
    if (!contract) return alert("Connect wallet first");
    if (!authoritiesInput.trim()) return alert("Enter at least one address");
    const addresses = authoritiesInput.split(",").map((a) => a.trim());
    const tx = await contract.assignAuthority(Number(binId), addresses);
    await tx.wait();
    alert("Authorities assigned!");
  }

  async function viewAuthorities() {
    if (!contract) return alert("Connect wallet first");
    const MAX_CHECK = 10;
    const results = [];
    for (let i = 0; i < MAX_CHECK; i++) {
      try {
        const addr = await contract.binAuthorities(Number(binId), i);
        if (addr === ethers.ZeroAddress) break;
        results.push(addr);
      } catch {
        break;
      }
    }
    if (results.length === 0) {
      alert("No authorities assigned to this bin yet");
    }
    setAuthoritiesList(results);
  }

  function renderHome() {
    return (
      <div style={{ padding: "20px" }}>
        <h1>SmartBin Dashboard</h1>
        <h2>Select Role</h2>
        <button
          onClick={() => setRole("manager")}
          style={{ marginRight: "10px" }}
        >
          Connect as Manager
        </button>
        <button onClick={() => setRole("authority")}>
          Connect as Authority
        </button>
      </div>
    );
  }

  function renderManagerDashboard() {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Manager Dashboard</h1>
        {!account && <button onClick={connectWallet}>Connect Wallet</button>}
        {account && (
          <>
            <p>Connected as: {account}</p>
            <button onClick={connectWallet} style={{ marginBottom: "20px" }}>
              Connect with Different Account
            </button>
          </>
        )}

        <h2>Manage Bin</h2>
        <input
          type="number"
          placeholder="Bin ID"
          value={binId}
          onChange={(e) => setBinId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <div>
          <button onClick={addBin}>Add Bin</button>
          <button onClick={fetchBin}>Fetch Bin</button>
          <button onClick={reportBinFull}>Report Full</button>
        </div>

        {binInfo && (
          <div style={{ marginTop: "20px" }}>
            <h3>Bin Info</h3>
            <p>ID: {binInfo.id.toString()}</p>
            <p>Location: {binInfo.location}</p>
            <p>Full: {binInfo.isFull ? "Yes" : "No"}</p>
            <p>
              Last Emptied:{" "}
              {new Date(Number(binInfo.lastEmptied) * 1000).toLocaleString()}
            </p>
          </div>
        )}

        <h2 style={{ marginTop: "30px" }}>Assign Authorities</h2>
        <input
          type="text"
          placeholder="Comma-separated addresses"
          value={authoritiesInput}
          onChange={(e) => setAuthoritiesInput(e.target.value)}
          style={{ width: "100%" }}
        />
        <button onClick={assignAuthorities}>Assign</button>

        <h2 style={{ marginTop: "30px" }}>View Authorities</h2>
        <button onClick={viewAuthorities}>Fetch Authorities</button>
        <div style={{ marginTop: "20px" }}>
          <h3>Authorities</h3>
          {authoritiesList.length > 0 ? (
            <ul>
              {authoritiesList.map((addr, idx) => (
                <li key={idx}>{addr}</li>
              ))}
            </ul>
          ) : (
            <p>No authorities assigned to this bin yet</p>
          )}
        </div>

        <button onClick={goHome} style={{ marginBottom: "20px" }}>
          Back to Home
        </button>
      </div>
    );
  }

  function renderAuthorityDashboard() {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Authority Dashboard</h1>
        {!account && <button onClick={connectWallet}>Connect Wallet</button>}
        {account && (
          <>
            <p>Connected as: {account}</p>
            <button onClick={connectWallet} style={{ marginBottom: "20px" }}>
              Connect with Different Account
            </button>
          </>
        )}

        <h2>Authority Actions</h2>
        <input
          type="number"
          placeholder="Bin ID"
          value={binId}
          onChange={(e) => setBinId(e.target.value)}
        />
        <div>
          <button onClick={emptyBin}>Empty Bin</button>
          <button onClick={fetchBin}>Fetch Bin</button>
          <button onClick={viewAuthorities}>View Authorities</button>
        </div>

        {binInfo && (
          <div style={{ marginTop: "20px" }}>
            <h3>Bin Info</h3>
            <p>ID: {binInfo.id.toString()}</p>
            <p>Location: {binInfo.location}</p>
            <p>Full: {binInfo.isFull ? "Yes" : "No"}</p>
            <p>
              Last Emptied:{" "}
              {new Date(Number(binInfo.lastEmptied) * 1000).toLocaleString()}
            </p>
          </div>
        )}

        <div style={{ marginTop: "20px" }}>
          <h3>Authorities</h3>
          {authoritiesList.length > 0 ? (
            <ul>
              {authoritiesList.map((addr, idx) => (
                <li key={idx}>{addr}</li>
              ))}
            </ul>
          ) : (
            <p>No authorities assigned to this bin yet</p>
          )}
        </div>

        <button onClick={goHome} style={{ marginBottom: "20px" }}>
          Back to Home
        </button>
      </div>
    );
  }

  if (!role) return renderHome();
  if (role === "manager") return renderManagerDashboard();
  if (role === "authority") return renderAuthorityDashboard();
}
