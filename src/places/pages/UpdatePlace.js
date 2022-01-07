import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/FormElements/Input';
import useForm from '../../shared/hooks/form-hook';
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/utils/validators';
import useHttpClient from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { AuthContext } from '../../shared/context/auth-context';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

export default function UpdatePlace() {
  const { placeId } = useParams();
  const history = useHistory();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const { userId, token } = useContext(AuthContext);
  const [place, setPlace] = useState();
  const [{ inputs, isValid }, inputHandler, setFormData] = useForm(
    {
      title: {
        value: '',
        isValid: false,
      },
      description: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    (async () => {
      try {
        const data = await sendRequest(
          `http://localhost:5000/api/places/${placeId}`
        );
        setPlace(data.place);
        setFormData(
          {
            title: {
              value: data.place.title,
              isValid: true,
            },
            description: {
              value: data.place.description,
              isValid: true,
            },
          },
          true
        );
      } catch (error) {}
    })();
  }, [placeId, sendRequest, setFormData]);

  async function updatePlace(event) {
    event.preventDefault();
    try {
      await sendRequest(`http://localhost:5000/api/places/${placeId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: inputs.title.value,
          description: inputs.description.value,
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      history.push(`/${userId}/places`);
    } catch (error) {}
  }

  if (isLoading) {
    return (
      <div className='center'>
        <LoadingSpinner />
      </div>
    );
  }

  if (!place) {
    return (
      <div className='center'>
        <Card>
          <h2>This place does not exist!</h2>
        </Card>
      </div>
    );
  }

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && place && (
        <form className='place-form' onSubmit={updatePlace}>
          <Input
            id='title'
            element='input'
            type='text'
            label='Title'
            validators={[VALIDATOR_REQUIRE()]}
            errorText='Please enter a valid title.'
            onInput={inputHandler}
            defaultValue={place.title}
            defaultValid={true}
          />
          <Input
            id='description'
            element='textarea'
            label='Description'
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText='Please enter a valid description (at least 5 characters).'
            onInput={inputHandler}
            defaultValue={place.description}
            defaultValid={true}
          />
          <Button type='submit' disabled={!isValid}>
            ADD PLACE
          </Button>
        </form>
      )}
    </>
  );
}
