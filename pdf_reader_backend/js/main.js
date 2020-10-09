const url = '../docs/Getting-Things-Done8freebooks.net_.pdf';

let pdfDoc = null,
    pageNum = 1,
    pageRend = false,
    pageNumPending = null;

const scale = 3.05,
    canvas = document.getElementById('pdf-render'),
    ctx = canvas.getContext('2d'),
    canvasCtx = ctx;

//rendering the page
const renderPage = num => {
    pageRend = true;
    //getting page
    pdfDoc.getPage(num).then(page => {
        //setting scale
        const viewport = page.getViewport({scale});
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderCtx = {
            canvasContext: ctx,
            viewport
        };

        page.render(renderCtx).promise.then(() => {
            pageRend = false;
            if(pageNumPending !== null) {
                renderPage(pageNumPending);
                pageNumPending = null;
            }
       });

       //outputting current page
       document.getElementById('page-num').textContent = num;
    });
};

//checking for pages rendering
const queueRendPage = num => {
    if(pageRend) {
        pageNumPending = num;
    } else {
        renderPage(num);
    }
}

//moving to previous page
const prevPage = () => {
    if(pageNum <= 1){
        return;
    }
    pageNum--;
    queueRendPage(pageNum);
}

//moving to next page
const nextPage = () => {
    if(pageNum >= pdfDoc.numPages){
        return;
    }
    pageNum++;
    queueRendPage(pageNum);
}

//getting the document
pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
   pdfDoc = pdfDoc_;
   
   document.getElementById('page-count').textContent = pdfDoc.numPages;
   renderPage(pageNum);
})
  .catch(err => {
      //displaying error
      const div = document.createElement('div');
      div.className = 'error';
      div.appendChild(document.createTextNode(err.message));
      document.querySelector('body').insertBefore(div, canvas);
      //removing top bar
      document.getElementsByClassName('top-bar')[0].style.display = 'none';
  });

//assigning events to buttons
document.getElementById('prev-page').addEventListener('click', prevPage);
document.getElementById('next-page').addEventListener('click', nextPage);
