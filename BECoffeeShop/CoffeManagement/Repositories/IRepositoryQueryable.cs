﻿namespace CoffeManagement.Repositories
{
    public interface IRepositoryQueryable<T> where T : class
    {
        IQueryable<T> GetQueryable();
    }
}
