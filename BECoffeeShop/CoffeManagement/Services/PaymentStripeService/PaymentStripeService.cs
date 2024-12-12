using CoffeManagement.DTO.PaymentStripe;
using Microsoft.Extensions.Options;
using Stripe;

namespace CoffeManagement.Services.PaymentStripeService
{
    public class PaymentStripeService : IPaymentStripeService
    {
        private readonly string _apiKey;
        public PaymentStripeService(IConfiguration configuration)
        {
            _apiKey = configuration.GetValue<string>("Payment:StripeSecret") ?? string.Empty;
            StripeConfiguration.ApiKey = _apiKey;
        }

        public async Task<string> CreatePaymentIntentAsync(decimal amount, string currency)
        {
            var options = new PaymentIntentCreateOptions
            {
                Amount = (long)(amount * 100), 
                Currency = currency,
                PaymentMethodTypes = new List<string>
                {
                    "card",
                },
            };

            var service = new PaymentIntentService();
            PaymentIntent intent = await service.CreateAsync(options);
            return intent.ClientSecret;
        }
    }
}
