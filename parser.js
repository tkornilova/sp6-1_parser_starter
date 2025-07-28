// @todo: напишите здесь код парсера

function parsePage() {
    return {
        meta: getMetaData(),
        product: {},
        suggested: [],
        reviews: []
    };
}

const getMetaData = () => {
    let metaData = {};

    const title = document.head.querySelector('title').textContent.split('—')[0].trim();
    metaData.title = title;

    const description = document.head.querySelector('meta[name="description"]').getAttribute('content');
    metaData.description = description;

    const keywords = document.head.querySelector('meta[name="keywords"]').getAttribute('content').split(', ');
    metaData.keywords = keywords;

    const language = document.querySelector('html').getAttribute('lang');
    metaData.language = language;

    metaData.opengraph = {};

    const opengraphTitle = document.head.querySelector('meta[property="og:title"]').getAttribute('content').split('—')[0].trim();
    metaData.opengraph.title = opengraphTitle;

    const opengraphImg = document.head.querySelector('meta[property="og:image"]').getAttribute('content');
    metaData.opengraph.image = opengraphImg;

    const opengraphType = document.head.querySelector('meta[property="og:type"]').getAttribute('content');
    metaData.opengraph.type = opengraphType;

    return metaData;
}

window.parsePage = parsePage;