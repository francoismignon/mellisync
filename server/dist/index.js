"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const apiaryController_1 = __importDefault(require("./src/controllers/apiaryController"));
const hiveConroller_1 = __importDefault(require("./src/controllers/hiveConroller"));
const actionController_1 = __importDefault(require("./src/controllers/actionController"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT;
//middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('combined'));
app.use(express_1.default.json());
//Routes Rucher
app.post("/api/apiaries", apiaryController_1.default.create);
app.get("/api/apiaries", apiaryController_1.default.findAll);
app.delete("/api/apiaries/:id", apiaryController_1.default.delete);
//Routes Ruche
app.get("/api/hives", hiveConroller_1.default.findAllByApiary);
app.post("/api/hives", hiveConroller_1.default.create);
app.get("/api/hives/:id", hiveConroller_1.default.findById);
//Routes pour la définition des actions
app.get("/api/actions", actionController_1.default.findAll);
//route test
app.get("/", (req, res) => {
    res.json({ message: 'API Mellisync - Gestion de ruches' });
});
app.listen(PORT, () => {
    console.log(`Le serveur a bien démarrer sur : http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map