import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation, useParams } from "react-router-dom";
import { createCard, updateCard, readDeck, readCard } from "../../utils/api/index";

function AddEditCard() {
    const initialFormState = {
        front: "",
        back: ""
    };

    const [formData, setFormData] = useState({ ...initialFormState });
    const [deckName, setDeckName] = useState("");

    const handleChange = ({ target }) => {
        setFormData({ ...formData, [target.name]: target.value });
    };

    const navigate = useNavigate();
    const location = useLocation();
    const { deckId, cardId } = useParams();

    const handleSubmit = async (event) => {
        event.preventDefault();
        await createCard(deckId, formData);
        setFormData(initialFormState);
    };

    const handleEdit = async (event) => {
        event.preventDefault();
        await updateCard(formData);
        navigate(`/decks/${deckId}`);
    };

    useEffect(() => {
        const abortController = new AbortController();
        async function loadCard() {
            if (cardId) {
                try {
                    const cardData = await readCard(cardId, abortController.signal);
                    setFormData(cardData);
                } catch (error) {
                    console.log(error);
                }
            }
        }
        loadCard();
        return () => abortController.abort();
    }, [cardId]);

    useEffect(() => {
        const abortController = new AbortController();
        async function loadDeck() {
            try {
                const deckData = await readDeck(deckId, abortController.signal);
                setDeckName(deckData.name);
            } catch (error) {
                console.log(error);
            }
        }
        loadDeck();
        return () => abortController.abort();
    }, [deckId]);

    const formTitle = location.pathname.includes("edit") ? "Edit Card" : "Add Card";
    const submitButtonLabel = location.pathname.includes("edit") ? "Submit" : "Save";
    const handleSubmitForm = location.pathname.includes("edit") ? handleEdit : handleSubmit;

    return (
         <React.Fragment>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item"><Link to={`/decks/${deckId}`}>{deckName}</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">{formTitle}</li>
                </ol>
            </nav>
            <h3>{formTitle}</h3>
            <form onSubmit={handleSubmitForm}>
                <label htmlFor="front">
                    Front
                    <br />
                    <textarea
                        id="front"
                        type="text"
                        name="front"
                        onChange={handleChange}
                        value={formData.front}
                        placeholder="Card Front"
                    />
                </label>
                <br />
                <label htmlFor="back">
                    Back
                    <br />
                    <textarea
                        id="back"
                        type="text"
                        name="back"
                        onChange={handleChange}
                        value={formData.back}
                        placeholder="Card Back"
                    />
                </label>
                <br />
                <Link to={`/decks/${deckId}`} className="btn btn-secondary">Done</Link>
                <button type="submit" className="btn btn-primary">{submitButtonLabel}</button>
            </form>
         </React.Fragment>
    );
}

export default AddEditCard;
