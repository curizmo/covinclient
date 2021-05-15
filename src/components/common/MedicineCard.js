import React from 'react';
import { Button, Table } from 'reactstrap';
import PropTypes from 'prop-types';
import { Plus } from 'react-feather';

const MedicineCard = ({ medicines, addMedicineToNotes }) => {
  return (
    <>
      <div className="d-flex justify-content-between w-50 font-weight-bold my-2">
        <div>Medicines</div>
        <div></div>
      </div>
      <div className="d-flex justify-content-between w-100 mb-2">
        <Table hover responsive className="table-container mt-3">
          <thead className="table-header">
            <tr>
              <th>Medication</th>
              <th>Dose</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((item) => {
              return (
                <tr key={item.medDescr}>
                  <td>{item.medDescr}</td>
                  <td>{item.stdDosesDescr}</td>
                  <td>
                    <Button
                      className="btn-sm"
                      onClick={() => addMedicineToNotes(item)}>
                      <Plus />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </>
  );
};

MedicineCard.propTypes = {
  addMedicineToNotes: PropTypes.func,
  medicines: PropTypes.array,
};

export default MedicineCard;
