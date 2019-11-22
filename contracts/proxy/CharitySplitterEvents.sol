pragma solidity ^0.5.0;

/*
*  @title: CharitySplitterEvents
*  @dev: Declares events used by CharitySplitterV2.
*/
contract CharitySplitterEvents {
    event LogCharityAdded(address _charity, uint256 _totalCharities);
    event LogCharityRemoved(address _charity, uint256 _totalCharities);
    event LogDonation(address _philanthropist, uint256 _totalDonationAmount, uint256 _totalCharities, uint256 _individualDonationAmount);
}