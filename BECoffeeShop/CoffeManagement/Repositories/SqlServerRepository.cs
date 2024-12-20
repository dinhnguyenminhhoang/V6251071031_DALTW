﻿using CoffeManagement.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace CoffeManagement.Repositories
{
    public abstract class SqlServerRepository<T> : IRepository<T> where T : class
    {
        private readonly DBContext _context;
        private readonly DbSet<T> _dbSet;


        protected SqlServerRepository(DBContext context)
        {
            _context = context;
            _dbSet = _context.Set<T>();
        }

        public virtual async Task<T> Add(T obj)
        {
            _dbSet.Add(obj);
            await _context.SaveChangesAsync();
            return obj;
        }

        public virtual async Task<T?> GetById(int id)
        {
            return await _dbSet.FindAsync(id);
        }

        public virtual async Task<IEnumerable<T>> Where(Expression<Func<T, bool>> predicate)
        {
            return await _dbSet.Where(predicate).ToListAsync();
        }

        public virtual async Task<IEnumerable<T>> GetAll()
        {
            return await _dbSet.ToListAsync();

        }

        public virtual async Task<T> Update(T obj)
        {
            _dbSet.Attach(obj);
            _context.Entry(obj).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return obj;
        }

        public virtual async Task<bool> Remove(int id)
        {
            var objToDelete = await _dbSet.FindAsync(id);
            if (objToDelete is null) return false;
            _dbSet.Remove(objToDelete);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<T>> AddMultiple(IEnumerable<T> objs)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    _dbSet.AddRange(objs);
                    await _context.SaveChangesAsync();
                    transaction.Commit();
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw;
                }
            }

            return objs;
        }

        public async Task<bool> RemoveMultiple(IEnumerable<T> objs)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    _dbSet.RemoveRange(objs);
                    await _context.SaveChangesAsync();
                    transaction.Commit();
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    return false;
                }
            }

            return true;
        }
    }
}
