const express = require('express');

class DefaultApiHandler {
    get(req, res) {
        res.json({
            resultStatus: 'SUCCESS',
            message: 'Default Api Handler'
        });
    }
}

const app = express();
const apiRouter = express.Router();
const defaultApiHandler = new DefaultApiHandler();

apiRouter.get('/', (req, res) => defaultApiHandler.get(req, res));

app.use('/api', apiRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = DefaultApiHandler;