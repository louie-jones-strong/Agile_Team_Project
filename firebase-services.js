const admin = require("firebase-admin");

let serviceAccount = require("./welltimed-340000-firebase-adminsdk-saxbn-0ecf61c2ae.json");

admin.initializeApp({credential: admin.credential.cert(serviceAccount)});

const register = async (req, res) => {
    let email, password;
    try {
        ({ email, password } = req.body);
    } catch (e) {
        console.error(e);
        return res
            .status(400)
            .json({ error: "Missing email or password" });
    }
    
    admin.auth().createUser({
        email,
        password
    })
    .then((user) => {
        return res.send(user);
    })
    .catch((err) => {
        console.error(err);
        return res.sendStatus(500);
    });
};

const logout = (req, res, next) => {
    let uid;
    try {
        uid = req.authId;
    } catch (e) {
        console.error(e);
        return res
            .status(400)
            .json({ error: "Missing uid, user probably not logged in" });
    }
    admin.auth().revokeRefreshTokens(uid)
        .then(() => res.sendStatus(200))
        .catch((e) => {
            console.error(e);
            return res.sendStatus(500)
        });
};

const getToken = (req, res, next) => {
    if (
        req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
        req.authToken = req.headers.authorization.split(' ')[1];
    } else {
        req.authToken = null;
    }
    next();
};

const checkIfAuthenticated = (req, res, next) => {
    getToken(req, res, async () => {
        const { authToken } = req;

        if (!authToken) {
            return res
                .status(400)
                .json({ error: "Missing authentication token" })
        }

        admin.auth().verifyIdToken(authToken)
            .then((decodedToken) =>  {
                req.authId = decodedToken.uid;
                next();
            })
            .catch((e) => {
                console.error(e);
                return res
                    .status(401)
                    .json({ error: "You are not authorized to make this request" });
            });
    });
};

module.exports = {
    register,
    logout,
    checkIfAuthenticated
};