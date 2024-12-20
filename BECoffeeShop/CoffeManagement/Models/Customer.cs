﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;

namespace CoffeManagement.Models;

public partial class Customer
{
    public int Id { get; set; }

    public string FullName { get; set; }

    public string Phone { get; set; }

    public string Address { get; set; }

    public int? AccountId { get; set; }

    public bool? IsDeleted { get; set; }

    public bool? IsActivated { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public string Email { get; set; }

    public virtual Account Account { get; set; }

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}