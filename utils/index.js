import * as pdfjsLib from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc =
    "./node_modules/pdfjs-dist/build/pdf.worker.mjs";

export async function getDocumentsFromPath(path) {
    return new Promise((res) => {
        const fileNames = ["../CV/BAE FACTS.pdf"];
        const result = [];

        fileNames.forEach(async (filePath) => {
            const loadingTask = pdfjsLib.getDocument(filePath);
            const pdf = await loadingTask.promise;
            let summaryText = "";
            const numberOfPages = pdf.numPages;
            for (let i = 1; i <= numberOfPages; ++i) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const items = textContent.items;
                let name = "default";
                for (let i = 0; i < items.length; ++i) {
                    if (name !== items[i].fontName) {
                        if (name !== "default") {
                            // changed
                            summaryText += "<br/>";
                        }
                        name = items[i].fontName;
                    }
                    summaryText += items[i].str;
                }
            }
            result.push({ text: summaryText });
            res(result);
        });
    });
}

("abcdef");

export function splitDocuments({ documents, batchSize = 200, overlap = 20 }) {
    const result = [];
    const ids = [];
    for (let i = 0; i < documents.length; ++i) {
        const curr = documents[i].text;
        let start = 0;
        while (start < curr.length) {
            const end = start + batchSize;
            const trimmed = curr.substring(start, end);
            result.push(trimmed);
            ids.push(`id-${start}-${end}`);
            start = end - overlap;
        }
    }
    return { result, ids };
}
