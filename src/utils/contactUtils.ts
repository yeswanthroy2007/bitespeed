import type { Contact, ConsolidatedContact } from '../types/contactTypes.js';

export const formatConsolidatedContact = (primary: Contact, secondaries: Contact[]): ConsolidatedContact => {
    const emails = new Set<string>();
    const phoneNumbers = new Set<string>();
    const secondaryContactIds: number[] = [];

    // Rules:
    // emails -> first element must be the primary contact email
    // phoneNumbers -> first element must be the primary contact phone number

    if (primary.email) emails.add(primary.email);
    if (primary.phone_number) phoneNumbers.add(primary.phone_number);

    secondaries.forEach(s => {
        if (s.email) emails.add(s.email);
        if (s.phone_number) phoneNumbers.add(s.phone_number);
        secondaryContactIds.push(s.id);
    });

    return {
        primaryContactId: primary.id,
        emails: Array.from(emails),
        phoneNumbers: Array.from(phoneNumbers),
        secondaryContactIds
    };
};
