import LoadingComponent from "@/components/web/loader";
import { useNewsContext } from "@/context/news";
import { newsApi } from "@/server";
import { DocumentType } from "@/types/news";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const DocumentDetailsPage: React.FC = () => {
  const { guid } = useParams();
  const { bussiniesDocuments } = useNewsContext();
  const [document, setDocument] = useState<DocumentType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (guid !== document?.guid) {
      setLoading(true);
      const fromLoaded = bussiniesDocuments.find(
        (value) => value.guid === guid
      );
      if (fromLoaded) {
        setDocument(fromLoaded);
        setLoading(false);
      } else {
        axios
          .get(`${newsApi}category/${guid}/`)
          .then((res) => {
            setDocument(res.data.results || []);
          })
          .catch((err) => {})
          .finally(() => {
            setLoading(false);
          });
      }
    }
  }, [guid, bussiniesDocuments]);

  return (
    <>
      <div className="w-full bg-background">
        {loading ? (
          <div className="w-full min-h-[calc(100vh-148px)] flex items-center justify-center">
            <LoadingComponent />
          </div>
        ) : document ? (
          <>
            <div className="container mx-auto max-w-[1366px] py-4">
              <div className="mb-3 section-title">
                <h3 className="text-2xl font-semibold">{document.title}</h3>
                <p className="text-description">{document.subtitle}</p>
              </div>

              <div className="iframe aspect-[16/9] w-full">
                <iframe
                  src={
                    `${newsApi?.replace("/api/", "")}${document.file}#toolbar=0&navpanes=0` || "/"
                  }
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          </>
        ) : (
          <>
            <p className="text-center text-description font-medium py-12">
              Hujjat fayli topilmadi
            </p>
          </>
        )}
      </div>
    </>
  );
};
