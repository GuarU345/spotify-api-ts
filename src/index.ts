import { app, PORT } from "./app";

app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
});
