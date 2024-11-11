export interface CensusProfile {
    id: number;
    date_of_reinterview?: Date | string; // Optional field if date is nullable
    respondent_name: string; // Corresponds to the respondent's name
    respondent_address: string; // Address of the respondent
    total_members: number; // Total number of members in the household
    male_members: number; // Total number of male members in the household
    female_members: number; // Total number of female members in the household

    // Additional fields specific to census profiles if needed
    createdAt?: Date; // Creation date of the record
    updatedAt?: Date; // Last updated date of the record
}
