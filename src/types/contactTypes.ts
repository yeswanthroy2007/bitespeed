export interface Contact {
    id: number;
    email: string | null;
    phone_number: string | null;
    linked_id: number | null;
    link_precedence: 'primary' | 'secondary';
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}

export interface IdentifyRequest {
    email: string | null;
    phoneNumber: string | null;
}

export interface ConsolidatedContact {
    primaryContactId: number;
    emails: string[];
    phoneNumbers: string[];
    secondaryContactIds: number[];
}

export interface IdentifyResponse {
    contact: ConsolidatedContact;
}
