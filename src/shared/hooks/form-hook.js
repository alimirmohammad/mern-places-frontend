import { useCallback, useMemo, useReducer } from 'react';

export default function useForm(initialInputs, initialValidity) {
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInputs,
    isValid: initialValidity,
  });
  const inputHandler = useCallback((id, value, isValid) => {
    dispatch({ type: 'INPUT_CHANGE', inputId: id, value, isValid });
  }, []);
  const setFormData = useCallback((inputs, isValid) => {
    dispatch({ type: 'SET_DATA', inputs, isValid });
  }, []);
  return useMemo(
    () => [formState, inputHandler, setFormData],
    [formState, inputHandler, setFormData]
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
    case 'SET_DATA':
      return { inputs: action.inputs, isValid: action.isValid };

    default:
      return state;
  }
}
