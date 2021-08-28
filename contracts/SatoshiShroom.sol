// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ERC721Tradable.sol";

/**
 * @title SatoshiShroom
 * SatoshiShroom - a contract for my non-fungible satoshishrooms.
 */
contract SatoshiShroom is ERC721Tradable {
    // ===================================================
    // VARIABLES
    // ===================================================

    using SafeMath for uint256;

    uint256 public constant mushroomPrice = 5000000000000000; // 0.015 ETH

    uint256 public constant maxMushroomPurchase = 10;

    uint256 public constant supplyCap = 420;

    // ===================================================
    // CONSTRUCTOR
    // ===================================================

    constructor(address _proxyRegistryAddress)
        ERC721Tradable("Satoshi Shrooms", "SASHR", _proxyRegistryAddress)
    {}

    // ===================================================
    // METHODS
    // ===================================================

    // Withdraw all contract funds to the contract-owner's wallet only
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        msg.sender.transfer(balance);
    }

    // Once all Shrooms were bought, set the baseURI to IPFS to populate metadata / display images
    function setBaseURI(string memory baseURI) public onlyOwner {
        _setBaseURI(baseURI); // from ERC721
    }

    function mintSatoshiShroom(uint256 tokensToMint) public payable {
        require(
            tokensToMint > 0 && tokensToMint <= maxMushroomPurchase,
            "You can only mint 10 tokens at once"
        );
        require(
            totalSupply().add(tokensToMint) <= supplyCap,
            "Purchase would exceed max supply of Satoshi Shrooms"
        );
        require(
            msg.value >= mushroomPrice.mul(tokensToMint),
            "Amount of Ether sent is not sufficient"
        );

        for (uint256 i = 0; i < tokensToMint; i++) {
            uint256 mintIndex = totalSupply();
            if (totalSupply() < supplyCap) {
                _safeMint(msg.sender, mintIndex);
            }
        }
    }
}
