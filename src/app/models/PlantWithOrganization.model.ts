export class PlantWithOrganization {
    PlantCode: string;
    Description: string;
    OrganizationCode: string;
    IsActive: boolean;
    CreatedOn: Date | string;
    CreatedBy: string;
    ModifiedOn: Date | string | null;
    ModifiedBy: string;
}