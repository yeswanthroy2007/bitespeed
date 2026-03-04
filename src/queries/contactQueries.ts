import { query } from '../db/db.js';
import type { Contact } from '../types/contactTypes.js';

export const findContactsByEmailOrPhone = async (email: string | null, phoneNumber: string | null): Promise<Contact[]> => {
  const sql = `
    SELECT * FROM contacts 
    WHERE (email = $1 AND email IS NOT NULL) 
    OR (phone_number = $2 AND phone_number IS NOT NULL)
    AND deleted_at IS NULL
  `;
  const result = await query(sql, [email, phoneNumber]);
  return result.rows;
};

export const findContactsByLinkedId = async (linkedId: number): Promise<Contact[]> => {
  const sql = 'SELECT * FROM contacts WHERE (linked_id = $1 OR id = $1) AND deleted_at IS NULL';
  const result = await query(sql, [linkedId]);
  return result.rows;
};

export const findFullCluster = async (contactIds: number[]): Promise<Contact[]> => {
  if (contactIds.length === 0) return [];
  // This query finds all contacts that share either the same primary contact (linked_id) 
  // or are the primary contact themselves for any of the given IDs.
  const sql = `
    WITH RECURSIVE cluster AS (
      SELECT * FROM contacts WHERE id ANY($1::int[])
      UNION
      SELECT c.* FROM contacts c
      INNER JOIN cluster cl ON c.linked_id = cl.id OR c.id = cl.linked_id
    )
    SELECT DISTINCT * FROM cluster WHERE deleted_at IS NULL;
  `;
  // Alternative simpler approach: find all primary IDs associated with these contacts, then get all their secondaries.
  const primaryIdsSql = `
    SELECT DISTINCT COALESCE(linked_id, id) as primary_id 
    FROM contacts 
    WHERE id = ANY($1::int[]) AND deleted_at IS NULL
  `;
  const primaryResult = await query(primaryIdsSql, [contactIds]);
  const primaryIds = primaryResult.rows.map(r => r.primary_id);

  if (primaryIds.length === 0) return [];

  const fullClusterSql = `
    SELECT * FROM contacts 
    WHERE (id = ANY($1::int[]) OR linked_id = ANY($1::int[]))
    AND deleted_at IS NULL
    ORDER BY created_at ASC
  `;
  const result = await query(fullClusterSql, [primaryIds]);
  return result.rows;
};

export const createContact = async (
  email: string | null,
  phoneNumber: string | null,
  linkedId: number | null,
  linkPrecedence: 'primary' | 'secondary'
): Promise<Contact> => {
  const sql = `
    INSERT INTO contacts (email, phone_number, linked_id, link_precedence)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const result = await query(sql, [email, phoneNumber, linkedId, linkPrecedence]);
  return result.rows[0];
};

export const updateContactToSecondary = async (contactId: number, linkedId: number): Promise<void> => {
  const sql = `
    UPDATE contacts 
    SET link_precedence = 'secondary', linked_id = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
  `;
  await query(sql, [linkedId, contactId]);
};

export const updateLinkedId = async (oldLinkedId: number, newLinkedId: number): Promise<void> => {
  const sql = `
    UPDATE contacts 
    SET linked_id = $1, updated_at = CURRENT_TIMESTAMP
    WHERE linked_id = $2
  `;
  await query(sql, [newLinkedId, oldLinkedId]);
};
