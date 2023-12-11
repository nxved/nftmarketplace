// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

/**
 * @title ARTMarketplace
 * @dev A contract for managing NFTs in a marketplace
 */
contract ARTMarketplace is ERC721, ERC721URIStorage, ReentrancyGuard, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    string public rewardURI;
    uint256 public rewardThreshold;

    // Structure to represent an NFT
    struct NFT {
        uint256 id;
        string name;
        address payable owner;
        uint256 price;
        bool forSale;
    }

    // Mapping to store NFTs by their ID
    mapping(uint256 => NFT) public nfts;

    // Mapping to store the list of NFT IDs owned by each address
    mapping(address => uint256[]) public nftOwners;

    // Mapping to track the purchase history of each address for reward eligibility
    mapping(address => uint256) public thresholdTracker;

    // Event emitted when a new NFT is minted
    event Minted(
        address indexed owner,
        uint256 indexed id,
        string name,
        string tokenURI
    );

    // Event emitted when an NFT is listed for sale
    event Listed(address indexed owner, uint256 indexed id, uint256 price);

    // Event emitted when an NFT is sold
    event Sold(
        address indexed buyer,
        address indexed seller,
        uint256 indexed id,
        uint256 price
    );

    // Event emitted when a reward NFT is minted
    event RewardNFTMinted(
        address indexed owner,
        uint256 indexed id,
        string name,
        string tokenURI
    );

    /**
     * @dev Constructor for the ARTMarketplace contract
     */
    constructor() ERC721("ARTMarketplace", "ArtNFT") {
        rewardURI = "https://gateway.pinata.cloud/ipfs/QmPvcXQmobCZz1kY6D3A8uwr16Ksei5a4VLZ5vjjR7QbG3";
        rewardThreshold = 0.001 ether;
    }

    // Modifier to check if the sender is the owner of a specific NFT
    modifier onlyOwnerOf(uint256 id) {
        require(
            _msgSender() == nfts[id].owner,
            "Only owner can call this function"
        );
        _;
    }

    // Modifier to check if an NFT with a given ID exists
    modifier nftExists(uint256 id) {
        require(_exists(id), "NFT does not exist");
        _;
    }

    // Modifier to check if an NFT is listed for sale
    modifier forSale(uint256 id) {
        require(nfts[id].forSale, "NFT is not for sale");
        _;
    }

    // Modifier to check if the sent funds are sufficient to purchase an NFT
    modifier validPrice(uint256 id) {
        require(
            msg.value >= nfts[id].price,
            "Insufficient funds to purchase the NFT"
        );
        _;
    }

    /**
     * @dev Mint a new NFT by providing a name and a token URI
     * @param name The name of the NFT
     * @param _tokenURI The URI pointing to the NFT's metadata
     * @return The minted token ID
     */
    function mint(
        string memory name,
        string memory _tokenURI
    ) public returns (uint256) {
        require(bytes(name).length > 0, "Name can't be empty");
        require(bytes(_tokenURI).length > 0, "Token URI can't be empty");
        address minter = _msgSender();
        _tokenIds.increment();
        uint256 id = _tokenIds.current();
        _safeMint(minter, id);
        _setTokenURI(id, _tokenURI);
        nfts[id] = NFT(id, name, payable(minter), 0, false);
        nftOwners[minter].push(id);
        emit Minted(minter, id, name, _tokenURI);
        return id;
    }

    /**
     * @dev List an NFT for sale with an asking price
     * @param id The ID of the NFT to be listed
     * @param price The price at which to list the NFT
     */
    function list(
        uint256 id,
        uint256 price
    ) public onlyOwnerOf(id) nftExists(id) {
        require(price > 0, "Price must be greater than zero");
        nfts[id].price = price;
        nfts[id].forSale = true;
        emit Listed(_msgSender(), id, price);
    }

    /**
     * @dev Purchase a listed NFT using Ether
     * @param id The ID of the NFT to be purchased
     */
    function buy(
        uint256 id
    ) public payable nonReentrant forSale(id) nftExists(id) validPrice(id) {
        address buyer = _msgSender();
        address payable seller = nfts[id].owner;
        uint256 price = nfts[id].price;
        _transfer(seller, buyer, id);
        seller.transfer(price);
        nfts[id].owner = payable(buyer);
        nfts[id].forSale = false;
        for (uint256 i = 0; i < nftOwners[seller].length; i++) {
            if (nftOwners[seller][i] == id) {
                nftOwners[seller][i] = nftOwners[seller][
                    nftOwners[seller].length - 1
                ];
                nftOwners[seller].pop();
                break;
            }
        }
        nftOwners[buyer].push(id);
        thresholdTracker[buyer] += msg.value;
        emit Sold(buyer, seller, id, price);
    }

    /**
     * @dev Mint the Reward NFT
     */
    function mintRewardNFT() external {
        address receiver = _msgSender();
        require(
            thresholdTracker[receiver] >= rewardThreshold,
            "Not Eligible for Reward"
        );
        string memory name = "RewardNFT";
        _tokenIds.increment();
        uint256 id = _tokenIds.current();
        _safeMint(receiver, id);
        _setTokenURI(id, rewardURI);
        nfts[id] = NFT(id, name, payable(receiver), 0, false);
        nftOwners[_msgSender()].push(id);
        // Reset customer's history after redeeming for NFT
        thresholdTracker[receiver] = 0;
        emit RewardNFTMinted(receiver, id, name, rewardURI);
    }

    // Function to update the reward threshold
    function updateRewardThreshold(
        uint256 _rewardThreshold
    ) external onlyOwner {
        rewardThreshold = _rewardThreshold;
    }

    // Function to update the reward URI
    function updateRewardURI(string memory _rewardURI) external onlyOwner {
        rewardURI = _rewardURI;
    }

    // Function to check if an address is eligible for a reward
    function checkRewardEligibility() public view returns (bool) {
        return (thresholdTracker[_msgSender()] >= rewardThreshold);
    }

    /**
     * @dev View all NFTs listed for sale
     * @return array of NFTs available for sale
     */
    function viewAll() public view returns (NFT[] memory) {
        uint256 counter = 0;
        for (uint256 i = 1; i <= _tokenIds.current(); i++) {
            if (nfts[i].forSale) {
                counter++;
            }
        }
        NFT[] memory nftsForSale = new NFT[](counter);
        uint256 index = 0;
        for (uint256 i = 1; i <= _tokenIds.current(); i++) {
            if (nfts[i].forSale) {
                nftsForSale[index] = nfts[i];
                index++;
            }
        }
        return nftsForSale;
    }

    /**
     * @dev View NFTs owned by a specific user
     * @param owner The address of the user whose NFTs are to be viewed
     * @return array of NFTs owned by the user
     */
    function viewOwned(address owner) public view returns (NFT[] memory) {
        NFT[] memory ownedNFTs = new NFT[](nftOwners[owner].length);
        for (uint256 i = 0; i < nftOwners[owner].length; i++) {
            ownedNFTs[i] = nfts[nftOwners[owner][i]];
        }
        return ownedNFTs;
    }

    // Internal function to handle burning an NFT
    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    // Function to retrieve the token URI of an NFT
    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
