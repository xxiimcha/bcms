export interface BarangayResident {
    id: number;
    first_name: string;
    middle_name?: string | null;
    last_name: string;

    gender?: string | null;
    age?: number | null;
    birthdate?: Date | null;
    civil_status?: string | null;
    household_count?: number | null;
    email: string;
    password: string;
    contact_number?: string | null;
    place_of_birth?: string | null;
    occupation?: string | null;
    monthly_salary?: string | null;
    purok?: string | null;
    street?: string | null;
    barangay?: string | null;
    city?: string | null;
    zipcode?: string | null;
    role?: string | null;
    education: string;
    address?: string;
    ownership: string;
    provincial_address?: string;
    length_of_stay: string;
    height?: string;
    weight?: string;
    religion?: string;
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
