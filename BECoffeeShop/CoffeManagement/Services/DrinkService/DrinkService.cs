﻿using AutoMapper;
using CoffeManagement.Common.Exceptions;
using CoffeManagement.Common.Pagging;
using CoffeManagement.DTO.Drink;
using CoffeManagement.DTO.Paging;
using CoffeManagement.Models;
using CoffeManagement.Repositories.DrinkRepo;
using CoffeManagement.Repositories.RecipeRepo;
using Microsoft.AspNetCore.Mvc;

namespace CoffeManagement.Services.DrinkService
{
    public class DrinkService : IDrinkService
    {
        private readonly HttpContext _httpContext;
        private readonly IMapper _mapper;
        private readonly IDrinkRepository _drinkRepository;
        private readonly IDrinkSizeRepository _drinksSizeRepository;
        private readonly IRecipeRepository _recipeRepository;
        private readonly IRecipeDetailRepository _recipeDetailRepository;

        public DrinkService(IHttpContextAccessor httpContextAccessor, IMapper mapper, IDrinkRepository drinkRepository, IDrinkSizeRepository drinksSizeRepository,
            IRecipeRepository recipeRepository, IRecipeDetailRepository recipeDetailRepository)
        {
            _httpContext = httpContextAccessor.HttpContext;
            _mapper = mapper;
            _drinkRepository = drinkRepository;
            _drinksSizeRepository = drinksSizeRepository;
            _recipeRepository = recipeRepository;
            _recipeDetailRepository = recipeDetailRepository;
        }

        public async Task<PagingListModel<DrinkResponse>> GetListDrinks(PagingDTO pagingDto, ListDinkFilter filter)
        {
            var drinkQueryable = _drinkRepository.GetQueryable().Where(d => d.IsDeleted == false);

            if (filter != null)
            {
                if (filter.CategoryId != null)
                {
                    drinkQueryable = drinkQueryable.Where(d => d.CategoryId == filter.CategoryId);
                }
                if (!string.IsNullOrEmpty(filter.keySearch))
                {
                    drinkQueryable = drinkQueryable.Where(d =>
                        d.Name.Contains(filter.keySearch) ||
                        d.Description.Contains(filter.keySearch)
                    );
                }
            }
            drinkQueryable= drinkQueryable.OrderByDescending(d => d.CreatedAt);
            var pagingList = new PagingListModel<Drink>(drinkQueryable, pagingDto.PageIndex, pagingDto.PageSize);

            var result = _mapper.Map<PagingListModel<DrinkResponse>>(pagingList);

            return result;
        }

        public async Task<int> CreateDrinks(CreateDrinkRequest request)
        {
            var isDuplicateIngredient = request.Recipe.RecipeDetails.GroupBy(rd => rd.IngredientId).Any(g => g.Count() > 2);
            if (isDuplicateIngredient) throw new BadRequestException("Ingredient is duplicate.");

            var drinks = _mapper.Map<Drink>(request);
            drinks.Recipes = new Models.Recipe[] { _mapper.Map<Models.Recipe>(request.Recipe) };

            await _drinkRepository.Add(drinks);

            return drinks.Id;
        }

        public async Task<int> UpdateDrinks(UpdateDrinkRequest request)
        {
            var existedDrink = await _drinkRepository.GetById(request.Id);
            if (existedDrink == null || existedDrink.IsDeleted == true) throw new NotFoundException("Not found Drinks.");

            _mapper.Map(request, existedDrink);
            await _drinkRepository.Update(existedDrink);

            return existedDrink.Id;
        }

        public async Task<DrinkDetailResponse> GetDrinksDetail(int id)
        {
            var existedDrink = await _drinkRepository.GetById(id);
            if (existedDrink == null || existedDrink.IsDeleted == true) throw new NotFoundException("Not found Drinks.");

            var drinkDetail = _mapper.Map<DrinkDetailResponse>(existedDrink);

            return drinkDetail;
        }

        public async Task<int> DeleteDrink(int id)
        {
            var existedDrinks = await _drinkRepository.GetById(id);
            if (existedDrinks == null || existedDrinks.IsDeleted == true) throw new NotFoundException("Not found Drinks.");

            existedDrinks.IsDeleted = true;
            existedDrinks.UpdatedAt = DateTime.Now;
            await _drinkRepository.Update(existedDrinks);

            return existedDrinks.Id;
        }

        public async Task<int> CreateDrinksSize(CreateDrinkSizeRequest request)
        {
            var drinksSize = _mapper.Map<Models.DrinkSize>(request);

            await _drinksSizeRepository.Add(drinksSize);

            return drinksSize.Id;
        }

        public async Task<int> UpdateDrinksSize(UpdateDrinkSizeRequest request)
        {
            var existedDrinksSize = await _drinksSizeRepository.GetById(request.Id);
            if (existedDrinksSize == null || existedDrinksSize.IsDeleted == true) throw new NotFoundException("Not found Drinks Size.");

            _mapper.Map(request, existedDrinksSize);
            await _drinksSizeRepository.Update(existedDrinksSize);

            return existedDrinksSize.Id;
        }

        public async Task<int> DeleteDrinksSize(int id)
        {
            var existedDrinksSize = await _drinksSizeRepository.GetById(id);
            if (existedDrinksSize == null || existedDrinksSize.IsDeleted == true) throw new NotFoundException("Not found Drinks Size.");

            existedDrinksSize.IsDeleted = true;
            existedDrinksSize.UpdatedAt = DateTime.Now;
            await _drinksSizeRepository.Update(existedDrinksSize);

            return existedDrinksSize.Id;
        }


        public async Task<int> UpdateRecipe(UpdateRecipeRequest request)
        {
            var isDuplicateIngredient = request.RecipeDetails.GroupBy(rd => rd.IngredientId).Any(g => g.Count() > 2);
            if (isDuplicateIngredient) throw new BadRequestException("Ingredient is duplicate.");

            var recipeExist = await _recipeRepository.GetById(request.Id);
            if (recipeExist == null) throw new NotFoundException("Not found Recipe.");

            foreach (var recipeDetail in request.RecipeDetails)
            {
                var recipeDetailExist = (await _recipeDetailRepository.Where(rd => rd.RecipeId == recipeExist.Id && rd.IngredientId == recipeDetail.IngredientId)).FirstOrDefault();
                if (recipeDetailExist == null)
                {
                    var recipeDetailNew = _mapper.Map<Models.RecipeDetail>(recipeDetail);
                    recipeDetailNew.RecipeId = request.Id;
                    await _recipeDetailRepository.Add(recipeDetailNew);
                }
                else
                {
                    _mapper.Map(recipeDetail, recipeDetailExist);
                    await _recipeDetailRepository.Update(recipeDetailExist);
                }
            }

            foreach (var recipeDetail in recipeExist.RecipeDetails.ToList())
            {
                if (!request.RecipeDetails.Any(rd => rd.IngredientId == recipeDetail.IngredientId))
                {
                    await _recipeDetailRepository.Remove(recipeDetail.Id);
                }
            }

            recipeExist.Intructon = request.Intructon;
            await _recipeRepository.Update(recipeExist);

            return recipeExist.Id;
        }
    }
}
