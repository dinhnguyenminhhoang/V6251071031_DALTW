﻿using System.Net;

namespace CoffeManagement.Common.Exceptions
{
    public class UnauthorizedException : CustomHttpException
    {
        public UnauthorizedException(string? message) : base(message, HttpStatusCode.Unauthorized)
        {
        }
    }
}
