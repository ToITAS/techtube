import { useEffect } from "react";
import formatUnix from "../../lib/formatUnix";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../lib/context/AuthContext";

export default function Article({ article }) {
  const { auth } = useAuth();

  return (
    <>
      <Navbar />
      <div className="page-content">
        <div className="article">
          <div className="article-head">
            <h1>{article.tittel}</h1>
            <h4>
              Skrevet {formatUnix(article.lagt_til_dato)} av{" "}
              {article.lagt_til_av.brukernavn}
            </h4>
          </div>
          <div className="article-content">
            {auth.status ? "hei" : "hade"}
            {article.moduler
              ? article.moduler.map((module, index) => (
                  <div className="article-module" key={index}>
                    {module.type == "undertittel" ? (
                      <h2>{module.tekst}</h2>
                    ) : module.type == "brødtekst" ? (
                      <p>{module.tekst}</p>
                    ) : (
                      ""
                    )}
                  </div>
                ))
              : ""}
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const response = await fetch(
    process.env.API_BASE_URL + "/api/artikler/id/" + context.params.id
  );
  const article = await response.json();
  return { props: { article } };
}
