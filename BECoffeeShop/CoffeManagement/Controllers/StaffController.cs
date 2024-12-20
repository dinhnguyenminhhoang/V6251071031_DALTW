﻿using CoffeManagement.DTO.Paging;
using CoffeManagement.DTO.Staff;
using CoffeManagement.Services.StaffService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace CoffeManagement.Controllers
{
    [Route("Staffs")]
    [ApiController]
    public class StaffController :  BaseController
    {
        private readonly IStaffService _staffsService;

        public StaffController(IStaffService staffsService)
        {
            _staffsService = staffsService;
        }

        [HttpGet]
        [AllowAnonymous]
        [SwaggerOperation(Summary = "Get List Staffs")]
        public async Task<IActionResult> GetListStaffs([FromQuery] PagingDTO pagingDto)
        {
            var result = await _staffsService.GetListStaff(pagingDto);

            return Ok(RenderSuccessResponse(result));
        }
        [HttpGet("{id:int}")]
        [AllowAnonymous]
        [SwaggerOperation(Summary = "Get Staff Detail")]
        public async Task<IActionResult> GetStaffsDetail([FromRoute] int id)
        {
            var result = await _staffsService.GetStaffDetail(id);

            return Ok(RenderSuccessResponse(result));
        }

        [HttpPost]
        // [Authorize(Policy = nameof(AuthPolicy.POL_ADMIN))]
        [SwaggerOperation(Summary = "Create new staff")]
        public async Task<IActionResult> CreateStaffs(CreateStaffRequest request)
        {
            var result = await _staffsService.CreateStaff(request);

            return Ok(RenderSuccessResponse(data: result, message: "SUCCESS"));
        }

        [HttpPut]
        // [Authorize(Policy = nameof(AuthPolicy.POL_ADMIN))]
        [SwaggerOperation(Summary = "Update Staffs")]
        public async Task<IActionResult> UpdateStaffs([FromBody] UpdateStaffsRequest request)
        {
            var result = await _staffsService.UpdateStaff(request);

            return Ok(RenderSuccessResponse(data: result, message: "SUCCESS"));
        }

        [HttpDelete("{id:int}")]
       // [Authorize(Policy = nameof(AuthPolicy.POL_ADMIN))]
        [SwaggerOperation(Summary = "Delete staff")]
        public async Task<IActionResult> DeleteStaffs([FromRoute] int id)
        {
            var result = await _staffsService.DeleteStaff(id);

            return Ok(RenderSuccessResponse(data: result, message: "SUCCESS"));
        }

        [HttpPost("AddAccount")]
        //[Authorize(Policy = nameof(AuthPolicy.POL_ADMIN))]
        [SwaggerOperation(Summary = "Add Account for Staff")]
        public async Task<IActionResult> AddAcountForStaff([FromBody] CreateAccountForStaffRequest request)
        {
            var result = await _staffsService.AddAccountForStaff(request);

            return Ok(RenderSuccessResponse(data: result, message: "SUCCESS"));
        }

        [HttpPut("UpdateAccount")]
        //[Authorize(Policy = nameof(AuthPolicy.POL_ADMIN))]
        [SwaggerOperation(Summary = "Update Account of Customers")]
        public async Task<IActionResult> UpdateAcountForCustomer([FromBody] UpdateAccountOfStaffRequest request)
        {
            var result = await _staffsService.UpdateAccountOfStaff(request);

            return Ok(RenderSuccessResponse(data: result, message: "SUCCESS"));
        }
    }
}
