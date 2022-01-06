import React, { useEffect, useRef, useState } from 'react';
import Button from './Button';
import './ImageUpload.css';

export default function ImageUpload({ id, center, onInput, errorText }) {
  const imagePickerRef = useRef();
  const [file, setFile] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (!file) return;
    const fileReader = new FileReader();
    fileReader.onload = () => setPreviewUrl(fileReader.result);
    fileReader.readAsDataURL(file);
  }, [file]);

  function pickImage() {
    imagePickerRef.current.click();
  }

  function changeImage(event) {
    let pickedFile, isFileValid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      isFileValid = true;
      setFile(pickedFile);
      setIsValid(isFileValid);
    } else {
      isFileValid = false;
      setIsValid(isFileValid);
    }
    onInput(id, pickedFile, isFileValid);
  }

  return (
    <div className='form-control'>
      <input
        id={id}
        type='file'
        accept='.jpg,.png,.jpeg'
        hidden
        style={{ display: 'none' }}
        ref={imagePickerRef}
        onChange={changeImage}
      />
      <div className={`image-upload ${center ? 'center' : ''}`}>
        <div className='image-upload__preview'>
          {previewUrl ? (
            <img src={previewUrl} alt='Preview' />
          ) : (
            <p>Please pick an image.</p>
          )}
        </div>
        <Button type='button' onClick={pickImage}>
          PICK IMAGE
        </Button>
      </div>
      {!isValid && <p>{errorText}</p>}
    </div>
  );
}
