import { Router, Request, Response } from 'express';

const router = Router();

// Simple password login
router.post('/login', (req: Request, res: Response) => {
    try {
        const { password } = req.body;
        const appPassword = process.env.APP_PASSWORD || 'mypassword123';

        if (password === appPassword) {
            res.json({ success: true, message: 'Login successful' });
        } else {
            res.status(401).json({ success: false, message: 'Invalid password' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;
