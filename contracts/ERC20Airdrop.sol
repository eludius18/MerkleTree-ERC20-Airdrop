// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract ERC20Airdrop is ERC20, ERC20Burnable, Pausable, Ownable {
    //============ VARIABLES ============

    /// @notice ERC20-claimee inclusion root
    bytes32 public merkleRoot;

    //============ MAPPINGS ============

    /// @notice Mapping of addresses who have claimed tokens
    mapping(address => bool) public hasClaimed;

    //============ ERRORS ============

    /// @notice Thrown if address has already claimed
    error AlreadyClaimed();

    //============ EVENTS ============

    event claim(address indexed to, uint256 amount);
    event changedRoot(bytes32 merkleRoot);

    //============ CONSTRUCTOR ============
    constructor(
        string memory _name,
        string memory _symbol,
        bytes32 _merkleRoot
    )   
        ERC20(_name, _symbol) {
        merkleRoot = _merkleRoot; // Update root
    }

    //============ FUNCTIONS ============
    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(from, to, amount);
    }
    function claimAidrop(bytes32[] calldata merkleProof) external {

        // Throw if address has already claimed tokens
        if (hasClaimed[msg.sender]) revert AlreadyClaimed();

        // Verify merkle proof, or revert if not in tree
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
        bool isValidLeaf = MerkleProof.verify(merkleProof, merkleRoot, leaf);
        require(isValidLeaf, "Not in Merkle");

        // Mark the recipient as claimed
        hasClaimed[msg.sender] = true;

        // Mint tokens to address
        _mint(msg.sender, 100 * 10**18);

        emit claim(msg.sender, 100 * 10**18);
    }

    /// @notice Allows the owner to update the root of the merkle tree.
    /// @dev Function can be removed to make the merkle tree immutable. If removed, the ownable extension can also be removed for gas savings.
    function updateRoot(bytes32 newRoot) public onlyOwner {
        merkleRoot = newRoot;
        emit changedRoot(merkleRoot);
    }
}