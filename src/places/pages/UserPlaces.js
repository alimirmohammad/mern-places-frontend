import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import useHttpClient from '../../shared/hooks/http-hook';
import PlaceList from '../components/PlaceList';

export default function UserPlaces() {
  const { userId } = useParams();
  const [places, setPlaces] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    (async () => {
      try {
        const data = await sendRequest(
          `${process.env.REACT_APP_BACKEND_DOMAIN}/api/places/user/${userId}`
        );
        setPlaces(data.places);
      } catch (error) {}
    })();
  }, [sendRequest, userId]);

  function onDeletePlace(placeId) {
    setPlaces(prev => prev.filter(place => place.id !== placeId));
  }

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className='center'>
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && <PlaceList items={places} onDeletePlace={onDeletePlace} />}
    </>
  );
}
