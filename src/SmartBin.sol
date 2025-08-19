//SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

contract SmartBin {

    struct Bin {
        uint256 id;
        string location;
        bool isFull;
        uint256 lastEmptied;
    }

    address public manager;
    mapping(uint256 => Bin) public bins;
    mapping(uint256 => address[]) public binAuthorities;
    mapping(uint256 => mapping(address => bool)) public isAuthority; // to check if an address is an authority for the bin

    event BinCreated(uint256 indexed binId, string location, uint256 timestamp);
    event BinRemoved(uint256 indexed binId, string location, uint256 timestamp);
    event BinReported(uint256 indexed binId, string location, bool isFull,uint256 timestamp, address[] authorities);
    event BinEmptied(uint256 indexed binId, string location, uint256 timestamp, address emptiedBy);
    event AuthorityAssigned(uint256 indexed binId, address[] authorities, uint256 timestamp);

    modifier onlyManager() {
        require(msg.sender == manager, "Only the manager can perform this action");
        _;
    }
    modifier binValidity(uint256 _binId) {
        require(bins[_binId].id != 0, "Bin does not exist");
        require(bytes(bins[_binId].location).length > 0, "Bin location cannot be empty");
        _;
    }

    modifier assignedAuthority(uint256 _binId) {
        require(isAuthority[_binId][msg.sender], "Not authorized for this bin");
        _;
    }

    constructor() {
        manager = msg.sender;
    }

    function addBin(uint256 _binId, string memory _location) external onlyManager {
        require(_binId > 0, "Bin ID must be greater than zero");
        require(bytes(_location).length > 0, "Location cannot be empty");
        require(bins[_binId].id == 0, "Bin already exists");

        bins[_binId] = Bin({
            id: _binId,
            location: _location,
            isFull: false,
            lastEmptied: block.timestamp
        });
        binAuthorities[_binId] = new address[](0); // help in resetting authorities
        emit BinCreated(_binId, _location, block.timestamp);
    }

    function assignAuthority(uint256 _binId, address[] calldata _authority) external onlyManager binValidity(_binId) {
        require(_authority.length > 0, "At least one authority must be assigned");

        // Clear old authorities
        for (uint i = 0; i < binAuthorities[_binId].length; i++) {
            isAuthority[_binId][binAuthorities[_binId][i]] = false;
        }
        delete binAuthorities[_binId];
        
        for(uint256 i = 0; i < _authority.length; i++) {
            require(_authority[i] != address(0), "Authority address cannot be zero");
            binAuthorities[_binId].push(_authority[i]);
            isAuthority[_binId][_authority[i]] = true;
        }

        emit AuthorityAssigned(_binId, _authority, block.timestamp);
    }

    function removeBin(uint256 _binId) external onlyManager binValidity(_binId) {
        string memory location = bins[_binId].location;

        delete bins[_binId];
        delete binAuthorities[_binId];

        emit BinRemoved(_binId, location, block.timestamp);
    }
    

    function reportBin(uint256 _binId, string memory _location, bool isFull) external onlyManager binValidity(_binId) {
        require(bytes(_location).length > 0, "Location cannot be empty");
        require(keccak256(abi.encodePacked(bins[_binId].location)) == keccak256(abi.encodePacked(_location)), "Location mismatch");
        require(isFull == true ,"Empty bin cannot be reported as full");
        require(bins[_binId].isFull == false, "Bin is already reported as full");
        bins[_binId].isFull = isFull;

        emit BinReported(_binId, _location, isFull, block.timestamp, binAuthorities[_binId]);
    }

    function emptyBin(uint256 _binId) external binValidity(_binId) assignedAuthority(_binId) {
        
        require(bins[_binId].isFull == true, "Bin is not full");

        bins[_binId].isFull = false;
        bins[_binId].lastEmptied = block.timestamp;

        emit BinEmptied(_binId, bins[_binId].location, block.timestamp,msg.sender);
    }

    function getAssignedAuthorities(uint256 _binId) external view binValidity(_binId) returns (address[] memory) {
        return binAuthorities[_binId];
    }
}