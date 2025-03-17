import React, { useState, useEffect } from 'react';
import { Form, ListGroup, Button } from 'react-bootstrap';
import jsPDF from 'jspdf';

function ProgramPage({ parcels, setParcels }) {
  const [stocks, setStocks] = useState({});
  const [program, setProgram] = useState({});

  // Calculer le programme complet
  useEffect(() => {
    const groupedProgram = parcels.reduce((acc, parcel) => {
      if (parcel.fungicides) {
        parcel.fungicides.forEach((fungicide) => {
          if (!acc[fungicide.name]) {
            acc[fungicide.name] = {
              parcels: [],
              totalQuantity: 0,
            };
          }
          acc[fungicide.name].parcels.push(parcel);
          acc[fungicide.name].totalQuantity +=
            parseFloat(fungicide.dose) * parseFloat(parcel.surface);
        });
      }
      return acc;
    }, {});

    setProgram(groupedProgram);
  }, [parcels]);

  // Calculer le besoin réel
  const calculateNeed = (fungicideName, totalQuantity) => {
    const stock = stocks[fungicideName] || 0;
    return Math.max(0, totalQuantity - stock);
  };

  // Fonction pour générer le PDF
  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Programme fongicides céréales', 14, 22);

    doc.setFontSize(14);
    doc.text('Liste des parcelles regroupées par traitement', 14, 30);

    Object.keys(program).forEach((fungicideName, index) => {
      const startY = 40 + index * 10;
      doc.text(`${fungicideName}`, 14, startY);
      program[fungicideName].parcels.forEach((parcel, parcelIndex) => {
        const parcelY = startY + (parcelIndex + 1) * 10;
        doc.text(`- ${parcel.parcelName} - ${parcel.cerealType} (${parcel.surface} ha) - Dose : ${parcel.fungicides.find(f => f.name === fungicideName).dose} L/ha`, 14, parcelY);
      });
    });

    doc.addPage();
    doc.setFontSize(14);
    doc.text('Besoins réels par produit', 14, 20);

    Object.keys(program).forEach((fungicideName, index) => {
      const startY = 30 + index * 10;
      doc.text(`${fungicideName} : ${calculateNeed(fungicideName, program[fungicideName].totalQuantity).toFixed(2)} L`, 14, startY);
    });

    doc.save('recapitulatif.pdf');
  };

  return (
    <div className="container mt-4">
      <h1>Programme fongicides céréales</h1>

      <h2>Stocks disponibles</h2>
      <div>
        {Object.keys(program).map(fungicideName => (
          <Form key={fungicideName} className="mb-3">
            <Form.Group controlId={`stock${fungicideName}`}>
              <Form.Label>{fungicideName} :</Form.Label>
              <Form.Control
                type="number"
                value={stocks[fungicideName] || 0}
                onChange={(e) => setStocks({ ...stocks, [fungicideName]: parseFloat(e.target.value) })}
                min="0"
              />
            </Form.Group>
          </Form>
        ))}
      </div>

      <h2>Liste des parcelles regroupées par traitement</h2>
      {Object.keys(program).map(fungicideName => (
        <div key={fungicideName} className="mb-4">
          <h3>{fungicideName}</h3>
          <ListGroup>
            {program[fungicideName].parcels.map(parcel => (
              <ListGroup.Item key={parcel.parcelName}>
                {parcel.parcelName} - {parcel.cerealType} ({parcel.surface} ha) - Dose :{' '}
                {parcel.fungicides.find(f => f.name === fungicideName).dose} L/ha
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      ))}

      <h2>Besoins réels par produit</h2>
      <div>
        {Object.keys(program).map(fungicideName => (
          <div key={fungicideName} className="mb-3">
            <span>{fungicideName} : </span>
            <span>{calculateNeed(fungicideName, program[fungicideName].totalQuantity).toFixed(2)} L</span>
          </div>
        ))}
      </div>

      <Button variant="primary" onClick={generatePDF} className="mt-4">
        Télécharger le récapitulatif
      </Button>
    </div>
  );
}

export default ProgramPage;