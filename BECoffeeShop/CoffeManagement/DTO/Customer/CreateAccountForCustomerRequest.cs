﻿using CoffeManagement.DTO.Account;

namespace CoffeManagement.DTO.Customer
{
    public class CreateAccountForCustomerRequest
    {
        public int CustomerId { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
