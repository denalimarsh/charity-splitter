pragma solidity ^0.5.0;

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./libraries/Address.sol";
import "./interfaces/ICharitySplitter.sol";

/*
*  @title: CharitySplitter
*  @dev: CharitySplitter allows for the equal distribution of donations
*        amongst a dynamic set of charities. The contract's owner controls
*        the charity set and is empowered to add or remove charities.
*/
contract CharitySplitter is ICharitySplitter {

    using SafeMath for uint256;
    using Address for address;

    address public owner;
    uint256 public charityCount;
    mapping(address => uint256) public charityIndex;
    mapping(uint256 => address payable) public charities;

    event LogCharityAdded(
        address _charity,
        uint256 _totalCharities
    );
    event LogCharityRemoved(
        address _charity,
        uint256 _totalCharities
    );
    event LogDonation(
        address _philanthropist,
        uint256 _totalDonationAmount,
        uint256 _totalCharities,
        uint256 _individualDonationAmount
    );

 /*
    * @dev: Modifier which restricts access to the owner.
    */
    modifier onlyOwner()
    {
        require(
            msg.sender == owner,
            'Must be the owner.'
        );
        _;
    }

    /*
    * @dev: Constructor, sets owner address and charity count
    */
    constructor(
        address _owner
    )
        public
    {
        charityCount = 0;
        owner = _owner;
    }

    /*
    * @dev: Fallback function which processes incoming donations
    */
    function()
        external
        payable
    {
        processDonation();
    }

    /*
    * @dev: Adds a new charity's address to the charity set.
    * @param _charityAddress: The address to be added.
    */
    function addCharity(
        address payable _charityAddress
    )
        external
        onlyOwner
    {
        require(
            charityIndex[_charityAddress] == 0,
            "This charity is already active and cannot be added."
        );

        require(
            _charityAddress != address(0),
            "Cannot add null address"
        );

        charityCount = charityCount.add(1);

        charityIndex[_charityAddress] = charityCount;
        charities[charityCount] = _charityAddress;

        emit LogCharityAdded(
            _charityAddress,
            charityCount
        );
    }

    /*
    * @dev: Removes a charity's address from the charity set.
    * @param _charityAddress: The address to be removed.
    */
    function removeCharity(
        address payable _charityAddress
    )
        external
        onlyOwner
    {
        require(
            charityIndex[_charityAddress] > 0,
            "This charity is not active and cannot be removed."
        );

        uint256 index = charityIndex[_charityAddress];

        // Remove selected charity
        delete charityIndex[_charityAddress];
        delete charities[index];

        if(index != charityCount) {
            // Swap last charity to deleted position and delete last position
            address lastAddress = charities[charityCount];
            charities[index] = lastAddress.toPayable();
            charityIndex[lastAddress] = index;
            delete charities[charityCount];
        }

        charityCount = charityCount.sub(1);

        emit LogCharityRemoved(
            _charityAddress,
            charityCount
        );
    }

    /*
    * @dev: Processes a donation by splitting it equally and distributing
    *       funds to all active charities.
    */
    function processDonation()
        internal
    {
        require(
            charityCount > 0,
            "Cannot process donation as there are no active charities."
        );

        require(
            msg.value > charityCount,
            "Value doesn't meet minimum donation threshold of 1 wei per charity."
        );

        uint256 amountWei = msg.value;
        uint256 individualAmountWei = amountWei.div(charityCount);

        // Distribute donation equally to each charity
        for(uint256 i = 1; i <= charityCount; i++) {
            address charity = charities[i];
            charity.toPayable().transfer(individualAmountWei);
        }

        emit LogDonation(
            msg.sender,
            amountWei,
            charityCount,
            individualAmountWei
        );
    }
}