import React from "react";
import bgData from "./data/bg.json";
import styles from "./BackgroundSelector.module.scss";
import { BGProvider, useBG } from "./context/bgContext";

function BackgroundSelector() {
  const { bg, setBg } = useBG();
  const imgSelectedClass = `${styles.imageContainer} ${styles.selected}`;
  console.log("rerender", bg);
  const getImgContainerClass = (curentBg: string) =>
    curentBg === bg ? imgSelectedClass : styles.imageContainer;
  return (
    <div className={styles.container}>
      <p>Pilih Background</p>
      <div className={styles.imageListContainer}>
        {bgData.map((imgUrl) => (
          <div
            className={getImgContainerClass(imgUrl)}
            onClick={() => setBg(imgUrl)}
          >
            <img
              src={imgUrl}
              alt={imgUrl}
              className={styles.image}
              onClick={() => setBg(imgUrl)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default BackgroundSelector;
