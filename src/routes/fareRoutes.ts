import { Router, Request, Response, NextFunction } from 'express';
import { handleFareCalculation } from '../controllers/fareController';
import { body, validationResult } from 'express-validator';

const router: Router = Router();

router.post(
  '/calculate-fare',
  [
    body('journeys')
      .isArray({ min: 1 })
      .withMessage('"journeys" should be a non-empty array.'),
    body('journeys.*')
      .isString()
      .withMessage('Each journey must be a string in the format "FromLine,ToLine,DateTime".'),
  ],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    try {
      const journeys: string[] = req.body.journeys;

      // Process fare calculation
      const totalFare = await handleFareCalculation(journeys);

      res.json({ totalFare });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
