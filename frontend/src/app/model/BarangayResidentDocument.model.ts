export interface BarangayResidentDocument {
    id: number;
    resident_id: number | 0;
    certificate_type: string | "";
    certificate_file: string | "";
    date_issued: string | null;
    purpose: string | null;
    status: string | null;
    created_at?: Date;
    updated_at?: Date;
}
