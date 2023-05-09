import React from 'react'
import Container from "@mui/material/Container";

import { Header } from "./components";
import { Home, FullPost, Registration, AddPost, Login } from "./pages";
import {Route, Routes} from "react-router-dom";

function App() {
  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/posts/:id" element={<FullPost />}/>
          <Route path="/add-post" element={<AddPost />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/register" element={<Registration />}/>

          <Route path="*" element={<Home />}/>
        </Routes>
      </Container>
    </>
  );
}

export default App;
