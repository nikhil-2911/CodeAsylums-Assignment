import "./App.css";
import { useState, useEffect } from "react";
import { db } from "./firebase";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import firebase from "firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "././components/header/header";
import UrlListItem from "././components/url/url";
import Top from "././components/top/top";

function App() {
  const [urls, setUrls] = useState([]);
  const [urlInput, setUrlInput] = useState("");

  useEffect(() => {
    getUrls();
  }, []);

  const getUrls = () => {
    db.collection("urls")
      .orderBy("timestamp", "desc")
      .onSnapshot((querySnapshot) => {
        setUrls(
          querySnapshot.docs.map((doc) => ({
            id: doc.id,
            originalUrl: doc.data().url,
            shortUrl: doc.data().shortUrl,
          }))
        );
      });
  };

  const addUrl = async (e) => {
    e.preventDefault();

    // checking url is valid or not
    function validURL(str) {
      var pattern = new RegExp(
        "^(https?:\\/\\/)?" + // protocol
          "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
          "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
          "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
          "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
          "(\\#[-a-z\\d_]*)?$",
        "i"
      ); // fragment locator
      return !!pattern.test(str);
    }
    let isPresent = false;
    const logUrls = async () => {
      let urlRef = db.collection("urls");
      let allUrls = await urlRef.get();
      for (const doc of allUrls.docs) {
        if (urlInput === doc.data().url) {
          isPresent = true;
        }
      }
    };
    await logUrls();
    if (!validURL(urlInput)) {
      toast.error("Use Valid URL!");
    } else if (isPresent === true) {
      toast.warn("URL is already exist!");
    } else {
      toast.success("URL is Shortened 👍");
      const shortenUrl = async () => {
        await axios
          .get(`https://api.shrtco.de/v2/shorten?url=${urlInput}`)
          .then((response) => response.data)
          .then((info) => info.result.full_short_link)
          .then((sUrl) => {
            console.log(sUrl);
            let code = uuidv4();
            db.collection("urls").add({
              url: urlInput,
              shortUrl: sUrl,
              code: code,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            });
            setUrlInput("");
          })
          .catch((err) => console.log(err));
      };
      shortenUrl();
    }
  };

  return (
    <div className="App">
      <Header />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <form>
          <input
            label="URL Shortner"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            style={{
              maxWidth: "500px",
              width: "90vh",
              marginTop: "30px",
              padding: "10px 8px",
              fontSize: "20px",
              borderRadius: "5px",
              border: "1px solid #9F7AEA",
            }}
            placeholder="Enter a Url to shorten..."
          />
          <button
            type="submit"
            onClick={addUrl}
            style={{
              color: "white",
              marginTop: "30px",
              marginLeft: "20px",
              padding: "10px 12px",
              fontSize: "20px",
              borderRadius: "5px",
              backgroundColor: "#805ad5",
              border: "none",
              cursor: "pointer",
            }}
          >
            Shorten!
          </button>
        </form>
        <ToastContainer />
        <Top />
        {/* Adding all urls on bottom */}
        <div
          style={{
            marginTop: "25px",
            width: "60%",
          }}
        >
          {urls.map((url) => {
            return (
              <UrlListItem
                id={url.id}
                originalUrl={url.originalUrl}
                shortUrl={url.shortUrl}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default App;
