import React, { useState } from 'react';
import { Form, Button, ListGroup } from 'react-bootstrap';

function ParcelsPage({ parcels, setParcels }) {
  const [parcelName, setParcelName] = useState('');
  const [cerealType, setCerealType] = useState('');
  const [surface, setSurface] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newParcel = { parcelName, cerealType, surface };
    setParcels([...parcels, newParcel]);
    setParcelName('');
    setCerealType('');
    setSurface('');
  };

  const handleDelete = (index) => {
    const newParcels = parcels.filter((_, i) => i !== index);
    setParcels(newParcels);
  };

  return (
    <div className="container">
      <h1>Renseigner les parcelles</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formParcelName">
          <Form.Label>Nom de la parcelle :</Form.Label>
          <Form.Control
            type="text"
            value={parcelName}
            onChange={(e) => setParcelName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="formCerealType">
          <Form.Label>Type de céréale :</Form.Label>
          <Form.Control
            as="select"
            value={cerealType}
            onChange={(e) => setCerealType(e.target.value)}
            required
          >
            <option value="">Sélectionnez un type de céréale</option>
            <option value="Blé tendre">Blé tendre</option>
            <option value="Orge d'hiver">Orge d'hiver</option>
            <option value="Triticale">Triticale</option>
            <option value="Avoine">Avoine</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="formSurface">
          <Form.Label>Surface (en hectares) :</Form.Label>
          <Form.Control
            type="number"
            value={surface}
            onChange={(e) => setSurface(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Ajouter
        </Button>
      </Form>

      <h2 className="mt-4">Liste des parcelles</h2>
      <ListGroup>
        {parcels.map((parcel, index) => (
          <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
            {parcel.parcelName} - {parcel.cerealType} ({parcel.surface} ha)
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleDelete(index)}
            >
              Supprimer
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}

export default ParcelsPage;