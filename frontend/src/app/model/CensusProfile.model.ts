export interface CensusProfile {
    id: number;
    first_name: string;
    middle_name?: string | null;
    last_name: string;
    address?: string;
    ownership: string;
    provincial_address?: string;
    length_of_stay: string;
    gender?: string;
    civil_status?: string;
    birthdate?: Date;
    place_of_birth?: string;
    contact_number?: string;
    height?: string;
    weight?: string;
    religion?: string;
    email: string;
    voter: boolean;
    four_ps: boolean;
    pwd: boolean;

    elementary?: string;
    elementary_address?: string;

    high_school?: string;
    high_school_address?: string;

    vocational?: string;
    vocational_address?: string;

    college?: string;
    college_address?: string;

    employerRows: any[];
    familyRows: any[];

    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;

}
