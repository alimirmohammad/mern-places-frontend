import React, { useContext, useState } from 'react';
import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import './PlaceItem.css';
import Modal from '../../shared/components/UIElements/Modal';
import Map from '../../shared/components/UIElements/Map';
import { AuthContext } from '../../shared/context/auth-context';
import useHttpClient from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

export default function PlaceItem({
  id,
  image,
  title,
  address,
  description,
  coordinates,
  creatorId,
  onDelete,
}) {
  const { isLoggedIn, userId, token } = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [modal, setModal] = useState('none');
  const openMapModal = () => setModal('map');
  const openDeleteModal = () => setModal('delete');
  const closeModal = () => setModal('none');
  const confirmDelete = async () => {
    closeModal();
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_DOMAIN}/api/places/${id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onDelete(id);
    } catch (error) {}
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
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
          {isLoading && <LoadingSpinner asOverlay />}
          <div className='place-item__image'>
            <img
              src={`${process.env.REACT_APP_BACKEND_DOMAIN}/${image}`}
              alt={title}
            />
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
            {isLoggedIn && userId === creatorId && (
              <>
                <Button to={`/places/${id}`}>EDIT</Button>
                <Button danger onClick={openDeleteModal}>
                  DELETE
                </Button>
              </>
            )}
          </div>
        </Card>
      </li>
    </>
  );
}
