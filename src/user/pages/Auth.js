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
import useHttpClient from '../../shared/hooks/http-hook';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';

export default function Auth() {
  const { login } = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
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
      try {
        const data = await sendRequest(
          `${process.env.REACT_APP_BACKEND_DOMAIN}/api/users/login`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: inputs.email.value,
              password: inputs.password.value,
            }),
          }
        );
        login(data.userId, data.token);
      } catch (error) {}
    } else {
      try {
        const formData = new FormData();
        formData.append('name', inputs.name.value);
        formData.append('email', inputs.email.value);
        formData.append('password', inputs.password.value);
        formData.append('image', inputs.image.value);
        const data = await sendRequest(
          `${process.env.REACT_APP_BACKEND_DOMAIN}/api/users/signup`,
          {
            method: 'POST',
            body: formData,
          }
        );
        login(data.userId, data.token);
      } catch (error) {}
    }
  }

  function switchMode() {
    if (isLoginMode) {
      setFormData(
        {
          ...inputs,
          name: { value: '', isValid: false },
          image: { value: null, isValid: false },
        },
        false
      );
    } else {
      setFormData(
        { ...inputs, name: undefined, image: undefined },
        inputs.email.isValid && inputs.password.isValid
      );
    }
    setIsLoginMode(prev => !prev);
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
            <>
              <Input
                element='input'
                id='name'
                type='text'
                label='Name'
                validators={[VALIDATOR_REQUIRE()]}
                errorText='Please enter a name.'
                onInput={inputHandler}
              />
              <ImageUpload
                id='image'
                center
                onInput={inputHandler}
                errorText='Please provide an image.'
              />
            </>
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
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText='Please enter a valid password, at least 6 characters.'
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
