import { Request, Response } from 'express';
import AddressService from '../services/addressService';

class AddressController {
  
  // GET /api/addresses/suggestions?q=rue+desire+maroilles
  static async getAddressSuggestions(req: Request, res: Response) {
    try {
      const query = req.query.q as string;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Query parameter "q" is required' });
      }
      
      if (query.trim().length < 3) {
        return res.json({ suggestions: [] });
      }
      
      const suggestions = await AddressService.searchAddresses(query);
      
      res.json({ 
        suggestions,
        count: suggestions.length 
      });
      
    } catch (error) {
      console.error('Error in getAddressSuggestions:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default AddressController;