import React, { useState } from 'react';
import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import './PlaceItem.css';
import Modal from '../../shared/components/UIElements/Modal';
import Map from '../../shared/components/UIElements/Map';

export default function PlaceItem({
  id,
  image,
  title,
  address,
  description,
  coordinates,
}) {
  const [modal, setModal] = useState('none');
  const openMapModal = () => setModal('map');
  const openDeleteModal = () => setModal('delete');
  const closeModal = () => setModal('none');
  const confirmDelete = () => {
    console.log('DELETING...');
    closeModal();
  };

  return (
    <>
      <Modal
        show={modal === 'map'}
        onCancel={closeModal}
        header={address}
        footer={<Button onClick={closeModal}>CLOSE</Button>}
        contentClass='place-item__modal-content'
        footerClass='place-item__modal-actions'>
        <div className='map-container'>
          <Map center={coordinates} zoom={16} />
        </div>
      </Modal>
      <Modal
        show={modal === 'delete'}
        onCancel={closeModal}
        header='Are you sure?'
        footer={
          <>
            <Button onClick={closeModal}>CANCEL</Button>
            <Button onClick={confirmDelete}>DELETE</Button>
          </>
        }
        footerClass='place-item__modal-actions'>
        <p>
          Do you want to proceed and delete this place? Please note that it
          can't be undone thereafter.
        </p>
      </Modal>
      <li className='place-item'>
        <Card className='place-item__content'>
          <div className='place-item__image'>
            <img src={image} alt={title} />
          </div>
          <div className='place-item__info'>
            <h2>{title}</h2>
            <h3>{address}</h3>
            <p>{description}</p>
          </div>
          <div className='place-item__actions'>
            <Button inverse onClick={openMapModal}>
              VIEW ON MAP
            </Button>
            <Button to={`/places/${id}`}>EDIT</Button>
            <Button danger onClick={openDeleteModal}>
              DELETE
            </Button>
          </div>
        </Card>
      </li>
    </>
  );
}
