const db = require("../models");
const Utilisateur = db.utilisateur;

// title: req.body.title,
// description: req.body.description,
// published: req.body.published ? req.body.published : false


exports.create = (req, res) => {
    var boolErrorFlag = false;
    var stringErrorMessage = "";

    // Champ nécessaire pour la requete
    if (!req.body.pseudo || !req.body.mail || !req.body.motDePasse) {
        boolErrorFlag = true
        stringErrorMessage = "Content can not be empty!"
    }

    // Validate request
    if (boolErrorFlag) {
        res.status(400).send({
            message: stringErrorMessage
        });
        return;
    }

    // Create User
    const utilisateurObjet = {
        pseudo: req.body.pseudo,
        nom: null,
        prenom: null,
        photoProfil: null,
        mail: req.body.mail,
        motDePasse: req.body.motDePasse,
        idVille: null,
        score: 0,
        participation: null,
        estAdministrateur: null,
        abonnement: null,
        profession: null,
        idRecompense: null,
        listRecompense: null,
        nombreSignalement: 0,
        estBanni: false,
        idRole: null,
        listAnnonceEnregistre: null
    };

    // Save Tutorial in the database adn catch internal error
    Utilisateur.create(utilisateurObjet)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Tutorial."
            });
        });
};

exports.find_one = (req, res) => {
    const id = req.params.id;

    Utilisateur.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find utilisateur with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving utilisateur with id=" + id
            });
        });
};

exports.find_all = (req, res) => {
    Utilisateur.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        });
};

exports.update = (req, res) => {
    const id = req.params.id;

    Utilisateur.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Utilisateur was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Utilisateur with id=${id}. Maybe Utilisateur was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Utilisateur with id=" + id + "(" + err + ")"
            });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;

    Utilisateur.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Utilisateur was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Utilisateur with id=${id}. Maybe Utilisateur was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Utilisateur with id=" + id
            });
        });
};
