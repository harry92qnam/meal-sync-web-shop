import { Button, Card, Skeleton, Spacer } from '@nextui-org/react';
import apiClient from '@/services/api-services/api-client';
import React, { ChangeEvent, useState } from 'react';
import APICommonResponse from '@/types/responses/APICommonResponse';

interface ImageUploaderResponse extends APICommonResponse {
  value: {
    imageUrl: string;
  };
}

const UNAVAILABLE_IMAGE_URL =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDmLmh7aQYs6uH6OgqySO76DH5CVwRowkSXVFz4muN64UgjnVCRy-YU8gqe31BNwroU84&usqp=CAU';
const NO_IMAGE_URL =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDmLmh7aQYs6uH6OgqySO76DH5CVwRowkSXVFz4muN64UgjnVCRy-YU8gqe31BNwroU84&usqp=CAU';

const getURLImageFromFile = (file: File | null) => {
  return file == null ? UNAVAILABLE_IMAGE_URL : URL.createObjectURL(file);
};

const uploadImageAsync = async (uploadServiceEndpoint: string, image: File) => {
  const formData = new FormData();
  formData.append('image', image);
  let res = UNAVAILABLE_IMAGE_URL;
  try {
    const response = await apiClient.post<ImageUploaderResponse>(uploadServiceEndpoint, formData);
    res = response.data.value.imageUrl;
  } catch (err) {
    console.error('Upload failed', err);
    res = NO_IMAGE_URL;
  }
  return res;
};

interface Props {
  uploadServiceEndpoint: string;
  imageURL?: string;
  setImageURL: (url: string) => void;
}

const ImageUploader = ({ uploadServiceEndpoint, imageURL, setImageURL }: Props) => {
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePreviewImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      console.log('Selected file:', selectedFile);
      setImage(selectedFile);
      setImageURL(getURLImageFromFile(selectedFile));
      setLoading(true);
      try {
        const urlFromAPI = await uploadImageAsync(uploadServiceEndpoint, selectedFile);
        setImageURL(urlFromAPI);
      } catch (err) {
        console.error('Error uploading image', err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="h-full w-full text-center">
      {loading ? (
        <Skeleton>
          <Card className="h-full w-full" />
        </Skeleton>
      ) : (
        <Card
          className="relative h-full w-full"
          style={{
            backgroundImage: `url(${imageURL || UNAVAILABLE_IMAGE_URL})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}
      <Spacer y={1} />
      <Button as="label" className="relative cursor-pointer font-bold">
        <span className="cursor-pointer">Tải ảnh lên</span>
        <input
          type="file"
          onChange={handlePreviewImage}
          accept="image/*"
          className="absolute top-0 left-0 w-full h-full opacity-0"
          aria-hidden="true"
        />
      </Button>
    </div>
  );
};

export default ImageUploader;
