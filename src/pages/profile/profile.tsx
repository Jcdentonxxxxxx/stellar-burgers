import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useSelector, useDispatch } from '@store';
import { userDataSelector, getErrorUpdateUser } from '@selectors';
import { updateUser } from '@slices';
import { TRegisterData } from '@api';

export const Profile: FC = () => {
  const user = useSelector(userDataSelector);
  const updateUserError = useSelector(getErrorUpdateUser);
  const dispatch = useDispatch();

  const [formValue, setFormValue] = useState({
    name: user ? user.name : '',
    email: user ? user.email : '',
    password: ''
  });
  const [passwordWasAutoFilled, setPasswordWasAutoFilled] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordTyped, setIsPasswordTyped] = useState(false);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    (isPasswordTyped && !!formValue.password);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const payload: Partial<TRegisterData> = {};

    if (formValue.name !== user?.name) {
      payload.name = formValue.name;
    }
    if (formValue.email !== user?.email) {
      payload.email = formValue.email;
    }
    if (isPasswordTyped && formValue.password) {
      payload.password = formValue.password;
    }

    dispatch(updateUser(payload));
    setPasswordWasAutoFilled(false);
    setIsPasswordTyped(false);
    setIsFocused(false);
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user ? user.name : '',
      email: user ? user.email : '',
      password: ''
    });
    setPasswordWasAutoFilled(false);
    setIsPasswordTyped(false);
    setIsFocused(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));

    if (e.target.name !== 'password') return;

    if (passwordWasAutoFilled) {
      setIsPasswordTyped(true);
    } else {
      if (e.target.value !== '' && isFocused) {
        setIsPasswordTyped(true);
      } else {
        setIsPasswordTyped(false);
      }
    }
  };

  const handlePasswordFocus = () => {
    setIsFocused(true);
    if (!passwordWasAutoFilled && formValue.password !== '') {
      setPasswordWasAutoFilled(true);
    }
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      passwordProps={{
        onFocus: handlePasswordFocus
      }}
      updateUserError={updateUserError ? updateUserError : undefined}
    />
  );

  return null;
};
