// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {SmartBin} from  "../../src/SmartBin.sol";
import {DeployScript} from "../../script/DeployScript.s.sol";


contract SmartBinTest is Test {
    
    SmartBin smartBin;
    address manager = msg.sender; //assuming the deployer is the manager
    address authority1 = address(0xA1);
    address authority2 = address(0xA2);

    function setUp() public {
        DeployScript deployScript = new DeployScript();
        smartBin = deployScript.run();
    }

    function testManagerOnly() public {
        vm.startPrank(address(0x123)); // Simulating a different user
        vm.expectRevert("Only the manager can perform this action");
        smartBin.addBin(1, "Main Street");
        vm.stopPrank();
    }

    function testAddBin() public {
        vm.startPrank(manager);
        smartBin.addBin(1, "Main Street");
        (uint256 id, string memory location, bool isFull, uint256 lastEmptied) = smartBin.bins(1);
        assertEq(id, 1);
        assertEq(location, "Main Street");
        assertFalse(isFull);
        assertTrue(lastEmptied > 0);
        vm.stopPrank();
    }

    function testRemoveBin() public {
        vm.startPrank(manager);
        smartBin.addBin(1, "Main Street");
        smartBin.removeBin(1);
        (uint256 id, string memory location, bool isFull, uint256 lastEmptied) = smartBin.bins(1);
        assertEq(id, 0);
        assertEq(location, "");
        assertFalse(isFull);
        assertEq(lastEmptied, 0);
        vm.stopPrank();
    }

    function testAssignAuthority() public {
        vm.startPrank(manager);
        smartBin.addBin(1, "Main Street");
        address[] memory authorities = new address[](2);
        authorities[0] = authority1;
        authorities[1] = authority2;
        smartBin.assignAuthority(1, authorities);
        assertTrue(smartBin.isAuthority(1, authority1));
        assertTrue(smartBin.isAuthority(1, authority2));
        vm.stopPrank();
    }


    function testReportBin() public {
        vm.startPrank(manager);
        smartBin.addBin(1, "Main Street");
        address[] memory authorities = new address[](1);
        authorities[0] = authority1;
        smartBin.assignAuthority(1, authorities);
        smartBin.reportBin(1, "Main Street", true);
        (, , bool isFull, ) = smartBin.bins(1);
        assertTrue(isFull);
        vm.stopPrank();
    }

    function testEmptyBin() public {
        vm.startPrank(manager);
        smartBin.addBin(1, "Main Street");
        address[] memory authorities = new address[](1);
        authorities[0] = authority1;
        smartBin.assignAuthority(1, authorities);
        smartBin.reportBin(1, "Main Street", true);
        vm.stopPrank();
        vm.prank(authority1); // simulate authority1 calling emptyBin
        smartBin.emptyBin(1);
        (, , bool isFull, uint256 lastEmptied) = smartBin.bins(1);
        assertFalse(isFull);
        assertTrue(lastEmptied > 0);
    }
}
