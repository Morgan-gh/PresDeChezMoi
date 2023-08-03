import { getAPI, postAPI, putAPI, deleteAPI } from "../../api.js";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import DropDownBtn from "../MainComponent/DropDownBtn.js";
const adresseip = process.env.REACT_APP_BACKEND_ADRESSEIP
const port = process.env.REACT_APP_BACKEND_PORT
const Tickets = () => {
  const utilisateur = useSelector((state) => state.utilisateur);
  const [listTicket, setListTicket] = useState([]);
  const [listTicketFiltre, setListTicketFiltre] = useState([]);
  const [listTicketStatus, setListTicketStatus] = useState([]);
  const [filtre, setFiltre] = useState("");
  const [status, setStatus] = useState("");
  const [isFiltre, setIsFiltre] = useState(false); // Filtre : + récent, - récent
  const [isStatus, setisStatus] = useState(false); // Status : En cours, terminé etc

  useEffect(() => {
    getAPI(`http://${adresseip}:${port}/api/ticket`, null, {
      "x-access-token": utilisateur.token,
    })
      .then((response) => {
        setListTicket(response.dataAPI);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, []);

  const handleCheckboxChange = (item) => {
    if (item === "Le plus récent") {
      setFiltre("desc");
    } else {
      setFiltre("asc");
    }
    setisStatus(false);
    setIsFiltre(true);
  };

  const handleCheckboxChangeStatus = (item) => { //["non résolu", "en cours de traitement", "résolu","inapproprié"]
    switch (item) {
      case "non résolu":
        setStatus("nonResolu")
        break;
      case "en cours de traitement":
        setStatus("enCours")
        break;
      case "résolu":
        setStatus("resolu")
        break;
      case "inapproprié":
        setStatus("inapproprie")
        break;
    }
    setisStatus(true);
    setIsFiltre(false);
  };

  // Trier avec les filtres
  useEffect(() => {

    getAPI(`http://${adresseip}:${port}/api/ticket/byDate/` + filtre, null, {
      "x-access-token": utilisateur.token,
    })
      .then((response) => {
        console.log("liste des tickets FILTRE", response);
        setListTicketStatus([])
        setListTicketFiltre(response.dataAPI);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, [filtre]);

  // Trier avec les status
  useEffect(() => {
    console.log("ON EST DANS LA FONCTION STATUS", status);

    getAPI(`http://${adresseip}:${port}/api/ticket/status/` + status, null, {
      "x-access-token": utilisateur.token,
    })
      .then((response) => {
        console.log("liste des tickets FILTRE", response);
        setListTicketFiltre([])
        setListTicketStatus(response.dataAPI);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, [status]);

  var rendu;
  if (isFiltre) {
    if (listTicketFiltre && listTicketFiltre.length !== 0) {
      rendu = listTicketFiltre;

    } else {
      rendu = listTicket
    }

  } else if (isStatus) {
    if (listTicketStatus && listTicketStatus.length !== 0) {
      rendu = listTicketStatus;

    } else {
      rendu = listTicket
    }
  } else {
    rendu = listTicket;

  }

  return (
    <>
      <div className="content_admin">
        <div className="container_title_page_admin">
          <h1>Tickets via chat</h1>
        </div>
        <div className="content_inside_admin_pages">

          <div className="wrapper_btndropd">
            <div className="container_dropd1">
              <DropDownBtn
                type='abs'
                text="Filtre ticket"
                items={["Le plus récent", "Le plus ancien"]}
                onCheckboxChange={handleCheckboxChange}
              />
            </div>
            <div className="container_dropd2">
              <DropDownBtn
                type='abs'
                text="Filtre avec les status"
                items={["non résolu", "en cours de traitement", "résolu", "inapproprié"]}
                onCheckboxChange={handleCheckboxChangeStatus}
              />
            </div>
          </div>

          <div className="wrapper_tab_role">
            <table>
              <thead>
                <tr>
                  <th>De</th>
                  <th>Titre</th>
                  <th>Status</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                {rendu.map((tickets) => (
                  <tr key={tickets.id}>
                    <td>{tickets.utilisateur.pseudo}</td>
                    <td>{tickets.titre}</td>
                    <td>{tickets.status.titre}</td>
                    <td>Voir lien</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>

    </>
  );


};

export default Tickets;
