import React from "react";
import Camera from "./Camera";
import styles from "./App.module.scss";
import BackgroundSelector from "./BackgroundSelector";
import { BGProvider } from "./context/bgContext";

function App() {
  return (
    <div className={styles.container}>
      <BGProvider>
        <Camera />
        <BackgroundSelector />
      </BGProvider>
    </div>
  );
}

export default App;
