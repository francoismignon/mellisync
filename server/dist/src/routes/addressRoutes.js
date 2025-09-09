"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const addressController_1 = __importDefault(require("../controllers/addressController"));
const router = (0, express_1.Router)();
// Route pour recherche d'adresses avec autocomplétion
router.get('/suggestions', auth_1.authenticateToken, addressController_1.default.getAddressSuggestions);
exports.default = router;
//# sourceMappingURL=addressRoutes.js.map