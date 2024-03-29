// UpdateImageProps.tsx
import React, { useEffect, useState } from "react";
import { deleteSingleImageAPI } from "../../../features/api/imagesAPI";
import { useAppDispatch } from "../../../app/hook";
import { updateProductImageAPi } from "../../../features/products/productsAPI";
import { getAllProductsApi } from "../../../features/products/productsAPI";
import RamiBtn from "../../../components/RamiBtn/RamiBtn";
import "./update-image.scss";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface UpdateImageProps {
  product_id: number | null;
  product_img_name_a: string | undefined;
  product_img_data_a: string | undefined;
  product_img_name_b: string | undefined;
  product_img_data_b: string | undefined;
  onClose: () => void;
}

const UpdateImage: React.FC<UpdateImageProps> = ({
  product_id,
  product_img_name_a,
  product_img_data_a,
  product_img_name_b,
  product_img_data_b,
  onClose,
}) => {
  const [imageAData, setImageAData] = useState<string>(
    product_img_data_a || ""
  );
  const [imageBData, setImageBData] = useState<string>(
    product_img_data_b || ""
  );
  const [imageAName, setImageAName] = useState<string>(
    product_img_name_a || ""
  );
  const [imageBName, setImageBName] = useState<string>(
    product_img_name_b || ""
  );
  const [newImageA, setNewImageA] = useState<File>();
  const [newImageB, setNewImageB] = useState<File>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    setImageAData(base64Image(product_img_data_a));
    setImageBData(base64Image(product_img_data_b));
  }, []);

  const base64Image = (product_img_data: any) => {
    if (product_img_data !== null && product_img_data !== undefined) {
      return btoa(
        String.fromCharCode(...new Uint8Array(product_img_data.data))
      );
    }
    return "";
  };

  const handleUpdateImage = async (isA: boolean) => {
    const formData = new FormData();
    formData.append("product_id", product_id!.toString());

    if (isA) {
      if (!newImageA) {
        toast.error("לא נבחרה תמונה");
        return;
      }
      formData.append("imagesProduct", newImageA);
      formData.append("field_name", "A");
    } else {
      if (!newImageB) {
        toast.error("לא נבחרה תמונה");
        return;
      }
      formData.append("imagesProduct", newImageB);
      formData.append("field_name", "B");
    }
    await dispatch(updateProductImageAPi(formData));
    dispatch(getAllProductsApi());
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const isA = e.target.name === "imagesProduct1" ? true : false;
    if (isA) {
      setNewImageA(files[0]);
    } else {
      setNewImageB(files[0]);
    }
  };
  const handleDeleteImageA = async () => {
    if (product_id) {
      await dispatch(
        deleteSingleImageAPI({ product_id: product_id, isA: true })
      );
      dispatch(getAllProductsApi());
      setImageAData("");
      setImageAName("");
    }
  };
  const handleDeleteImageB = async () => {
    if (product_id) {
      await dispatch(
        deleteSingleImageAPI({ product_id: product_id, isA: false })
      );
      dispatch(getAllProductsApi());
      setImageBData("");
      setImageBName("");
    }
  };
  return (
    <div className="img-update-main">
      <h1 className="update-imgs-title">עדכן תמונות</h1>
      <div className="imgs-update-content">
        <div className="productImage">
          <label htmlFor="imagesProduct1">תמונה 1</label>
          {newImageA ? (
            <img src={URL.createObjectURL(newImageA)} alt={imageAName || ""} />
          ) : (
            <img
              src={`data:image/jpeg;base64, ${imageAData}`}
              alt={imageAName || ""}
            />
          )}

          <input
            type="file"
            id="imagesProduct1"
            name="imagesProduct1"
            onChange={handleFileChange}
          />
          <div className="update-delete-btns">
            {newImageA && (
              <RamiBtn onClick={() => handleUpdateImage(true)}>
                עדכן תמונה
              </RamiBtn>
            )}
            {imageAData && (
              <RamiBtn onClick={handleDeleteImageA}>מחק תמונה</RamiBtn>
            )}
          </div>
        </div>
        <div className="productImage">
          <label htmlFor="imagesProduct2">תמונה 2</label>
          {newImageB ? (
            <img src={URL.createObjectURL(newImageB)} alt={imageBName || ""} />
          ) : (
            <img
              src={`data:image/jpeg;base64,${imageBData}`}
              alt={imageBName || ""}
            />
          )}
          <input
            type="file"
            id="imagesProduct2"
            name="imagesProduct2"
            onChange={handleFileChange}
          />
          {newImageB && (
            <RamiBtn onClick={() => handleUpdateImage(false)}>
              עדכן תמונה
            </RamiBtn>
          )}
          {imageBData && (
            <RamiBtn onClick={handleDeleteImageB}>מחק תמונה</RamiBtn>
          )}
        </div>
        <RamiBtn className="exit-img-upload" onClick={onClose}>
          סגור
        </RamiBtn>
      </div>
    </div>
  );
};

export default UpdateImage;
