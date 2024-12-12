﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;

namespace CoffeManagement.Models;

public partial class Ingredient
{
    public int Id { get; set; }

    public string Name { get; set; }

    public string Description { get; set; }

    public bool? IsDeleted { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<IngredientStock> IngredientStocks { get; set; } = new List<IngredientStock>();

    public virtual ICollection<RecipeDetail> RecipeDetails { get; set; } = new List<RecipeDetail>();
}