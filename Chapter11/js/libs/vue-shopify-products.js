/*!
* Vue Shopify Products
* ====================
*
* Format shopify CSV files into a usable object.
* https://github.com/mikestreety/vue-shopify-products
*
* Copyright 2017 Mike Street
*/

const ShopifyProducts = {
  install(Vue) {
    let generateSlug = function(path) {
      return path
        .toString()
        .trim()
        .toLowerCase()
        .replace(/^\/|\/$/g, '')
        .replace(/ /g, '-')
        .replace(/\//g, '-')
        .replace(/[-]+/g, '-')
        .replace(/[^\w-]+/g, '');
    };

    Vue.prototype.$formatProducts = function(payload) {
      // Create an empty products array
      let products = [];

      // Was it generated using CSV parser?
      // https://github.com/okfn/csv.js
      if (payload.fields) {
        let headers = payload.fields;

        for (let product of payload.records) {
          let output = {};

          headers.forEach((header, index) => {
            output[generateSlug(header)] = product[index];
          });

          products.push(output);
        }
      } else {
        // Or was it d3.js?
        for (let product of payload) {
          let output = {};

          Object.keys(product).forEach(key => {
            output[generateSlug(key)] = product[key];
          });

          products.push(output);
        }
      }

      // Create output, ready to group variations
      let output = {};

      // Loop through each one
      for (let product of products) {
        let handle = product.handle,
          item = output[handle];

        // If it's the first one with this handle, create an entry
        if (!item) {
          item = {
            title: product.title,
            body: product['body-html'],
            handle: handle,
            vendor: {
              title: product.vendor,
              handle: generateSlug(product.vendor)
            },
            tags: product.tags.split(',').map(tag => {
              return {
                title: tag.trim(),
                handle: generateSlug(tag)
              };
            }),
            images: [],
            variationTypes: {},
            variationProducts: []
          };
        }

        // Add type object if it exists
        if (product.type) {
          item.type = {
            title: product.type,
            handle: generateSlug(product.type)
          };
        }

        // Add any images from itself or variations
        if (product['image-src']) {
          item.images.push({
            source: product['image-src'],
            alt: product['image-alt-text']
          });
        }

        // Create any variations as keys for later accessing, e.g.
        // id: 1, value: Color, handle: color
        for (let i = 1; i < 4; i++) {
          if (product.hasOwnProperty('option' + i + '-name') && product['option' + i + '-name'] !== null) {
            item.variationTypes[i] = {
              id: i,
              title: product['option' + i + '-name'],
              handle: generateSlug(product['option' + i + '-name'])
            };
          }
        }

        // Add all variations with the same handle it finds
        // Even the first product itself would be a varation
        let variation = {
          barcode: product['variant-barcode'],
          comaprePrice: product['variant-compare-at-price'],
          grams: product['variant-grams'],
          quantity: product['variant-inventory-qty'],
          price: product['variant-price'],
          shipping: product['variant-requires-shipping'],
          sku: product['variant-sku'],
          taxable: product['variant-taxable'],
          variant: {}
        };

        if (product['variant-image']) {
          variation.image = {
            source: product['variant-image'],
            alt: product.title
          };
        }

        // Create a key value on the variation of name/value e.g color: blue
        for (let v in item.variationTypes) {
          v = item.variationTypes[v];
          if(product['option' + v.id + '-value'] !== null) {
            variation.variant[generateSlug(v.title)] = {
              name: v.value || v.title,
              value: product['option' + v.id + '-value'],
              handle: generateSlug(product['option' + v.id + '-value'])
            };
          }
        }

        // Remove any null values from the variatiomn
        Object.keys(variation).forEach(key => variation[key] == null && delete variation[key]);

        if(variation.sku) {
          item.variationProducts.push(variation);
        }

        // Update the output object
        output[handle] = item;
      }

      return output;
    };
  }
};
