"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const addressService_1 = __importDefault(require("../services/addressService"));
class AddressController {
    // GET /api/addresses/suggestions?q=rue+desire+maroilles
    static async getAddressSuggestions(req, res) {
        try {
            const query = req.query.q;
            if (!query || typeof query !== 'string') {
                return res.status(400).json({ error: 'Query parameter "q" is required' });
            }
            if (query.trim().length < 3) {
                return res.json({ suggestions: [] });
            }
            const suggestions = await addressService_1.default.searchAddresses(query);
            res.json({
                suggestions,
                count: suggestions.length
            });
        }
        catch (error) {
            console.error('Error in getAddressSuggestions:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
exports.default = AddressController;
//# sourceMappingURL=addressController.js.map