﻿namespace CoffeManagement.DTO.Branch
{
    public class BranchesResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public decimal Latitude {get; set; }
        public decimal Longitude {get; set; }
    }
}
