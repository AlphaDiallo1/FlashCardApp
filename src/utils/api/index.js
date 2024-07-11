const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8080";

const headers = new Headers();
headers.append("Content-Type", "application/json");

function stripCards(deck) {
  const { cards, ...deckWithoutCards } = deck;
  return deckWithoutCards;
}

async function fetchJson(url, options, onCancel) {
  try {
    console.log(`Fetching: ${url}`, options); // Added logging
    const response = await fetch(url, options);

    if (response.status < 200 || response.status > 399) {
      throw new Error(`${response.status} - ${response.statusText}`);
    }

    if (response.status === 204) {
      return null;
    }

    return await response.json();

  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(`Fetch error: ${error.message}`, error.stack); // Added logging
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}


export async function listDecks(signal) {
  const url = `${API_BASE_URL}/decks?_embed=cards`;
  return await fetchJson(url, { signal }, []);
}

export async function createDeck(deck, signal) {
  const url = `${API_BASE_URL}/decks`;
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify(stripCards(deck)),
    signal,
  };
  return await fetchJson(url, options, {});
}

export async function readDeck(deckId, signal) {
  const url = `${API_BASE_URL}/decks/${deckId}?_embed=cards`;
  return await fetchJson(url, { signal }, {});
}

export async function updateDeck(updatedDeck, signal) {
  const url = `${API_BASE_URL}/decks/${updatedDeck.id}?_embed=cards`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify(stripCards(updatedDeck)),
    signal,
  };
  return await fetchJson(url, options, updatedDeck);
}

export async function deleteDeck(deckId, signal) {
  const url = `${API_BASE_URL}/decks/${deckId}`;
  const options = { method: "DELETE", signal };
  return await fetchJson(url, options);
}

export async function createCard(deckId, card, signal) {
  const url = `${API_BASE_URL}/cards`;
  card.deckId = Number(deckId);
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify(card),
    signal,
  };
  return await fetchJson(url, options, card);
}

export async function readCard(cardId, signal) {
  const url = `${API_BASE_URL}/cards/${cardId}`;
  return await fetchJson(url, { signal }, {});
}

export async function updateCard(updatedCard, signal) {
  const url = `${API_BASE_URL}/cards/${updatedCard.id}`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify(updatedCard),
  };
  return await fetchJson(url, options, updatedCard);
}

export async function deleteCard(cardId, signal) {
  const url = `${API_BASE_URL}/cards/${cardId}`;
  const options = { method: "DELETE", signal };
  return await fetchJson(url, options);
}

