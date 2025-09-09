"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const apiaryController_1 = __importDefault(require("./src/controllers/apiaryController"));
const hiveConroller_1 = __importDefault(require("./src/controllers/hiveConroller"));
const actionController_1 = __importDefault(require("./src/controllers/actionController"));
const visitController_1 = __importDefault(require("./src/controllers/visitController"));
const authController_1 = __importDefault(require("./src/controllers/authController"));
const dashboardController_1 = __importDefault(require("./src/controllers/dashboardController"));
const addressController_1 = __importDefault(require("./src/controllers/addressController"));
const auth_1 = require("./src/middleware/auth");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT;
//middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.NODE_ENV === 'production'
        ? `https://${process.env.WEB_DOMAIN}`
        : 'http://localhost:5173',
    credentials: true // Important pour les cookies
}));
app.use((0, morgan_1.default)('combined'));
app.use((0, cookie_parser_1.default)()); // Middleware pour parser les cookies
app.use(express_1.default.json());
//Routes Rucher (protégées)
app.post("/api/apiaries", auth_1.authenticateToken, apiaryController_1.default.create);
app.get("/api/apiaries", auth_1.authenticateToken, apiaryController_1.default.findAll);
app.get("/api/apiaries/:id", auth_1.authenticateToken, apiaryController_1.default.findById);
//Routes Ruche (protégées)
app.get("/api/hives", auth_1.authenticateToken, hiveConroller_1.default.findAllByApiary);
app.post("/api/hives", auth_1.authenticateToken, hiveConroller_1.default.create);
app.get("/api/hives/:id", auth_1.authenticateToken, hiveConroller_1.default.findById);
app.get("/api/hives/:id/visits", auth_1.authenticateToken, visitController_1.default.findAllByHive);
app.get("/api/hives/:id/transhumances", auth_1.authenticateToken, hiveConroller_1.default.getTranshumanceHistory);
app.post("/api/hives/:id/move", auth_1.authenticateToken, hiveConroller_1.default.moveToApiary);
app.put("/api/hives/:id/status", auth_1.authenticateToken, hiveConroller_1.default.updateStatus);
app.post("/api/hives/:id/generate-qr", auth_1.authenticateToken, hiveConroller_1.default.generateQRCode);
//Routes pour la définition des actions (protégées)
// Route unique qui gère 2 cas :
// - GET /api/actions → Toutes les actions (mode expert)  
// - GET /api/actions?filter=current → Actions filtrées selon période/météo/température (mode normal)
app.get("/api/actions", auth_1.authenticateToken, actionController_1.default.findAll);
//Routes pour les visites (protégées)
app.post("/api/visits", auth_1.authenticateToken, visitController_1.default.create);
app.get("/api/visits/:id/pdf", auth_1.authenticateToken, visitController_1.default.generatePDF);
//Routes pour l'authentification
app.post("/api/auth/register", authController_1.default.register);
app.post("/api/auth/login", authController_1.default.login);
app.post("/api/auth/logout", authController_1.default.logout);
app.get("/api/auth/me", auth_1.authenticateToken, authController_1.default.me);
//Route pour le dashboard
app.get("/api/dashboard", auth_1.authenticateToken, dashboardController_1.default.getDashboardData);
//Routes pour les adresses (autocomplétion)
app.get("/api/addresses/suggestions", auth_1.authenticateToken, addressController_1.default.getAddressSuggestions);
//route test
app.get("/", (_req, res) => {
    res.json({ message: 'API Mellisync - Gestion de ruches' });
});
app.listen(PORT, () => {
    console.log(`Le serveur a bien démarrer sur : http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map