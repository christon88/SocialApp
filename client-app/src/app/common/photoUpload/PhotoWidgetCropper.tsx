import React, { useRef } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

interface Props {
  setImage: (image: Blob) => void;
  imagePreview: string;
}

const PhotoWidgetCropper: React.FC<Props> = ({ setImage, imagePreview }) => {
  const cropper = useRef<Cropper>(null);

  const cropImage = () => {
    if (typeof cropper?.current?.getCroppedCanvas() === "undefined") {
      return;
    }
    cropper.current?.getCroppedCanvas().toBlob((blob: any) => {
      setImage(blob);
    }, "image/jpeg");
  };
  return (
    <Cropper
      ref={cropper}
      src={imagePreview}
      style={{ height: 200, width: "100%" }}
      // Cropper.js options
      preview=".img-preview"
      aspectRatio={1 / 1}
      guides={false}
      viewMode={1}
      dragMode="move"
      scalable={true}
      cropBoxMovable={true}
      cropBoxResizable={true}
      crop={cropImage}
    />
  );
};

export default PhotoWidgetCropper;
