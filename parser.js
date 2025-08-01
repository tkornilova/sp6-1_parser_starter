// @todo: напишите здесь код парсера

function parsePage() {
    return {
        meta: getMetaData(),
        product: getProductData(),
        suggested: getSuggestedData(),
        reviews: getReviewData(),
    };
}

const getMetaData = () => {
    const metaData = {};

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

const getProductData = () => {
    const productData = {};

    const product = document.querySelector('.product');

    productData.id = product.dataset.id;
    productData.name = product.querySelector('.title').textContent;
    productData.isLiked = product.querySelector('button.like').classList.contains('active');

    productData.tags = {};
    const tags = product.querySelector('.tags').children;
    [...tags].forEach(tag => {
        const tagCategory = tag.className;
        if (!productData.tags[tagCategory] && tagCategory === 'green') {
            productData.tags.category = [];
        }  else if (!productData.tags[tagCategory] && tagCategory === 'blue') {
            productData.tags.label = [];
        }  else if (!productData.tags[tagCategory] && tagCategory === 'red') {
            productData.tags.discount = [];
        }

        if (tagCategory === 'green') {
            productData.tags.category.push(tag.textContent)
        } else if (tagCategory === 'blue') {
            productData.tags.label.push(tag.textContent)
        } else if (tagCategory === 'red') {
            productData.tags.discount.push(tag.textContent)
        }
    });

    const currencyLabel = [...product.querySelector('.price').firstChild.textContent.trim()][0];
    if (currencyLabel === '₽') {
        productData.currency = 'RUB';
    } else if (currencyLabel === '€') {
        productData.currency = 'EUR';
    } else if (currencyLabel === '$') {
        productData.currency = 'USD';
    }

    productData.price = Number(product.querySelector('.price').firstChild.textContent.trim().replace(currencyLabel, ''));
    productData.oldPrice = Number(product.querySelector('.price span').textContent.trim().replace(currencyLabel, ''));
    productData.discount = productData.oldPrice - productData.price;
    productData.discountPercent = ((1 - productData.price / productData.oldPrice) * 100).toFixed(2) + '%';

    const properties = product.querySelector('.properties').children;
    productData.properties = {};
    [...properties].forEach(property => {
        const propertyKey = property.firstElementChild.textContent;
        const propertyValue = property.lastElementChild.textContent;

        if (!productData.properties[propertyKey]) {
            productData.properties[propertyKey] = propertyValue
        }
    });

    function cleanHTML(str) {
        const container = document.createElement('div');
        container.innerHTML = str;

        container.querySelectorAll('*').forEach(el => {
            while (el.attributes.length > 0) {
            el.removeAttribute(el.attributes[0].name);
            }
        });

        return container.innerHTML.trim();
    }
    let description = product.querySelector('.description').innerHTML;
    productData.description = cleanHTML(description);

    productData.images = [];
    const images = product.querySelectorAll('.preview nav img');
    images.forEach(image => {
        let imageDescription = {};

        imageDescription.preview = image.src;
        imageDescription.alt = image.alt;
        imageDescription.full = image.dataset.src;

        productData.images.push(imageDescription);
    });

    return productData;
}

const getSuggestedData = () => {
    const suggestedData = [];
    const suggestedItems = document.querySelector('.suggested .items').children;

    [...suggestedItems].forEach(item => {
        const itemDescription = {};

        itemDescription.name = item.querySelector('h3').textContent;
        itemDescription.description = item.querySelector('p').textContent;
        itemDescription.image = item.querySelector('img').src;

        const currencyLabel = item.querySelector('b').textContent.trim()[0];
        if (currencyLabel === '₽') {
            itemDescription.currency = 'RUB';
        } else if (currencyLabel === '€') {
            itemDescription.currency = 'EUR';
        } else if (currencyLabel === '$') {
            itemDescription.currency = 'USD';
        }
        itemDescription.price = item.querySelector('b').textContent.trim().replace(currencyLabel, '');

        suggestedData.push(itemDescription);
    });

    return suggestedData;
}

const getReviewData = () => {
    const reviewData = [];

    const reviews = document.querySelector('.reviews .items').children;

    [...reviews].forEach(review => {
        const reviewDescription = {}

        let rating = 0;
        const stars = review.querySelector('.rating').children;
        if (stars) {
            [...stars].forEach(star => star.classList.contains('filled') ? rating++ : rating);
        }
        reviewDescription.rating = rating;

        reviewDescription.author = {};
        reviewDescription.author.avatar = review.querySelector('.author img').src;
        reviewDescription.author.name = review.querySelector('.author span').textContent;
        reviewDescription.date = review.querySelector('.author i').textContent.replace('/', '.').replace('/', '.');
        reviewDescription.title = review.querySelector('.title').textContent;
        reviewDescription.description = review.querySelector('.title').nextElementSibling.textContent;

        reviewData.push(reviewDescription);
    });
    return reviewData;
}

window.parsePage = parsePage;