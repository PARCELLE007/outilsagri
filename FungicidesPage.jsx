import React, { useState } from 'react';
import { Form, Button, ListGroup } from 'react-bootstrap';

function FungicidesPage({ parcels, setParcels }) {
  const [selectedFungicides, setSelectedFungicides] = useState([{ name: '', dose: '', treatmentType: '', parcel: '' }]);

  // Liste des fongicides prédéfinis avec les doses par défaut
  const fungicides = [
    { id: 1, name: 'Elatus Era', defaultDose: 1 },
    { id: 2, name: 'Tenstar', defaultDose: 1 },
    { id: 3, name: 'Jewel', defaultDose: 0.8 },
    { id: 4, name: 'Pack Silvron + Etiage', defaultDose: 0 },
    { id: 5, name: 'Pack RevystarXL + Oxar', defaultDose: 0 },
    { id: 6, name: 'Silvron', defaultDose: 0.5 },
    { id: 7, name: 'Etiage', defaultDose: 0.625 },
    { id: 8, name: 'RevystarXL', defaultDose: 0.45 },
    { id: 9, name: 'Oxar', defaultDose: 0.45 }
  ];

  // Gérer la sélection d'un fongicide
  const handleFungicideChange = (index, field, value) => {
    const newSelectedFungicides = [...selectedFungicides];
    newSelectedFungicides[index][field] = value;
    
    // Si le champ sélectionné est le nom du fongicide, mettre à jour la dose par défaut et gérer les packs
    if (field === 'name') {
      const selectedFungicide = fungicides.find(f => f.name === value);
      if (selectedFungicide) {
        newSelectedFungicides[index]['dose'] = selectedFungicide.defaultDose;
        
        // Gérer les packs
        if (value === 'Pack Silvron + Etiage') {
          newSelectedFungicides.splice(index, 1, 
            { name: 'Silvron', dose: 0.5, treatmentType: newSelectedFungicides[index].treatmentType, parcel: newSelectedFungicides[index].parcel },
            { name: 'Etiage', dose: 0.625, treatmentType: newSelectedFungicides[index].treatmentType, parcel: newSelectedFungicides[index].parcel }
          );
        } else if (value === 'Pack RevystarXL + Oxar') {
          newSelectedFungicides.splice(index, 1, 
            { name: 'RevystarXL', dose: 0.45, treatmentType: newSelectedFungicides[index].treatmentType, parcel: newSelectedFungicides[index].parcel },
            { name: 'Oxar', dose: 0.45, treatmentType: newSelectedFungicides[index].treatmentType, parcel: newSelectedFungicides[index].parcel }
          );
        }
      }
    }
    
    setSelectedFungicides(newSelectedFungicides);
  };

  // Ajouter un fongicide à la liste
  const addFungicide = () => {
    setSelectedFungicides([...selectedFungicides, { name: '', dose: '', treatmentType: '', parcel: '' }]);
  };

  // Annuler l'ajout d'un fongicide
  const removeFungicide = (index) => {
    const newSelectedFungicides = selectedFungicides.filter((_, i) => i !== index);
    setSelectedFungicides(newSelectedFungicides);
  };

  // Attribuer les fongicides aux parcelles sélectionnées
  const assignFungicides = () => {
    const updatedParcels = parcels.map((parcel) => {
      const parcelFungicides = selectedFungicides
        .filter((fungicide) => fungicide.parcel === parcel.parcelName)
        .map((fungicide) => ({
          name: fungicide.name,
          dose: fungicide.dose,
          treatmentType: fungicide.treatmentType
        }));

      if (parcelFungicides.length > 0) {
        return {
          ...parcel,
          fungicides: [
            ...(parcel.fungicides || []),
            ...parcelFungicides
          ]
        };
      }
      return parcel;
    });

    setParcels(updatedParcels);
    setSelectedFungicides([{ name: '', dose: '', treatmentType: '', parcel: '' }]);
  };

  // Supprimer un fongicide attribué d'une parcelle
  const removeAssignedFungicide = (parcelName, fungicideName) => {
    const updatedParcels = parcels.map((parcel) => {
      if (parcel.parcelName === parcelName) {
        const updatedFungicides = parcel.fungicides.filter(fungicide => fungicide.name !== fungicideName);
        return {
          ...parcel,
          fungicides: updatedFungicides
        };
      }
      return parcel;
    });

    setParcels(updatedParcels);
  };

  return (
    <div className="container mt-4">
      <h1>Liste des fongicides</h1>

      {selectedFungicides.map((fungicide, index) => (
        <Form key={index} className="mb-3">
          <Form.Group controlId={`fungicideSelect${index}`}>
            <Form.Label>Sélectionnez un fongicide :</Form.Label>
            <Form.Control
              as="select"
              value={fungicide.name}
              onChange={(e) => handleFungicideChange(index, 'name', e.target.value)}
            >
              <option value="">Choisissez un fongicide</option>
              {fungicides.map((f) => (
                <option key={f.id} value={f.name}>
                  {f.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId={`fungicideDose${index}`}>
            <Form.Label>Dose (L/ha) :</Form.Label>
            <Form.Control
              type="number"
              value={fungicide.dose}
              onChange={(e) => handleFungicideChange(index, 'dose', e.target.value)}
              min="0"
            />
          </Form.Group>
          <Form.Group controlId={`fungicideType${index}`}>
            <Form.Label>Type de traitement :</Form.Label>
            <Form.Control
              as="select"
              value={fungicide.treatmentType}
              onChange={(e) => handleFungicideChange(index, 'treatmentType', e.target.value)}
            >
              <option value="">Sélectionnez un type</option>
              <option value="T1">T1</option>
              <option value="T2">T2</option>
              <option value="T3">T3</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId={`fungicideParcel${index}`}>
            <Form.Label>Parcelle :</Form.Label>
            <Form.Control
              as="select"
              value={fungicide.parcel}
              onChange={(e) => handleFungicideChange(index, 'parcel', e.target.value)}
            >
              <option value="">Choisissez une parcelle</option>
              {parcels.map((parcel) => (
                <option key={parcel.parcelName} value={parcel.parcelName}>
                  {parcel.parcelName}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Button variant="danger" onClick={() => removeFungicide(index)} className="mt-2">
            Annuler
          </Button>
        </Form>
      ))}

      <Button variant="secondary" onClick={addFungicide}>
        Ajouter un autre fongicide
      </Button>

      <Button variant="primary" className="ml-2" onClick={assignFungicides}>
        Attribuer les fongicides
      </Button>

      {parcels.map((parcel, parcelIndex) => (
        parcel.fungicides && parcel.fungicides.length > 0 && (
          <div key={parcelIndex} className="mt-4">
            <h2>Parcelle : {parcel.parcelName}</h2>
            <h3>Fongicides assignés :</h3>
            <ListGroup>
              {parcel.fungicides.map((fungicide, index) => (
                <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                  {fungicide.name} - Dose : {fungicide.dose} L/ha - Type : {fungicide.treatmentType}
                  <Button variant="danger" size="sm" onClick={() => removeAssignedFungicide(parcel.parcelName, fungicide.name)}>
                    Supprimer
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        )
      ))}
    </div>
  );
}

export default FungicidesPage;