// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract WavePortal {
    uint256 totalWaves;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function wave() public {
        totalWaves += 1;
    }

    function getTotalWaves() public view returns (uint256) {
        return totalWaves;
    }
}