﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;

namespace CoffeManagement.Models;

public partial class DrinkSize
{
    public int Id { get; set; }

    public int DrinkId { get; set; }

    public string Size { get; set; }

    public double Ratio { get; set; }

    public double Price { get; set; }

    public bool? IsDeleted { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual Drink Drink { get; set; }

    public virtual ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
}