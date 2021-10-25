import React, { useState, useEffect, useRef } from "react";
import { CardMedia } from "@material-ui/core";

interface CoreLazyCardMedia {
  component: string;
  image: string;
  alt: string;
  height: string;
}

const CoreLazyCardMedia = (props: CoreLazyCardMedia) => {
  const [visible, setVisible] = useState<boolean>(false);
  const placeholderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible && placeholderRef.current) {
      const observer = new IntersectionObserver(([{ intersectionRatio }]) => {
        if (intersectionRatio > 0) {
          setVisible(true);
        }
      });
      observer.observe(placeholderRef.current);
      return () => observer.disconnect();
    }
  }, [visible, placeholderRef]);

  return visible ? (
    <CardMedia
      component="img"
      image={props.image}
      alt={props.alt}
      height={props.height}
    />
  ) : (
    <div
      style={{ height: props.height, backgroundColor: "#EEE" }}
      aria-label={props.alt}
      ref={placeholderRef}
    />
  );
};

export default CoreLazyCardMedia;
