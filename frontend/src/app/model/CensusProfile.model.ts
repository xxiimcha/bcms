export interface CensusProfile {
    id: number;
    date_of_reinterview?: Date | string;
    respondent_name: string;
    respondent_address: string;
    total_members: number;
    male_members: number;
    female_members: number;
    householdMembers?: HouseholdMember[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface HouseholdMember {
    id?: number;
    name: string;
    relationship: string;
    sex: 'Male' | 'Female';
    dateOfBirth: string;
    age: number;
    isPWD: boolean;
    is4PsBeneficiary: boolean;
    isEmployed: boolean;
    educationalAttainment: string;
}
