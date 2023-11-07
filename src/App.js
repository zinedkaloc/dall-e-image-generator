import React, { useState } from "react";
import { OpenAI } from "openai";
import "./App.css";

function App() {
  const [inputPrompt, setInputPrompt] = useState("");
  const [style, setStyle] = useState("🎨 Oil Painting");
  const [mood, setMood] = useState("😌 Serene");
  const [activeTab, setActiveTab] = useState("manual");
  const [imageURL, setImageURL] = useState("");
  const [revisedPrompt, setRevisedPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Replace with your own OpenAI API key
  const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const combinedPrompt =
      activeTab === "manual"
        ? inputPrompt
        : `${inputPrompt}, Style: ${style}, Mood: ${mood}`;

    try {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: combinedPrompt,
        n: 1,
        size: "1024x1024",
      });
      console.log("Response from OpenAI:", response);
      setRevisedPrompt(response.data[0].revised_prompt);
      setImageURL(response.data[0].url);
    } catch (error) {
      console.error("Error generating the image:", error);
      alert(
        "Failed to generate the image. Check the console for more details."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1>DALL·E 3 Image Generator</h1>
        <p className="experimental-text">
          This is an experimental app that uses the{" "}
          <a
            href="https://openai.com/blog/dall-e/"
            target="_blank"
            rel="noreferrer"
          >
            DALL·E 3 model
          </a>{" "}
          from{" "}
          <a href="https://openai.com/" target="_blank" rel="noreferrer">
            OpenAI
          </a>
          . It generates an image based on the description you provide.{" "}
        </p>

        {/* Tab Buttons */}
        <div className="tabs-container">
          <div className="tabs">
            <button
              className={`tab ${activeTab === "manual" ? "active" : ""}`}
              onClick={() => setActiveTab("manual")}
            >
              Manual Prompt
            </button>
            <button
              className={`tab ${activeTab === "predefined" ? "active" : ""}`}
              onClick={() => setActiveTab("predefined")}
            >
              Predefined Options
            </button>
          </div>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="input-form">
          {activeTab === "manual" && (
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Enter a description..."
              className="input-prompt"
            />
          )}

          {activeTab === "predefined" && (
            <>
              <input
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="Enter a base description..."
                className="input-prompt"
              />
              <div className="select-row">
                <div className="select-wrapper">
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="option-select"
                  >
                    <option value="🎨 Oil Painting">🎨 Oil Painting</option>
                    <option value="🖌️ Watercolor">🖌️ Watercolor</option>
                    <option value="💻 Digital Art">💻 Digital Art</option>
                    {/* Add more styles with emojis */}
                  </select>
                </div>
                <div className="select-wrapper">
                  <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    className="option-select"
                  >
                    <option value="😌 Serene">😌 Serene</option>
                    <option value="🌀 Chaotic">🌀 Chaotic</option>
                    <option value="🔮 Mystical">🔮 Mystical</option>
                    {/* Add more moods with emojis */}
                  </select>
                </div>
              </div>
            </>
          )}

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate"}
          </button>
        </form>
        {/* Loading Indicator */}
        {isLoading && <div className="loading-indicator"></div>}
        {/* Image Display */}
        {imageURL && (
          <div className="image-container">
            <img
              src={imageURL}
              alt="Generated from OpenAI"
              className="generated-image"
            />
            <div className="image-overlay">
              <div className="prompt-text">{revisedPrompt}</div>
              <a
                href={imageURL}
                download={`generated-image-${Date.now()}.jpg`}
                className="download-icon"
              >
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 20h14v-2H5v2zm7-18L5.33 8.67 6.75 10l4.25-4.25V16h2V5.75L17.25 10l1.42-1.41L12 2z" />
                </svg>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
