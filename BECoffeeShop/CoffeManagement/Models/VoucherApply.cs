﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;

namespace CoffeManagement.Models;

public partial class VoucherApply
{
    public int Id { get; set; }

    public int VoucherId { get; set; }

    public int DrinkId { get; set; }

    public virtual Drink Drink { get; set; }

    public virtual Voucher Voucher { get; set; }
}