export interface BarangayStaff {
    id: number;
    first_name: string;
    last_name: string;
    middle_name?: string | null;
    email: string;
    password: string;
    role?: string | null;
    email_verified_at?: Date | null;
    created_at: Date;
    updated_at: Date;
}
