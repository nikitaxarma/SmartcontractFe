// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    uint256 public balance;
    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);
    event FactorialCalculated(uint256 number, uint256 result);
    event PalindromeChecked(uint256 number, bool isPalindrome);
    vconstructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    function getBalance() public view returns(uint256){
        return balance;
    }
    function deposit(uint256 _amount) public payable {
        uint _previousBalance = balance;

        require(msg.sender == owner, "You are not the owner of this account");

        balance += _amount;

        assert(balance == _previousBalance + _amount);

        emit Deposit(_amount);
    }

    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint _previousBalance = balance;
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }

        balance -= _withdrawAmount;

        assert(balance == (_previousBalance - _withdrawAmount));

        emit Withdraw(_withdrawAmount);
    }

    function calculateFactorial(uint256 _number) public {
        uint256 result = 1;
        for (uint256 i = 1; i <= _number; i++) {
            result *= i;
        }
        emit FactorialCalculated(_number, result);
    }

    function checkPalindrome(uint256 _number) public {
        uint256 original = _number;
        uint256 reversed = 0;
        while (_number != 0) {
            uint256 digit = _number % 10;
            reversed = reversed * 10 + digit;
            _number /= 10;
        }
        emit PalindromeChecked(original, original == reversed);
    }
}
