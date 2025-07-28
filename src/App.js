import React, { useState, useRef, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const photoLabels = [
  "Compteur (km + carburant)",
  "Face avant",
  "Face avant droit",
  "Roue avant droite",
  "Côté latéral avant droit",
  "Habitacle avant",
  "Côté latéral arrière droit",
  "Habitacle arrière",
  "Face arrière droite",
  "Roue arrière droite",
  "Face arrière",
  "Coffre",
  "Face arrière gauche",
  "Roue arrière gauche",
  "Côté latéral arrière gauche",
  "Côté latéral avant gauche",
  "Roue avant gauche",
  "Face avant gauche"
];


function App() {
  const [formData, setFormData] = useState({
    convoyeurNom: '',
    convoyeurPrenom: '',
    departSociete: '',
    departNomPrenom: '',
    departLieu: '',
    arriveeSociete: '',
    arriveeNomPrenom: '',
    arriveeLieu: '',
    vehiculeModele: '',
    vehiculePlaque: '',
    vehiculeVIN: '',
    kilometrageDepart: '',
    carburant: '',
    etatExterieur: '',
    etatInterieur: '',
    observations: '',
    kilometrageArrivee: '',
    carburantArrivee: '',
    etatExterieurArrivee: '',
    etatInterieurArrivee: '',
    observationsArrivee: ''
  });


  const [valideEtape1, setValideEtape1] = useState(false);
  const [photosDepart, setPhotosDepart] = useState(Array(18).fill(null));
  const [photosArrivee, setPhotosArrivee] = useState(Array(18).fill(null));
const [, setPhotosLibresDepart] = useState([]);
const [, setPhotosLibresArrivee] = useState([]);
const [etape2Validee, setEtape2Validee] = useState(false);
  const [etape3FormValidee, setEtape3FormValidee] = useState(false);
  const [etape4Validee, setEtape4Validee] = useState(false);
  const signatureConvoyeur = useRef();
  const signatureClient = useRef();
  const [etape5Validee, setEtape5Validee] = useState(false);
  const pdfRef = useRef();
const [signaturesLoaded, setSignaturesLoaded] = useState(false);



  // Chargement des données sauvegardées au démarrage
  useEffect(() => {
    const savedFormData = localStorage.getItem("formData");
    const savedPhotosDepart = localStorage.getItem("photosDepart");
    const savedValideEtape1 = localStorage.getItem("valideEtape1");

    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }

    if (savedPhotosDepart) {
      setPhotosDepart(JSON.parse(savedPhotosDepart));
      setEtape2Validee(true);
    }

    if (savedValideEtape1 === "true") {
      setValideEtape1(true);
    }

    const savedFormDataArrivee = localStorage.getItem("formDataArrivee");
    if (savedFormDataArrivee) {
      setFormData(JSON.parse(savedFormDataArrivee));
      setEtape3FormValidee(true);
    }

    const savedPhotosArrivee = localStorage.getItem("photosArrivee");
    if (savedPhotosArrivee) {
      setPhotosArrivee(JSON.parse(savedPhotosArrivee));
      setEtape4Validee(true);
    }
  }, []);



  useEffect(() => {
    if (valideEtape1) {
      localStorage.setItem("formData", JSON.stringify(formData));
    }
  }, [valideEtape1, formData]);

  useEffect(() => {
    if (etape2Validee) {
      localStorage.setItem("photosDepart", JSON.stringify(photosDepart));
    }
  }, [etape2Validee, photosDepart]);

  useEffect(() => {
    localStorage.setItem("valideEtape1", JSON.stringify(valideEtape1));
  }, [valideEtape1]);

  useEffect(() => {
    if (etape3FormValidee) {
      localStorage.setItem("formDataArrivee", JSON.stringify(formData));
    }
  }, [etape3FormValidee, formData]);

  useEffect(() => {
    if (etape4Validee) {
      localStorage.setItem("photosArrivee", JSON.stringify(photosArrivee));
    }
  }, [etape4Validee, photosArrivee]);

  useEffect(() => {
    if (etape5Validee) {
      const sigConvoyeur = signatureConvoyeur.current?.toDataURL();
      const sigClient = signatureClient.current?.toDataURL();

      localStorage.setItem("signatureConvoyeur", sigConvoyeur);
      localStorage.setItem("signatureClient", sigClient);
    }
  }, [etape5Validee]);

  useEffect(() => {
  const savedConvoyeur = localStorage.getItem("signatureConvoyeur");
  const savedClient = localStorage.getItem("signatureClient");

  if (savedConvoyeur && signatureConvoyeur.current) {
    signatureConvoyeur.current.fromDataURL(savedConvoyeur);
  }

  if (savedClient && signatureClient.current) {
    signatureClient.current.fromDataURL(savedClient);
  }
}, []);

useEffect(() => {
  if (etape5Validee) {
    setTimeout(() => {
      setSignaturesLoaded(true);
    }, 50);
  }
}, [etape5Validee]);




  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitEtape1 = (e) => {
    e.preventDefault();
    setValideEtape1(true);
  };

  const handlePhotoChange = (photosArray, setPhotosArray) => (index, file) => {
    const updated = [...photosArray];
    updated[index] = file;
    setPhotosArray(updated);
  };

  const handlePhotosLibresChange = (setPhotosLibres) => (e) => {
    const files = Array.from(e.target.files);
    setPhotosLibres((prev) => [...prev, ...files]);
  };

  const handleSubmitEtape2 = () => {
    if (photosDepart.every(p => p !== null)) {
      setEtape2Validee(true);
      alert("✅ Étape 2 validée !");
    } else {
      alert("❌ Merci d’ajouter les 18 photos de départ avant de valider.");
    }
  };

  const handleReset = () => {
    localStorage.removeItem("formData");
    localStorage.removeItem("photosDepart");
    setFormData({
      convoyeurNom: '',
      convoyeurPrenom: '',
      departSociete: '',
      departNomPrenom: '',
      departLieu: '',
      arriveeSociete: '',
      arriveeNomPrenom: '',
      arriveeLieu: '',
      vehiculeModele: '',
      vehiculePlaque: '',
      vehiculeVIN: '',
      kilometrageDepart: '',
      carburant: '',
      etatExterieur: '',
      etatInterieur: '',
      observations: '',
      kilometrageArrivee: '',
      carburantArrivee: '',
      etatExterieurArrivee: '',
      etatInterieurArrivee: '',
      observationsArrivee: ''
    });
    setPhotosDepart(Array(18).fill(null));
    setValideEtape1(false);
    setEtape2Validee(false);
    alert("✅ Données réinitialisées !");
  };

  const handleSubmitEtape3Form = () => {
    if (
      formData.kilometrageArrivee &&
      formData.carburantArrivee &&
      formData.etatExterieurArrivee &&
      formData.etatInterieurArrivee
    ) {
      setEtape3FormValidee(true);
      alert("✅ Étape 3 validée !");
    } else {
      alert("❌ Merci de compléter toutes les informations d’arrivée avant de valider.");
    }
  };

  const handleSubmitEtape4 = () => {
    if (photosArrivee.every(p => p !== null)) {
      setEtape4Validee(true);
      alert("✅ Étape 4 validée !");
    } else {
      alert("❌ Merci d’ajouter les 18 photos d’arrivée avant de valider.");
    }
  };

  return (
      <>
    <style>{`
      .no-print {
        display: block;
      }

      @media print {
        .no-print {
          display: none !important;
        }
      }
    `}</style>
  <div style={{ padding: 20, fontFamily: 'Arial, sans-serif', maxWidth: 900, margin: '0 auto' }}>
      <h1>Création de PV - Étape 1</h1>
      <form onSubmit={handleSubmitEtape1}>
        <h2>1. Convoyeur</h2>
        <input type="text" name="convoyeurNom" placeholder="Nom" value={formData.convoyeurNom} onChange={handleChange} required /><br /><br />
        <input type="text" name="convoyeurPrenom" placeholder="Prénom" value={formData.convoyeurPrenom} onChange={handleChange} required /><br /><br />

        <h2>2. Lieu de départ</h2>
        <input type="text" name="departSociete" placeholder="Société (facultatif)" value={formData.departSociete} onChange={handleChange} /><br /><br />
        <input type="text" name="departNomPrenom" placeholder="Nom et prénom" value={formData.departNomPrenom} onChange={handleChange} required /><br /><br />
        <input type="text" name="departLieu" placeholder="Lieu" value={formData.departLieu} onChange={handleChange} required /><br /><br />

        <h2>3. Lieu d’arrivée</h2>
        <input type="text" name="arriveeSociete" placeholder="Société (facultatif)" value={formData.arriveeSociete} onChange={handleChange} /><br /><br />
        <input type="text" name="arriveeNomPrenom" placeholder="Nom et prénom" value={formData.arriveeNomPrenom} onChange={handleChange} required /><br /><br />
        <input type="text" name="arriveeLieu" placeholder="Lieu" value={formData.arriveeLieu} onChange={handleChange} required /><br /><br />

        <h2>4. Véhicule</h2>
        <input type="text" name="vehiculeModele" placeholder="Modèle" value={formData.vehiculeModele} onChange={handleChange} required /><br /><br />
        <input type="text" name="vehiculePlaque" placeholder="Plaque d'immatriculation" value={formData.vehiculePlaque} onChange={handleChange} required /><br /><br />
        <input type="text" name="vehiculeVIN" placeholder="Numéro de série (VIN)" value={formData.vehiculeVIN} onChange={handleChange} required />
        <div style={{ fontSize: '0.9em', color: 'gray', marginBottom: 15 }}>(Indiquer les 7 derniers chiffres)</div>

        <input type="number" name="kilometrageDepart" placeholder="Kilométrage départ" value={formData.kilometrageDepart} onChange={handleChange} required /><br /><br />

        <label>Carburant :</label><br />
        <select name="carburant" value={formData.carburant} onChange={handleChange} required>
          <option value="">Sélectionner</option>
          <option value="1/4">1/4</option>
          <option value="1.5/4">1.5/4</option>
          <option value="2/4">2/4</option>
          <option value="2.5/4">2.5/4</option>
          <option value="3/4">3/4</option>
          <option value="3.5/4">3.5/4</option>
          <option value="4/4">4/4</option>
        </select><br /><br />

        <label>État extérieur :</label><br />
        <select name="etatExterieur" value={formData.etatExterieur} onChange={handleChange} required>
          <option value="">Sélectionner</option>
          <option value="Très propre">Très propre</option>
          <option value="Propre">Propre</option>
          <option value="Sale">Sale</option>
          <option value="Très sale">Très sale</option>
        </select><br /><br />

        <label>État intérieur :</label><br />
        <select name="etatInterieur" value={formData.etatInterieur} onChange={handleChange} required>
          <option value="">Sélectionner</option>
          <option value="Très propre">Très propre</option>
          <option value="Propre">Propre</option>
          <option value="Sale">Sale</option>
          <option value="Très sale">Très sale</option>
        </select><br /><br />

        <h2>5. Observations</h2>
        <textarea
          name="observations"
          placeholder="Remarques ou informations complémentaires"
          value={formData.observations}
          onChange={handleChange}
          rows={4}
          style={{ width: '100%' }}
        /><br /><br />

        <button type="submit">Valider l'étape 1</button>
      </form>

      {valideEtape1 && (
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Êtes-vous sûr de vouloir réinitialiser toutes les données ?")) {
              handleReset();
            }
          }}
          style={{
            marginTop: '10px',
            marginBottom: '30px',
            backgroundColor: '#f44336',
            color: 'white',
            padding: '10px 15px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          🔄 Réinitialiser les données
        </button>
      )}



      {valideEtape1 && (
        <>
          <hr style={{ margin: '40px 0' }} />
          <h1>Étape 2 - Photos de départ</h1>
          {photoLabels.map((label, index) => (
            <div key={index} style={{ marginBottom: 15 }}>
              <label><strong>{index + 1}. {label}</strong></label><br />
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => handlePhotoChange(photosDepart, setPhotosDepart)(index, e.target.files[0])}
                required
              />
              {photosDepart[index] && (
                <div style={{ fontSize: '0.8em', color: 'green' }}>✅ Photo ajoutée</div>
              )}
            </div>
          ))}

          <h2>Photos libres (facultatives)</h2>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            multiple
            onChange={handlePhotosLibresChange(setPhotosLibresDepart)}
          /><br /><br />

          <button onClick={handleSubmitEtape2}>Valider l'étape 2</button>
        </>
      )}



      {etape2Validee && (
        <>
          <hr style={{ margin: '40px 0' }} />
          <h1>Étape 3 - Informations d’arrivée</h1>
          <input type="number" name="kilometrageArrivee" placeholder="Kilométrage arrivée" value={formData.kilometrageArrivee} onChange={handleChange} required /><br /><br />

          <label>Carburant arrivée :</label><br />
          <select name="carburantArrivee" value={formData.carburantArrivee} onChange={handleChange} required>
            <option value="">Sélectionner</option>
            <option value="1/4">1/4</option>
            <option value="1.5/4">1.5/4</option>
            <option value="2/4">2/4</option>
            <option value="2.5/4">2.5/4</option>
            <option value="3/4">3/4</option>
            <option value="3.5/4">3.5/4</option>
            <option value="4/4">4/4</option>
          </select><br /><br />

          <label>État extérieur arrivée :</label><br />
          <select name="etatExterieurArrivee" value={formData.etatExterieurArrivee} onChange={handleChange} required>
            <option value="">Sélectionner</option>
            <option value="Très propre">Très propre</option>
            <option value="Propre">Propre</option>
            <option value="Sale">Sale</option>
            <option value="Très sale">Très sale</option>
          </select><br /><br />

          <label>État intérieur arrivée :</label><br />
          <select name="etatInterieurArrivee" value={formData.etatInterieurArrivee} onChange={handleChange} required>
            <option value="">Sélectionner</option>
            <option value="Très propre">Très propre</option>
            <option value="Propre">Propre</option>
            <option value="Sale">Sale</option>
            <option value="Très sale">Très sale</option>
          </select><br /><br />

          <label>Observations arrivée :</label><br />
          <textarea name="observationsArrivee" placeholder="Remarques à l’arrivée" value={formData.observationsArrivee} onChange={handleChange} rows={4} style={{ width: '100%' }} /><br /><br />

          <button onClick={handleSubmitEtape3Form}>Valider les informations d’arrivée</button>
        </>
      )}

      {etape3FormValidee && (
        <>
          <hr style={{ margin: '40px 0' }} />
          <h1>Étape 4 - Photos d’arrivée</h1>
          {photoLabels.map((label, index) => (
            <div key={index} style={{ marginBottom: 15 }}>
              <label><strong>{index + 1}. {label}</strong></label><br />
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => handlePhotoChange(photosArrivee, setPhotosArrivee)(index, e.target.files[0])}
                required
              />
              {photosArrivee[index] && (
                <div style={{ fontSize: '0.8em', color: 'green' }}>✅ Photo ajoutée</div>
              )}
            </div>
          ))}

          <h2>Photos libres (facultatives)</h2>
          <input type="file" accept="image/*" capture="environment" multiple onChange={handlePhotosLibresChange(setPhotosLibresArrivee)} /><br /><br />

          <button onClick={handleSubmitEtape4}>Valider l'étape 4</button>
        </>
      )}

      {etape4Validee && (
        <p style={{ color: 'green', fontWeight: 'bold', marginTop: 20 }}>
          ✅ Toutes les étapes ont été validées.
        </p>
      )}
      {etape4Validee && (
        <>
          <hr style={{ margin: '40px 0' }} />
          <h1>Étape 5 - Signature</h1>
          <p>Veuillez faire signer le client et le convoyeur ci-dessous :</p>

          <div style={{ marginBottom: 30 }}>
            <h3>Signature du convoyeur</h3>
            <SignatureCanvas
              ref={signatureConvoyeur}
              penColor="black"
              canvasProps={{
                width: 300,
                height: 150,
                className: 'sigCanvas',
                style: { border: '1px solid #000' }
              }}
            />
            <br />
            <button onClick={() => signatureConvoyeur.current.clear()}>Effacer</button>
          </div>

          <div style={{ marginBottom: 30 }}>
            <h3>Signature du client</h3>
            <SignatureCanvas
              ref={signatureClient}
              penColor="black"
              canvasProps={{
                width: 300,
                height: 150,
                className: 'sigCanvas',
                style: { border: '1px solid #000' }
              }}
            />
            <br />
            <button onClick={() => signatureClient.current.clear()}>Effacer</button>
          </div>

          <button
  onClick={() => {
    if (signatureConvoyeur.current.isEmpty() || signatureClient.current.isEmpty()) {
      alert("❌ Merci de faire les deux signatures.");
    } else {
      setEtape5Validee(true);
    }
  }}
>
  ✅ Valider l'étape des signatures
</button>


        </>
      )}

      {etape5Validee && signaturesLoaded && (
<div ref={pdfRef} id="pdf-content" style={{ padding: 20, backgroundColor: "white", color: "black" }}>

          <h2>Récapitulatif du PV de convoyage</h2>

          <h3>1. Convoyeur</h3>
          <p>Nom : {formData.convoyeurNom}</p>
          <p>Prénom : {formData.convoyeurPrenom}</p>

          <h3>2. Départ</h3>
          <p>Société : {formData.departSociete}</p>
          <p>Nom et prénom : {formData.departNomPrenom}</p>
          <p>Lieu : {formData.departLieu}</p>

          <h3>3. Arrivée</h3>
          <p>Société : {formData.arriveeSociete}</p>
          <p>Nom et prénom : {formData.arriveeNomPrenom}</p>
          <p>Lieu : {formData.arriveeLieu}</p>

          <h3>4. Véhicule</h3>
          <p>Modèle : {formData.vehiculeModele}</p>
          <p>Plaque : {formData.vehiculePlaque}</p>
          <p>VIN : {formData.vehiculeVIN}</p>

          <h3>5. État au départ</h3>
          <p>Kilométrage : {formData.kilometrageDepart}</p>
          <p>Carburant : {formData.carburant}</p>
          <p>Extérieur : {formData.etatExterieur}</p>
          <p>Intérieur : {formData.etatInterieur}</p>
          <p>Observations : {formData.observations}</p>

          <h3>6. État à l’arrivée</h3>
          <p>Kilométrage : {formData.kilometrageArrivee}</p>
          <p>Carburant : {formData.carburantArrivee}</p>
          <p>Extérieur : {formData.etatExterieurArrivee}</p>
          <p>Intérieur : {formData.etatInterieurArrivee}</p>
          <p>Observations : {formData.observationsArrivee}</p>

      <h3>7. Signatures</h3>
<div style={{ display: "flex", gap: 50 }}>
  <div>
    <p>Convoyeur :</p>
    <img
      id="signatureConvoyeurImg"
      src={localStorage.getItem("signatureConvoyeur") || ""}
      alt="Signature Convoyeur"
      style={{ width: 300, border: "1px solid black" }}
    />
  </div>
  <div>
    <p>Client :</p>
    <img
      id="signatureClientImg"
      src={localStorage.getItem("signatureClient") || ""}
      alt="Signature Client"
      style={{ width: 300, border: "1px solid black" }}
    />
  </div>
</div>


      <div style={{ marginTop: 30 }}>
  <button
  className="no-print"
  onClick={async () => {
    const button = document.querySelector('.no-print');
    if (button) button.style.display = 'none';

    const element = pdfRef.current;
    if (!element) return;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);
    const imgWidth = pageWidth;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
    const finalHeight = imgHeight > pageHeight ? pageHeight : imgHeight;

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, finalHeight);
    pdf.save('pv_convoyage.pdf');

    if (button) button.style.display = 'inline-block';
  }}
  style={{
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  }}
>
  📄 Télécharger le PDF
</button>

</div>
</div>

  )
  }

</div>

</>
  );
  }

export default App;
