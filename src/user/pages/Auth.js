import React, { useContext, useState } from 'react';
import Card from '../../shared/components/UIElements/Card';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import Input from '../../shared/components/FormElements/Input';
import './Auth.css';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/utils/validators';
import useForm from '../../shared/hooks/form-hook';
import Button from '../../shared/components/FormElements/Button';
import { AuthContext } from '../../shared/context/auth-context';

export default function Auth() {
  const { login } = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [{ inputs, isValid }, inputHandler, setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false,
      },
      password: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  async function authenticate(event) {
    event.preventDefault();
    if (isLoginMode) {
    } else {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:5000/api/users/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: inputs.name.value,
            email: inputs.email.value,
            password: inputs.password.value,
          }),
        });
        const data = await response.json();
        if (!response.ok) throw data;
        setIsLoading(false);
        login();
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    }
  }

  function switchMode() {
    if (isLoginMode) {
      setFormData({ ...inputs, name: { value: '', isValid: false } }, false);
    } else {
      setFormData(
        { ...inputs, name: undefined },
        inputs.email.isValid && inputs.password.isValid
      );
    }
    setIsLoginMode(prev => !prev);
  }

  function clearError() {
    setError('');
  }

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Card className='authentication'>
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login Required</h2>
        <hr />
        <form onSubmit={authenticate}>
          {!isLoginMode && (
            <Input
              element='input'
              id='name'
              type='text'
              label='Name'
              validators={[VALIDATOR_REQUIRE()]}
              errorText='Please enter a name.'
              onInput={inputHandler}
            />
          )}
          <Input
            element='input'
            id='email'
            type='email'
            label='Email'
            validators={[VALIDATOR_EMAIL()]}
            errorText='Please enter a valid email address.'
            onInput={inputHandler}
          />
          <Input
            element='input'
            id='password'
            type='password'
            label='Password'
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText='Please enter a valid password, at least 5 characters.'
            onInput={inputHandler}
          />
          <Button type='submit' disabled={!isValid}>
            {isLoginMode ? 'LOGIN' : 'SIGNUP'}
          </Button>
          <Button type='button' inverse onClick={switchMode}>
            Switch to {isLoginMode ? ' SIGNUP' : ' LOGIN'}
          </Button>
        </form>
      </Card>
    </>
  );
}
