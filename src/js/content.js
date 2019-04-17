import algoliasearch from 'algoliasearch';
import instantsearch from 'instantsearch.js';
import { searchBox, hits } from 'instantsearch.js/es/widgets';

import "../css/search.css";

(function() {
  class Content {
    constructor() {
      this.searchClient = algoliasearch(
        'UCDHYKVJUR',
        '5306da260e626d1ab3293ea7d19b4421'
      );

      chrome.storage.local.get(['currentTab'], (result) => {
        this.currentURL = JSON.parse(result.currentTab).url;
      });

      this.create();
    }
    
    async create() {
      console.log('create');
      const url = chrome.extension.getURL('search.html');
      const html = await this.getHTML(url);
      this.injectHTML(html);
      this.initInstantSearch();
    }

    searchFunction(helper) {
      if (helper.getState().query === '') {
        return;    
      } else {
        helper.search();
      }
    }
    
    async getHTML(url = null) {
      const response = await fetch(url);
      return await response.text();
    }
    
    injectHTML(html = null) {
      const body = document.body;
      const firstChild = body.childNodes[0];
      const searchRoot = document.createElement('div');
      searchRoot.innerHTML = html;
      return body.insertBefore(searchRoot, firstChild);
    }

    initInstantSearch() {
      const search = instantsearch({
        indexName: 'shurscador',
        routing: false,
        searchClient: this.searchClient,
        searchFunction: this.searchFunction,
      });
    
      // initialize SearchBox
      search.addWidget(
        searchBox({
          container: '#search-box',
          placeholder: 'Puedes buscar por hilo, respuesta o usuario',
        }),
      );
      
      // initialize hits widget
      search.addWidget(
        hits({
          container: '#hits',
          templates: {
            item: (item) => {
              return `✌🏻 ${item.name}`;
            },
          },
          escapeHTML: true,
        }),
      );
      
      search.start();
    }

  }

  new Content();
})();

// setInterval(() => {
//   const indexName = 'shurscador';
//   const index = searchClient.initIndex(indexName); 
//   index.addObject({ 'culo': 'rana' });
// }, 1000);
