import React from 'react';
import logo from './logo.svg';
import './App.css';
import './sass/base.sass';
import {Table} from "./Table";

function App() {
  return (
    <Table maxChairs={10} />
  );
}

export default App;
