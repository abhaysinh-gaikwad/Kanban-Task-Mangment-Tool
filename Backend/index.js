"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const board_route_1 = __importDefault(require("./routes/board.route"));
const task_route_1 = __importDefault(require("./routes/task.route"));
const subtask_route_1 = __importDefault(require("./routes/subtask.route"));
const swagger_route_1 = __importDefault(require("./routes/swagger.route"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json(), (0, cors_1.default)());
app.use('/user', user_route_1.default);
app.use('/board', board_route_1.default);
app.use('/task', task_route_1.default);
app.use('/subtask', subtask_route_1.default);
// Use the Swagger router for documentation
app.use('/api-docs', swagger_route_1.default);
app.get('/', (req, res) => {
    res.send('server is running');
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_1.default;
        console.log(`Connected to DB`);
        console.log(`Server is running on port ${PORT}`);
    }
    catch (error) {
        console.log(error);
    }
}));
exports.default = app;
