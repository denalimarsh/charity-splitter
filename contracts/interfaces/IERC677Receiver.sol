pragma solidity ^0.5.0;

interface IERC677Receiver {
  function tokenFallback(address from, uint256 amount, bytes calldata data) external returns (bool);
}