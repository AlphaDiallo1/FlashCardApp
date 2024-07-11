import React, { useEffect, useState } from "react";
import { readDeck } from "../../utils/api";
import { Link, useNavigate, useParams } from "react-router-dom";

function Study() {
  const [cards, setCards] = useState([]); // state to store cards 
  const [currentCard, setCurrentCard] = useState(null); // state to track the current card
  const [deckName, setDeckName] = useState(""); // state to store the deck name 
  const [flip, setFlip] = useState(true); // state to manage the flip state of the card 
  const [count, setCount] = useState(0); // state to track the current count of card 
  const [finished, setFinished] = useState(false); // state to track if the study session is finished

  const { deckId } = useParams(); // get deckId from URL params 
  const navigate = useNavigate(); // navigation hook 

  // fetch deck data on component mount 
  useEffect(() => {
    const abortController = new AbortController();
    async function loadDeck() {
      try {
        const response = await readDeck(deckId, abortController.signal);
        const deckCards = response.cards || [];
        setCards(deckCards);
        setDeckName(response.name);
        if (deckCards.length > 0) {
          setCurrentCard(deckCards[0]); // set the first card as current card  
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error loading deck:", error);
        }
      }
    }
    loadDeck();
    return () => abortController.abort();
  }, [deckId]);

  // handle the "Next" button click 
  const handleNext = () => {
    if (count < cards.length - 1) {
      setCount(count + 1); // render next card 
    } else {
      const restart = window.confirm("Reset cards? Click 'Cancel' to return to the home screen.");
      if (restart) {
        setCount(0); // reset to the first card 
      } else {
        navigate("/"); // navigate back to home 
      }
    }
  };

  useEffect(() => {
    if (cards.length > 0 && count < cards.length) {
      setCurrentCard(cards[count]);
    }
  }, [count, cards]);

  const cardFront = currentCard && (
    <div key={currentCard.id} className="card">
      <div className="card-body">
        <h6>Card {count + 1} of {cards.length}</h6>
        <p className="card-title">{currentCard.front}</p>
        <button className="btn btn-secondary" onClick={() => setFlip(false)}>Flip</button>
      </div>
    </div>
  );

  const cardBack = currentCard && (
    <div key={currentCard.id} className="card">
      <div className="card-body">
        <h6>Card {count + 1} of {cards.length}</h6>
        <p className="card-title">{currentCard.back}</p>
        <button className="btn btn-secondary" onClick={() => setFlip(true)}>Flip</button>
        <button className="btn btn-primary" onClick={() => { setFlip(true); handleNext(); }}>Next</button>
      </div>
    </div>
  );

  return (
    <React.Fragment>
      {/* Breadcrumb navigation */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item"><Link to={`/decks/${deckId}`}>{deckName}</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Study</li>
        </ol>
      </nav>
      <h2>{deckName}: Study </h2>

      {/* Conditional rendering based on number of cards */}
      {cards.length < 3 ?
        (<React.Fragment>
          <h4>Not enough cards</h4>
          <p>You need at least 3 cards to study. There {cards.length === 1 ? "is" : "are"} currently {cards.length} in the deck.</p>
          <Link to={`/decks/${deckId}/cards/new`} className="btn btn-primary">Add Card</Link>
        </React.Fragment>)
        :
        (<React.Fragment>
          {finished ? (
            <div>
              <p>You have finished studying this deck!</p>
              <button className="btn btn-primary" onClick={() => { setCount(0); setFinished(false); }}>Restart</button>
              <Link to="/" className="btn btn-secondary">Return to Home </Link>
            </div>
          ) : (
            flip ? cardFront : cardBack
          )}
        </React.Fragment>
        )
      }
    </React.Fragment>
  );
}

export default Study;


