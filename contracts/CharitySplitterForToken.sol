pragma solidity ^0.5.0;

import "./CharitySplitter.sol";
import "./interfaces/ICharitySplitterForToken.sol";
import "./interfaces/IERC677Receiver.sol";
import "./tokens/ERC677.sol";
import "./libraries/Bytes.sol";

/*
*  @title: CharitySplitterForToken
*  @dev: Extends CharitySplitter to allow for the donation and distribution of
*        ERC677 tokens.
*/
contract CharitySplitterForToken is CharitySplitter, ICharitySplitterForToken, IERC677Receiver {

    using Bytes for bytes;

    event LogERC677Donation(
        address _philanthropist,
        uint256 _totalDonationAmount,
        uint256 _totalCharities,
        uint256 _individualDonationAmount
    );

    /*
    * @dev: Constructor, passes owner param to CharitySplitter
    */
    constructor(
        address _owner
    )
        public
        CharitySplitter(
            _owner
        )
    {
        // Intentionally left blank
    }

    /*
    * @dev: Fallback function for ERC677 token transfers.
    * @param _from:       the sender's address
    * @param _amount:     the amount of tokens received
    * @param _data:       data payload, includes token address
    */
    function tokenFallback(
        address _from,
        uint256 _amount,
        bytes calldata _data
    )
        external
        hasActiveCharities
        returns (bool)
    {
        // Parse the data payload into ERC677 token address
        ERC677 token = ERC677(
            _data.bytesToAddress()
        );

        return processERC667Donation(
            _from,
            _amount,
            token
        );
    }

 /*
    * @dev: Processes an ERC677 token donation by splitting it equally
    *       and distributing funds to all active charities.
    * @param _from:       the sender's address
    * @param _amount:     the amount of tokens received
    * @param _token:      the ERC677 token instance
    */
    function processERC667Donation(
        address _from,
        uint256 _amount,
        ERC677 _token
    )
        internal
        returns(bool)
    {
        require(
            _amount > charityCount,
            "Value doesn't meet minimum donation threshold of 1 wei per charity."
        );

        uint256 individualAmount = _amount.div(charityCount);

        // Distribute donation equally to each charity
        for(uint256 i = 1; i <= charityCount; i++) {
            address charity = charities[i];
            _token.transfer(charity, individualAmount);
        }

        emit LogERC677Donation(
            _from,
            _amount,
            charityCount,
            individualAmount
        );

        return true;
    }
}