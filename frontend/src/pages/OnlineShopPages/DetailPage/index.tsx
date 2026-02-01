import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import whenImageIsNotUploaded from "@/assets/when_image_is_not_uploaded.jpg";

import Loading from "@/components/web/loader";

import axios from "axios";
import { messagesApi, onlineShopApi, usersApi } from "@/server";
import { useUserContext } from "@/context/user";
import { useChatContext } from "@/context/messenger";

import {
  ProductCommentsIcon,
  ProductDetailsIcon,
  ProductLikeIcon,
  ProductUnlikeIcon,
} from "@/components/icons/products";
import { ProductImage, ProductType } from "@/types/onlineshop";
import ProductWidget from "@/components/web/onlineshop/product";
import CommentsWidget from "@/components/web/onlineshop/comments";
import { useOnlineShopContext } from "@/context/onlineshop";
import { useNotifications } from "@/context/notifications";
import { Button } from "@/components/ui/button";

const DetailPage: React.FC = () => {
  const { meta } = useParams<{ meta: string }>();
  const { isAuthenticated, role } = useUserContext();
  const { fetchChatsData, changeChat } = useChatContext();
  const { userLikedProducts, addToLiked, removeFromLiked } =
    useOnlineShopContext();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [selectedDep, setSelectedDep] = useState("tarriff");
  const [similarProducts, setSimilarProducts] = useState<ProductType[]>([]);
  const [mainImage, setMainImage] = useState<ProductImage | null>(null);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [productLiked, setProductLiked] = useState(false);
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const fetchData = async () => {
    try {
      const response = await axios.get(`${onlineShopApi}product/${meta}/`);
      if (response.status === 200) {
        setProduct(response.data.product);
        setMainImage(response.data.product.product_images_onlineshop[0]);
        setImages(response.data.product.product_images_onlineshop);
        setSimilarProducts(response.data.related);
      }
    } catch (err) {
      console.error("Error fetching product data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (meta?.length) {
      setLoading(true);
      fetchData().finally(() => setLoading(false));
    }
  }, [meta]);

  useEffect(() => {
    setProductLiked(
      Boolean(userLikedProducts?.find((value) => value.guid === product?.guid))
    );
  }, [userLikedProducts, product]);

  const handleImageClick = (selectedImage: ProductImage) => {
    setMainImage(selectedImage);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDep(event.target.id);
  };

  const handleConnect = () => {
    if (!product) return;

    axios
      .post(`${messagesApi}chats/${product.user.guid}/create/`, {
        product: product.guid,
      })
      .then((res) => {
        if (res.status === 200) {
          fetchChatsData(() => {});
          changeChat(res.data.guid);
          navigate("/profile/messages/");
        } else if (res.status === 303) {
          addNotification(
            "Xatolik yuz berdi!",
            "Siz o'zingizga ozingiz habar yozmoqchisiz lekin ushbu harakat amalga oshmaydi",
            "error"
          );
        }
      });
  };

  if (loading) {
    return (
      <div style={{ height: "calc(100vh - 178px)" }}>
        <Loading />
      </div>
    );
  }

  if (!product) return <>Product Not Found</>;

  const handleLike = async () => {
    if (product?.guid) {
      axios
        .post(`${onlineShopApi}like/`, { guid: product.guid })
        .then((res) => {
          if (res.status === 200) {
            if (res.data.liked) {
              if (!productLiked) {
                addToLiked(product);
              }
            } else {
              removeFromLiked(product);
            }
          }
        })
        .catch((err) => {});
    }
  };

  return (
    <div id="product-details">
      <div className="container mx-auto max-w-[1366px] px-4">
        <div className="h-full grid grid-cols-2 gap-4 mt-8">
          <div className="images-container">
            {images.length >= 1 && mainImage?.image ? (
              <div className="images flex items-start justify-center gap-4 space-x-2">
                <div className="vertical-images flex flex-col space-y-4 min-w-16">
                  {images.map((image, index) => (
                    <div
                      className={
                        "aspect-square w-18 cursor-pointer border border-[#D9D9D9] rounded-lg transition-all duration-300 ease-in " +
                        String(
                          image === mainImage
                            ? "ring-3 ring-offset-1 ring-brand"
                            : ""
                        )
                      }
                      key={index}
                      onClick={() => handleImageClick(image)}
                    >
                      <img
                        src={`${onlineShopApi?.replace("/api/", "")}${
                          image.image
                        }`}
                        alt={`Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                <div className="hero-image w-full">
                  <div className="aspect-square w-full rounded-lg ring-2 ring-offset-1 ring-border overflow-hidden">
                    <img
                      src={`${onlineShopApi?.replace("/api/", "")}${
                        mainImage?.image
                      }`}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="images">
                <div className="vertical-images">
                  <img src={whenImageIsNotUploaded} alt="..." />
                </div>
                <div className="hero-image">
                  <img src={whenImageIsNotUploaded} alt="..." />
                </div>
              </div>
            )}
          </div>

          <div className="content flex flex-col justify-between">
            <div className="flex items-start w-full flex-col">
              <h3 className="text-3xl font-bold text-text mb-2">
                {product.title}
              </h3>
              <div className="text-2xl font-medium text-text mb-1">
                O'lcham va tavsifi
              </div>
              <p className="text-description font-[16px] mb-2">
                {product.short_description}
              </p>
            </div>

            <div className="flex w-full h-auto p-3 justify-between items-center bg-background border border-border rounded-lg">
              <div className="flex items-center justify-center gap-2">
                <div className="aspect-square w-9 h-9 rounded-full overflow-hidden ring-2 ring-offset-1 ring-brand">
                  <img
                    src={`${usersApi?.replace("/api/", "")}${product.user.pfp}`}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="ml-2">
                  <div className="text-lg font-bold text-text mb-0">
                    {product.user.first_name} {product.user.last_name}
                  </div>
                  <div className="text-sm text-description">
                    {product.user.purposes.split(",")[0]}
                  </div>
                </div>
              </div>
              {isAuthenticated ? (
                <div className="flex items-center justify-center">
                  <Link
                    to="#"
                    onClick={handleConnect}
                    className="py-2 px-3 bg-brand text-white text-[16px] font-semibold rounded-lg ring-offset-1 ring-brand/80 transition-all duration-300 ease-in hover:ring-3"
                  >
                    Bog'lanish
                  </Link>

                  <button
                    type="button"
                    className="flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer"
                    onClick={handleLike}
                  >
                    <span
                      className={"icon" + (productLiked ? " text-brand" : "")}
                    >
                      {productLiked ? (
                        <ProductUnlikeIcon />
                      ) : (
                        <ProductLikeIcon />
                      )}
                    </span>
                  </button>
                </div>
              ) : (
                <Button asChild>
                  <Link to="/auth/sign-in/">Kirish</Link>
                </Button>
              )}
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center space-x-0">
              <div className="choice min-w-fit">
                <input
                  type="radio"
                  name="dep"
                  id="tarriff"
                  checked={selectedDep === "tarriff"}
                  onChange={handleChange}
                  className="hidden"
                />
                <label
                  htmlFor="tarriff"
                  className={`flex items-center justify-center space-x-1 py-2 px-3 transition-all duration-300 ease-out border-b-2 ${
                    selectedDep === "tarriff" ? "border-brand" : "border-border"
                  }`}
                >
                  <span className="icon">
                    <ProductDetailsIcon size={20} />
                  </span>
                  <span className="text">Mahsulot tarifi</span>
                </label>
              </div>

              <div className="choice min-w-fit">
                <input
                  type="radio"
                  name="dep"
                  id="datas"
                  checked={selectedDep === "datas"}
                  onChange={handleChange}
                  className="hidden"
                />
                <label
                  htmlFor="datas"
                  className={`flex items-center justify-center space-x-1 py-2 px-3 transition-all duration-300 ease-out border-b-2 ${
                    selectedDep === "datas" ? "border-brand" : "border-border"
                  }`}
                >
                  <span className="icon">
                    <ProductCommentsIcon />
                  </span>
                  <span className="text">Fikrlar</span>
                </label>
              </div>
              <div className="border-b-2 border-border w-full h-10.5"></div>
            </div>

            <div className="tab-container">
              <div
                className={`datas-container py-4 ${
                  selectedDep === "tarriff" ? "" : "hidden"
                }`}
              >
                <ReactMarkdown>{product.description}</ReactMarkdown>
              </div>
              <div
                className={`datas-container ${
                  selectedDep === "datas" ? "" : "hidden"
                }`}
              >
                <CommentsWidget product={product} />
              </div>
            </div>
          </div>
        </div>

        <div className="similar mb-4">
          <h3 className="text-3xl font-semibold text-text">
            O'xshash mahsulotlar
          </h3>
          <div className="text-md text-description">
            Yangi mahsulotlarni sinab ko'ring!
          </div>
          <div className="grid grid-cols-4 space-x-3 mt-3">
            {similarProducts.map((value, index) => (
              <ProductWidget product={value} key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
