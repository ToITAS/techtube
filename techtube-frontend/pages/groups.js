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
            <h1>Dine grupper</h1>
            <h4>
              Here you can find documentation for use of multiple technologies,
              ranging from monitoring to virtualization
            </h4>
          </div>
        </header>
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
