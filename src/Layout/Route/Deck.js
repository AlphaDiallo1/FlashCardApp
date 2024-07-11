import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { readDeck, deleteDeck, deleteCard } from "../../utils/api/index";

function Deck() {
    const [deck, setDeck] = useState([]);
    const [cards, setCards] = useState([]);
    const {deckId} = useParams(); // extract deckId from URL params 
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchCards() {
            try {
                // fetch deck details and cards when component mounts
                const fetchedDeck = await readDeck(deckId)
                setDeck(fetchedDeck)
                setCards(fetchedDeck.cards)
            } catch (error) {
                console.error('Error fetching cards:', error);
            }
        }
        fetchCards() // call fetchCards function 
    }, [deckId]); // trigger effect when deckId changes

    // remove deck function 
    const removeDeck = async (deckIdToDelete) => {
        const confirm = window.confirm("Are you sure you want to delete this deck?")
        if (confirm) {
            try {
                // call deleteDeck API func to delete the deck 
                await deleteDeck(deckIdToDelete);
                navigate("/");
            } catch (error) {
                console.error("Error deleting deck:", error);
            }
        }
    }

    // remove card function 
    const removeCard = async (cardIdToDelete) => {
        const confirm = window.confirm("Are you sure you want to delete this card?")
        if (confirm) {
            try {
                // call deleteCard API to delete a card 
                await deleteCard(cardIdToDelete);
                navigate(0); // navigate to current page (refresh)
            } catch (error) {
                console.error("Error deleting card:", error);
            }
        }
    }

    // mapping cards to UI elements 
    const cardItems = cards.map((card) => (
        <li key={card.id}>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">{card.front}</h5>
                    <p className="card-text">{card.back}</p>
                    <Link to={`cards/${card.id}/edit`} className="btn btn-secondary">Edit</Link>
                    <button onClick={() => removeCard(card.id)} className="btn btn-danger">Delete</button>
                </div>
            </div>
        </li>
    ));
    
    // render Deck component UI
    return (
        <React.Fragment>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">{deck.name}</li>
                </ol>
            </nav>
                <div>
                    <h2>{deck.name}</h2>
                    <div>{deck.description}</div>
                    <br />
                <Link to={`/decks/${deckId}/edit`} className="btn btn-secondary">Edit</Link>
                <Link to={`/decks/${deckId}/study`} className="btn btn-primary">Study</Link>
                <Link to={`/decks/${deckId}/cards/new`} className="btn btn-primary">Add Card</Link>
                <button className="btn btn-danger" onClick={() => removeDeck(deckId)}>Delete</button>
                </div>
                <br />
                <h4>Cards</h4>
                <ul>{cardItems}</ul>
            </React.Fragment>
    )
}

export default Deck;