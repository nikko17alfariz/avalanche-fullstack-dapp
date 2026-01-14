// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleStorage {
    uint256 private storedValue;
    address public owner;

    // Task 2: Events
    event ValueUpdated(uint256 newValue);
    event OwnerSet(address indexed newOwner);

    // Task 4: Access Control
    modifier onlyOwner() {
        require(msg.sender == owner, "Bukan owner!");
        _;
    }

    // Task 1: Ownership set saat deploy
    constructor() {
        owner = msg.sender;
        emit OwnerSet(msg.sender);
    }

    function setValue(uint256 _value) public onlyOwner {
        storedValue = _value;
        emit ValueUpdated(_value);
    }

    function getValue() public view returns (uint256) {
        return storedValue;
    }
}


