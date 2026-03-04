import * as contactQueries from '../queries/contactQueries.js';
import type { Contact, IdentifyResponse } from '../types/contactTypes.js';
import { formatConsolidatedContact } from '../utils/contactUtils.js';

export const identifyContact = async (email: string | null, phoneNumber: string | null): Promise<IdentifyResponse> => {
    // 1. Find existing contacts matching email or phone
    const matchingContacts = await contactQueries.findContactsByEmailOrPhone(email, phoneNumber);

    if (matchingContacts.length === 0) {
        // 2. No existing contact: Create a new primary contact
        const newContact = await contactQueries.createContact(email, phoneNumber, null, 'primary');
        return {
            contact: formatConsolidatedContact(newContact, [])
        };
    }

    // 3. Collect ALL related contacts in the cluster
    const clusterIds = matchingContacts.map(c => c.id);
    let cluster = await contactQueries.findFullCluster(clusterIds);

    // 4. Identify the oldest primary contact
    const primaries = cluster.filter(c => c.link_precedence === 'primary');
    primaries.sort((a, b) => a.created_at.getTime() - b.created_at.getTime());

    const targetPrimary = primaries[0];
    if (!targetPrimary) {
        throw new Error('No primary contact found in cluster');
    }
    const otherPrimaries = primaries.slice(1);

    // 5. Handle merging of multiple primary groups
    if (otherPrimaries.length > 0) {
        for (const p of otherPrimaries) {
            await contactQueries.updateContactToSecondary(p.id, targetPrimary.id);
            await contactQueries.updateLinkedId(p.id, targetPrimary.id);
        }
        // Re-fetch cluster after merge
        cluster = await contactQueries.findFullCluster([targetPrimary.id]);
    }

    // 6. Check if input contains new information
    const existingEmails = new Set(cluster.map(c => c.email).filter(e => e !== null));
    const existingPhones = new Set(cluster.map(c => c.phone_number).filter(p => p !== null));

    const isNewEmail = email && !existingEmails.has(email);
    const isNewPhone = phoneNumber && !existingPhones.has(phoneNumber);

    if (isNewEmail || isNewPhone) {
        // Create secondary contact
        const newSecondary = await contactQueries.createContact(email, phoneNumber, targetPrimary.id, 'secondary');
        cluster.push(newSecondary);
    }

    // 7. Consolidate and return
    const secondaryContacts = cluster.filter(c => c.id !== targetPrimary.id);

    return {
        contact: formatConsolidatedContact(targetPrimary, secondaryContacts)
    };
};
