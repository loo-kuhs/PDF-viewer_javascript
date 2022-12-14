const zoomButton = document.getElementById("zoom");
const input = document.getElementById("inputFile");
const openFile = document.getElementById("openPDF");
const currentPage = document.getElementById("current_page");
const viewer = document.querySelector(".pdf-viewer");
let currentPDF = {};

/**
 * * It resets the currentPDF object to its default values.
 */
function resetCurrentPDF() {
  currentPDF = {
    file: null,
    countOfPages: 0,
    currentPage: 1,
    zoom: 1.5,
  };
}

openPDF.addEventListener("click", () => {
  input.click();
});

document.getElementById("next").addEventListener("click", () => {
  const isValidPage = currentPDF.currentPage < currentPDF.countOfPages;
  if (isValidPage) {
    currentPDF.currentPage += 1;
    renderCurrentPage();
  }
});

zoomButton.addEventListener("input", () => {
  if (currentPDF.file) {
    document.getElementById("zoomValue").innerHTML = zoomButton.value + "%";
    currentPDF.zoom = parseInt(zoomButton.value) / 100;
    renderCurrentPage();
  }
});

document.getElementById("previous").addEventListener("click", () => {
  const isValidPage = currentPDF.currentPage - 1 > 0;
  if (isValidPage) {
    currentPDF.currentPage -= 1;
    renderCurrentPage();
  }
});

input.addEventListener("change", (event) => {
  const inputFile = event.target.files[0];
  if (inputFile.type === "application/pdf") {
    const reader = new FileReader();
    reader.readAsDataURL(inputFile);
    reader.onload = () => {
      loadPDF(reader.result);
      zoomButton.disabled = false;
    };
  } else {
    alert("The file you selected is not a pdf file!");
  }
});

/**
 * * It takes a PDF file as input, and then renders the first page of the PDF file 
 * * in the viewer.
 * @param data - The data of the PDF file.
 */
function loadPDF(data) {
  resetCurrentPDF();
  const pdfFile = pdfjsLib.getDocument(data);
  pdfFile.promise.then((doc) => {
    currentPDF.file = doc;
    currentPDF.countOfPages = doc.numPages;
    viewer.classList.remove("hidden");
    document.querySelector("main h3").classList.add("hidden");
    renderCurrentPage();
  });
}

/**
 * * Render the current page of the current PDF file at the current zoom level.
 */
function renderCurrentPage() {
  currentPDF.file.getPage(currentPDF.currentPage).then((page) => {
    const context = viewer.getContext("2d");
    const viewPort = page.getViewport({ scale: currentPDF.zoom });
    viewer.height = viewPort.height;
    viewer.width = viewPort.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewPort,
    };
    page.render(renderContext);
  });
  currentPage.innerHTML =
    currentPDF.currentPage + " of " + currentPDF.countOfPages;
}