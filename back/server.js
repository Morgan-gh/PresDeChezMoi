const express = require("express");
const cors = require("cors");

const app = express();

var corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./models");
// db.sequelize.sync({ force: true }) 
db.sequelize.sync({ force: true })
    .then(() => {
        console.log("Drop and re-sync db.");
    })
    .catch((err) => {
        console.log("Failed to sync db: " + err.message);
    });


// // simple route
// app.get("/", (req, res) => {
//     res.json({ message: "Welcome to bezkoder application." });
// });


require("./routes/utilisateur.routes.js")(app);
require("./routes/roles.routes.js")(app);
require("./routes/typeUrgence.routes.js")(app);
require("./routes/typeSignalement.routes.js")(app);
require("./routes/status.routes.js")(app);
require("./routes/ville.routes.js")(app);
require("./routes/recompense.routes.js")(app);
require("./routes/ticket.routes.js")(app);
require("./routes/notification.routes.js")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});