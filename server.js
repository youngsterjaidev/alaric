require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const admin = require("firebase-admin");
const stripe = require("stripe")(
    "sk_test_51J1BowSCr7kmnfa9H30H3SGW3Szo6IOhOEkTYH8dqJ84eRWioCKjWjOSVmszayMIxFRL0XKaLSMbUxIRAMeOGTT800itw48EEB"
);
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5050;

const YOUR_DOMAIN = "https://gq00c.csb.app/";

/*const serviceAccount = require("./react-native-chikchak-firebase-firebase-adminsdk-kdg7q-16cf1e679a.json");

let defaultApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://react-native-chikchak-firebase.firebaseio.com",
});*/

var serviceAccount = require("./alaric-335213-firebase-adminsdk-au5ar-b73addd636.json");

let defaultApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://alaric-335213-default-rtdb.firebaseio.com"
});

const Auth = defaultApp.auth();
const database = defaultApp.database();
const firestore = defaultApp.firestore();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("--------------------------------------------");
});

/**
 * Creating a User
 * - get the data from the request body
 * - send the data to the auth client of firebase
 * - after the user is created enter the data on the firestore
 * - send the response to the client the user is created !
 */
app.post("/", (req, res) => {
    const { email, password, displayName, userType, busNumber } = req.body;

    Auth.createUser({
        email: email,
        password: password,
        displayName: displayName,
    })
        .then((user) => {
            firestore
                .collection("accounts")
                .doc(user.uid)
                .set({
                    uid: user.uid,
                    type: userType,
                    busNumber: "",
                    balance: 0,
                })
                .then((result) => {
                    console.log("The Result", result);
                    res.status(200).json({
                        user: user,
                        message: "Account Created Successfully !",
                        ok: true,
                    });
                })
                .catch((e) => {
                    console.log("Error Occured while register on firestore", e);
                    res.status(400).json({
                        message: e.message,
                        ok: false,
                    });
                });
        })
        .catch((e) => {
            console.log("Error Occured while creating user", e);
            res.status(400).json({
                message: e.message,
                ok: false,
            });
        });
});

/**
 * Add the tokens from the wallet
 * - get the data from the request body
 * - add the number of amount to the balance 
 * - update the data in the firebase record
 */
app.post("/addBalance", async (req, res) => {
    const { uid, balance, amount } = req.body;

    newBalance = balance + amount;

    // update the user
    const result = await firestore.collection("accounts").doc(uid).set(
        {
            balance: newBalance,
        },
        { merge: true }
    );
    if (result) {
        res.send({ message: "Account change sucessfully !", ok: true });
    } else {
        res.send({ message: "There was an error", ok: false });
    }
});

/**
 * Decrease the tokens form the wallet
 */

app.post("/decreaseBalance", async (req, res) => {
    console.log(req.body);
    const { uid, balance, amount } = req.body;

    newBalance = balance - amount;
    console.log(newBalance)

    // update the user
    const result = await firestore.collection("accounts").doc(uid).set(
        {
            balance: newBalance,
        },
        { merge: true }
    );
    if (result) {
        res.send({
            message: "Account change sucessfully !",
            ok: true,
            balance: newBalance,
        });
    } else {
        res.send({ message: "There was an error", ok: false });
    }
});

app.post("/create-checkout-session", async (req, res) => {
    // creating session to get the checkout page
    const sessions = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        // setting the product imformation
        line_items: [
            {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: "Ticket Price",
                    },
                    unit_amount: 2000,
                },
                quantity: 1,
            },
        ],
        mode: "payment",
        success_url: `${YOUR_DOMAIN}?success=true`,
        cancel_url: `${YOUR_DOMAIN}?canceled=true`,
    });

    // send the sesssion to the client
    res.status(200).json({ id: session.id });
});

const calculateOrderAmount = (items) => {
    // do some manipulation and change the price
    return 1400;
};

// create  payment intent route
app.post("/create-payment-intent", async (req, res) => {
    try {
        const { items } = req.body;
        // create a paymentIntent with the order amount and currency
        // paymentIntent used to track the customer's payment lifecycle and
        // ensuring the user charged once
        const paymentIntent = await stripe.paymentIntents.create({
            amount: calculateOrderAmount(items),
            currency: "inr",
        });

        // send the client_secret response that use to intract with stripe Server
        res.status(200).send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (e) {
        console.log("Error Occured while in create-payment-intent ", e)
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
