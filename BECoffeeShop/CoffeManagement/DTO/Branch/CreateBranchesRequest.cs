namespace CoffeManagement.DTO.Branch
{
    public class CreateBranchesRequest
    {
        public string Name { get; set; }
        public string Address { get; set; }
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
    }
}
