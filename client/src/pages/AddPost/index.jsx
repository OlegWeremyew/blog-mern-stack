import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import {useSelector} from "react-redux";
import {selectIsAuth} from "../../redux/slices/auth";
import {Navigate, useNavigate, useParams} from "react-router-dom";
import {instance} from "../../api/instance";

export const AddPost = () => {
  const isAuth = useSelector(selectIsAuth)
  const navigate = useNavigate()
  const {id} = useParams()

  const [isLoading, setIsLoading] = useState(false)
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [imageUrl, setImageUrl] = useState(null);

  const isEditing = Boolean(id)

  const inputRef = useRef(null)

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData()
      const file = event.target.files[0]
      formData.append('image', file)

      const {data} = await instance.post('/upload', formData)

      setImageUrl(data.url)
    } catch (e) {
      console.log(e.message)
      alert('ошибка при загрузке файла')
    } finally {
      setIsLoading(false)
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl('')
  };

  const onChange = useCallback((text) => {
    setText(text);
  }, []);

  const onSubmit = async () => {
    try {
      setIsLoading(true)

      const fields = {
        title,
        imageUrl,
        tags,
        description: text,
      }

      const {data} = isEditing
        ? await instance.patch(`/posts/${id}`, fields)
        : await instance.post('/posts', fields)

      const _id = isEditing ? id : data._id

      navigate(`/posts/${_id}`)
    } catch (e) {
      console.warn(e)
      alert("Ошибка при создании статьи")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      instance.get(`/posts/${id}`)
        .then(({data}) => {
          setTitle(data.title)
          setText(data.description)
          setImageUrl(data.imageUrl)
          setTags(data.tags.join(','))
        })
        .catch((e) => {
          console.warn(e.message)
          alert("Ошибка")
        })
    }
  }, [])

  const options = useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

  if (!localStorage.getItem('token') && !isAuth) {
    return <Navigate to="/login"/>
  }

  return (
    <Paper style={{padding: 30}}>
      <Button
        variant="outlined"
        size="large"
        onClick={() => inputRef.current.click()}
      >
        Загрузить превью
      </Button>
      <input
        ref={inputRef}
        type="file"
        onChange={handleChangeFile}
        hidden/>
      {imageUrl && (
        <>
          <Button variant="contained" color="error" onClick={onClickRemoveImage}>
            Удалить
          </Button>
          <img className={styles.image} src={`http://localhost:4444${imageUrl}`} alt="Uploaded"/>
        </>
      )}
      <br/>
      <br/>
      <TextField
        classes={{root: styles.title}}
        variant="standard"
        placeholder="Заголовок статьи..."
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        classes={{root: styles.tags}}
        variant="standard"
        placeholder="Тэги"
        fullWidth
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <SimpleMDE
        className={styles.editor}
        value={text}
        options={options}
        onChange={onChange}
      />
      <div className={styles.buttons}>
        <Button
          size="large"
          variant="contained"
          onClick={onSubmit}
        >
          {isEditing ? 'Сохранить изменения' : 'Опубликовать'}
        </Button>
        <a href="/client/src/pages">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
