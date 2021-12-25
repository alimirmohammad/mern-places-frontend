import React, { useEffect, useReducer } from 'react';
import { validate } from '../../utils/validators';
import './Input.css';

export default function Input({
  id,
  label,
  element,
  type,
  placeholder,
  rows,
  errorText,
  validators,
  onInput,
  defaultValue,
  defaultValid,
}) {
  const [{ value, isValid, isTouched }, dispatch] = useReducer(inputReducer, {
    value: defaultValue ?? '',
    isTouched: false,
    isValid: defaultValid ?? false,
  });

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, isValid, onInput, value]);

  function changeHandler(event) {
    dispatch({ type: 'CHANGE', val: event.target.value, validators });
  }

  function touchHandler(event) {
    dispatch({ type: 'TOUCH' });
  }

  const inputElement =
    element === 'input' ? (
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        onChange={changeHandler}
        value={value}
        onBlur={touchHandler}
      />
    ) : (
      <textarea
        id={id}
        rows={rows || 3}
        onChange={changeHandler}
        value={value}
        onBlur={touchHandler}
      />
    );
  return (
    <div
      className={`form-control ${
        !isValid && isTouched ? 'form-control--invalid' : ''
      }`}>
      <label htmlFor={id}>{label}</label>
      {inputElement}
      {!isValid && isTouched && <p>{errorText}</p>}
    </div>
  );
}

function inputReducer(state, action) {
  switch (action.type) {
    case 'CHANGE':
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
      };
    case 'TOUCH':
      return {
        ...state,
        isTouched: true,
      };
    default:
      return state;
  }
}
