import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import { useAuth } from "../lib/context/AuthContext";

export default function Navbar() {
  const { auth } = useAuth();

  const [searchText, setSearchText] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [searchData, setSearchData] = useState(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchText) {
        const response = await fetch("/api/artikler/tittel/" + searchText)
          .then((res) => res.json())
          .then((data) => {
            if (data.length == 0) {
              setSearchData(null);
            } else {
              setSearchData(data);
            }
          })
          .catch(() => setSearchData(null));
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchText]);

  function handleSearchFocus(e) {
    if (e.type == "focus") {
      setSearchActive(true);
    } else {
      setTimeout(() => {
        setSearchActive(false);
        setSearchText("");
        setSearchData(null);
      }, 100);
    }
  }

  const router = useRouter();
  useEffect(() => {
    setSearchText("");
    setSearchActive(false);
  }, [router.asPath]);

  const { logout } = useAuth();

  function handleSignOutClicked() {
    logout();
  }

  return (
    <nav>
      <div className="nav-left">
        <Link href="/">
          <div className="logo-wrapper">
            <img src="/techtube-logo.svg" alt="" />
          </div>
        </Link>
        <ul>
          {!auth.status ? (
            <li>
              <Link href="/signin">Logg inn</Link>
            </li>
          ) : (
            <li>
              <Link href="/">
                <a onClick={handleSignOutClicked}>Logg ut</a>
              </Link>
            </li>
          )}

          <li>
            <Link href="/">Featured</Link>
          </li>
          {auth?.user?.autoritet === 1 ? (
            <li>
              <Link href="/cms">Cms</Link>
            </li>
          ) : (
            ""
          )}
        </ul>
      </div>
      <div className="nav-right">
        <div className="search-bar" onBlur={handleSearchFocus}>
          <div
            className={
              !searchText ? "search-bar-inner" : "search-bar-inner move-left"
            }
          >
            <span>
              <img src="/icon-search.svg" alt="" />
            </span>
            <input
              className="search-input"
              type="text"
              placeholder="Find documentation here!"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
              onFocus={handleSearchFocus}
            ></input>
          </div>
          <div className="search-results">
            {searchActive && searchData
              ? searchData.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="search-result"
                      onClick={() => {
                        router.push("/artikler/" + item.artikkel_id);
                      }}
                    >
                      <h4>{item.tittel}</h4>
                    </div>
                  );
                })
              : ""}
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavbarItem({ href, text, router }) {
  const isActive = router.asPath == "/" + href ? true : false;
  return (
    <li>
      <a className={isActive ? "active" : "awf"} href={href}>
        {text[0].toUpperCase() + text.slice(1, text.length)}
      </a>
    </li>
  );
}
