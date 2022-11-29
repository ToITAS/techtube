import { useEffect } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";

export default function Home({ articles }) {
  return (
    <>
      <Navbar />
      <div className="page-content">
        <header>
          <div className="header-text">
            <h1>Welcome to TechTube</h1>
            <h4>
              Here you can find documentation for use of multiple technologies,
              ranging from monitoring to virtualization
            </h4>
          </div>
        </header>
        <section className="section-wrapper">
          <div className="section-title">
            <h2>
              <b>Articles:</b>
            </h2>
          </div>
          <div className="section-cards">
            {articles
              ? articles.map((article, index) => (
                  <Link href={`/artikler/${article.artikkel_id}`} key={index}>
                    <div className="article-card">
                      <div className="article-card-text">
                        <h3>{article.tittel}</h3>
                        <h4>{article.lagt_til_av.fornavn}</h4>
                      </div>
                    </div>
                  </Link>
                ))
              : ""}
          </div>
        </section>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  try {
    const response = await fetch(process.env.API_BASE_URL + "/api/artikler");
    if (response.status === 200) {
      const articles = await response.json();
      return { props: { articles } };
    } else {
      throw "";
    }
  } catch (e) {
    console.log(e);
    return { props: { articles: [] } };
  }
}
