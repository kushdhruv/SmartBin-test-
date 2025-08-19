export const SMARTBIN_ADDRESS = "0x83446652ba0CBcd4e498cBf4951d824d1996cbFf";
export const SMARTBIN_ABI = [
    {
      "type": "constructor",
      "inputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "addBin",
      "inputs": [
        {
          "name": "_binId",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "_location",
          "type": "string",
          "internalType": "string"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "assignAuthority",
      "inputs": [
        {
          "name": "_binId",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "_authority",
          "type": "address[]",
          "internalType": "address[]"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "binAuthorities",
      "inputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "address"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "bins",
      "inputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "name": "id",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "location",
          "type": "string",
          "internalType": "string"
        },
        {
          "name": "isFull",
          "type": "bool",
          "internalType": "bool"
        },
        {
          "name": "lastEmptied",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "emptyBin",
      "inputs": [
        {
          "name": "_binId",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "getAssignedAuthorities",
      "inputs": [
        {
          "name": "_binId",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "address[]",
          "internalType": "address[]"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "isAuthority",
      "inputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "",
          "type": "address",
          "internalType": "address"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "bool",
          "internalType": "bool"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "manager",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "address"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "removeBin",
      "inputs": [
        {
          "name": "_binId",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "reportBin",
      "inputs": [
        {
          "name": "_binId",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "_location",
          "type": "string",
          "internalType": "string"
        },
        {
          "name": "isFull",
          "type": "bool",
          "internalType": "bool"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "event",
      "name": "AuthorityAssigned",
      "inputs": [
        {
          "name": "binId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "authorities",
          "type": "address[]",
          "indexed": false,
          "internalType": "address[]"
        },
        {
          "name": "timestamp",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "BinCreated",
      "inputs": [
        {
          "name": "binId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "location",
          "type": "string",
          "indexed": false,
          "internalType": "string"
        },
        {
          "name": "timestamp",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "BinEmptied",
      "inputs": [
        {
          "name": "binId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "location",
          "type": "string",
          "indexed": false,
          "internalType": "string"
        },
        {
          "name": "timestamp",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        },
        {
          "name": "emptiedBy",
          "type": "address",
          "indexed": false,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "BinRemoved",
      "inputs": [
        {
          "name": "binId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "location",
          "type": "string",
          "indexed": false,
          "internalType": "string"
        },
        {
          "name": "timestamp",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "BinReported",
      "inputs": [
        {
          "name": "binId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "location",
          "type": "string",
          "indexed": false,
          "internalType": "string"
        },
        {
          "name": "isFull",
          "type": "bool",
          "indexed": false,
          "internalType": "bool"
        },
        {
          "name": "timestamp",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        },
        {
          "name": "authorities",
          "type": "address[]",
          "indexed": false,
          "internalType": "address[]"
        }
      ],
      "anonymous": false
    }];