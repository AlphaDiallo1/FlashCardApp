import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteDeck, listDecks } from "../utils/api/index";

function Home() {
  const [decks, setDecks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const abortController = new AbortController();
    async function fetchDecks() {
      try {
        const response = await listDecks(abortController.signal);
        setDecks(response);
      } catch (error) {
        console.error("Error fetching decks:", error);
      }
    }
    fetchDecks();
    return () => abortController.abort();
  }, []);

  // delete deck
  const removeDeck = async (deckIdToDelete) => {
    const confirm = window.confirm("Are you sure you want to delete this deck?");
    if (confirm) {
      try {
        await deleteDeck(deckIdToDelete);
        setDecks((prevDecks) => prevDecks.filter(deck => deck.id !== deckIdToDelete)); // Update the deck list
      } catch (error) {
        console.error("Error deleting deck:", error);
      }
    }
  };

  const deckItems = decks.map((deck, index) => (
    <li key={index} className="mb-2">
      <div className="card">
        <div className="card-body">
          <div className="card-header">
            <h5 className="card-title">{deck.name}</h5>
            <span>{deck.cards.length} cards</span>
          </div>
          <p className="card-text">{deck.description}</p>
          <Link to={`/decks/${deck.id}`} className="btn btn-secondary mr-2">View</Link>
          <Link to={`/decks/${deck.id}/study`} className="btn btn-primary mr-2">Study</Link>
          <button className="btn btn-danger" onClick={() => removeDeck(deck.id)}>Delete</button>
        </div>
      </div>
    </li>
  ));

  return (
    <React.Fragment>
      <div className="mb-2">
        <Link to="/decks/new" className="btn btn-secondary"> + Create Deck</Link>
      </div>
      <ul className="list-unstyled">{deckItems}</ul>
    </React.Fragment>
  );
}

export default Home;



