import React, { useCallback, useReducer } from 'react';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/utils/validators';
import './NewPlace.css';

export default function NewPlace() {
  const [{ inputs, isValid }, dispatch] = useReducer(formReducer, {
    inputs: {
      title: {
        value: '',
        isValid: false,
      },
      description: {
        value: '',
        isValid: false,
      },
      address: {
        value: '',
        isValid: false,
      },
    },
    isValid: false,
  });
  const inputHandler = useCallback((id, value, isValid) => {
    dispatch({ type: 'INPUT_CHANGE', inputId: id, value, isValid });
  }, []);
  function addPlace(event) {
    event.preventDefault();
    console.log(inputs);
  }

  return (
    <form className='place-form' onSubmit={addPlace}>
      <Input
        id='title'
        element='input'
        type='text'
        label='Title'
        validators={[VALIDATOR_REQUIRE()]}
        errorText='Please enter a valid title.'
        onInput={inputHandler}
      />
      <Input
        id='description'
        element='textarea'
        label='Description'
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText='Please enter a valid description (at least 5 characters).'
        onInput={inputHandler}
      />
      <Input
        id='address'
        element='input'
        type='text'
        label='Address'
        validators={[VALIDATOR_REQUIRE()]}
        errorText='Please enter a valid address.'
        onInput={inputHandler}
      />
      <Button type='submit' disabled={!isValid}>
        ADD PLACE
      </Button>
    </form>
  );
}

function formReducer(state, action) {
  switch (action.type) {
    case 'INPUT_CHANGE':
      let formIsValid = true;
      for (const inputId in state.inputs) {
        if (inputId === action.inputId) {
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid = formIsValid && state.inputs[inputId].isValid;
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: {
            value: action.value,
            isValid: action.isValid,
          },
        },
        isValid: formIsValid,
      };

    default:
      return state;
  }
}
