import type { Request, Response } from 'express';
import * as identityService from '../services/identityService.js';
import type { IdentifyRequest } from '../types/contactTypes.js';

export const identify = async (req: Request, res: Response) => {
    try {
        const { email, phoneNumber } = req.body as IdentifyRequest;

        // Validation: At least one of the two must be present
        if (!email && !phoneNumber) {
            return res.status(400).json({ error: 'Email or phoneNumber is required' });
        }

        const result = await identityService.identifyContact(email || null, phoneNumber ? String(phoneNumber) : null);

        return res.status(200).json(result);
    } catch (error) {
        console.error('Error in identify controller:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
