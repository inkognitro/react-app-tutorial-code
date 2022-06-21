const express = require('express');
const cors = require('cors');

const port = 9000;
const app = express();
app.use(express.json())
app.use(cors({ origin: '*' }));

function createErrorMessage(messageId, translationId) {
    return {
        id: messageId,
        severity: 'error',
        translation: {
            id: translationId,
        }
    };
}

app.post('/api/v1/auth/register', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*")

    const gender = req.body.gender;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    const generalMessages = [];
    const fieldMessages = [];

    if (!gender || !['f', 'm', 'o'].includes(gender)) {
        fieldMessages.push({
            path: ['gender'],
            message: createErrorMessage('message-id-01', 'api.v1.invalidValue'),
        });
    }

    if (!username) {
        fieldMessages.push({
            path: ['username'],
            message: createErrorMessage('message-id-02', 'api.v1.invalidValue'),
        });
    }

    if (!email) {
        fieldMessages.push({
            path: ['email'],
            message: createErrorMessage('message-id-03', 'api.v1.invalidValue'),
        });
    }

    if (!password) {
        fieldMessages.push({
            path: ['password'],
            message: createErrorMessage('message-id-04', 'api.v1.invalidValue'),
        });
    }

    const success = fieldMessages.length === 0;

    if (!success) {
        generalMessages.push(createErrorMessage('general-message-id-02', 'api.v1.formErrors'));
        res.status(400);
        res.header('Content-Type', 'application/json');
        res.write(JSON.stringify({
            success,
            generalMessages,
            fieldMessages,
        }));
        res.send();
        return;
    }

    generalMessages.push(createErrorMessage('general-message-id-01', 'api.v1.userWasCreated'));
    res.status(201);
    res.header('Content-Type', 'application/json');
    res.write(JSON.stringify({
        success,
        generalMessages,
        fieldMessages,
        data: {
            apiKey: 'foo',
            user: {
                id: 'fbfe874c-ea8f-4cc1-bd4e-f07bedc30487',
                username,
            },
        }
    }));
    res.send();
});

console.log(`Mock-API is running at: http://localhost:${port}`);
app.listen(port);