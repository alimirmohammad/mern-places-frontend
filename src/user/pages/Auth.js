import React, { useContext, useState } from 'react';
import Card from '../../shared/components/UIElements/Card';
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

  function authenticate(event) {
    event.preventDefault();
    console.log(inputs);
    login();
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

  return (
    <Card className='authentication'>
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
        <Button inverse onClick={switchMode}>
          Switch to {isLoginMode ? ' SIGNUP' : ' LOGIN'}
        </Button>
      </form>
    </Card>
  );
}
