import { ChromaClient } from "chromadb";

import { getDocumentsFromPath, splitDocuments } from "./utils";

// AIzaSyAeX_8PudInBdQegoOxcJqU6o3MsOHP53I

// const embedder = new OllamaEmbeddingFunction({
//     url: "http://127.0.0.1:11434/api/embeddings",
//     model: "llama2"
// })

const client = new ChromaClient({ path: "http://localhost:5555" });
const collection = await client.getOrCreateCollection({
    name: "my_collection2",
    // embeddingFunction: embedder,
});

let isReady = false;
beginEmbeddingProcess().then(() => {
    isReady = true;
    console.log("b");
});

const button = document.getElementById("btn");
const input = document.getElementById("input");
const resultParagraph = document.getElementById("result");
button.addEventListener("click", async () => {
    if (!isReady) {
        console.log("not yet ready");
        return;
    }
    try {
        const inputValue = input.value;
        console.log("input", inputValue);
        resultParagraph.textContent = "Loading...";
        const results = await collection.query({
            queryTexts: inputValue,
            nResults: 2,
        });
        resultParagraph.textContent = results.documents.join(" ");
    } catch (error) {
        resultParagraph.textContent = "Error :(";
        console.log("error", error);
    }
});

async function beginEmbeddingProcess() {
    // Read the documents.
    const documents = await getDocumentsFromPath("./CV");
    // Split to the chunks.
    const { result: splitted, ids } = splitDocuments({
        documents,
        batchSize: 200,
        overlap: 20,
    });
    // Add to DB
    await collection.add({ documents: splitted, ids });
}
