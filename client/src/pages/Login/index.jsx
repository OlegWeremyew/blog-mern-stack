import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import styles from "./Login.module.scss";
import {useForm} from "react-hook-form";
import {fetchAuth, selectIsAuth} from "../../redux/slices/auth";
import {useDispatch, useSelector} from "react-redux";
import {Navigate} from "react-router-dom";

export const Login = () => {
  const dispatch = useDispatch()
  const isAuth = useSelector(selectIsAuth)

  const {register, handleSubmit, setError, formState: {errors, isValid}} = useForm({
    defaultValues: {
      email: 'olegweremey1994@mail.ru',
      password: '123456',
    },
    mode: "onChange",
  })

  const onSubmit = async (values) => {
    const data = await dispatch(fetchAuth(values))

    if (!data.payload) return alert('Не удалось авторизоваться')

    if ('token' in data.payload) {
      localStorage.setItem('token', data.payload.token)
    }
  }

  if (isAuth) {
    return <Navigate to="/"/>
  }

  return (
    <Paper classes={{root: styles.root}}>
      <Typography classes={{root: styles.title}} variant="h5">
        Вход в аккаунт
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label="E-Mail"
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          fullWidth
          {...register('email', {
            required: 'Укажите емаил',
          })}
        />
        <TextField
          className={styles.field}
          label="Пароль"
          fullWidth
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register('password', {
            required: 'Укажите password',
          })}
        />
        <Button
          type="submit"
          size="large"
          variant="contained"
          fullWidth
        >
          Войти
        </Button>
      </form>
    </Paper>
  );
};
