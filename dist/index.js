"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
app_1.app.listen(app_1.PORT, () => {
    console.log(`server listening on port ${app_1.PORT}`);
});
