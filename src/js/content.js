import algoliasearch from 'algoliasearch';
import instantsearch from 'instantsearch.js';
import { searchBox, hits, configure, pagination } from 'instantsearch.js/es/widgets';

import ForumDom from './helpers/forum-dom';
import mapper from './helpers/forum-mapper';
import * as config from '../config/index';

import "../css/search.css";
import ThreadDom from './helpers/thread-dom';

(function() {
  class Content {
    constructor() {
      this.create();
    }
    
    async create() {
      chrome.storage.local.get(['currentTab'], (result) => {
        this.currentURL = JSON.parse(result.currentTab).url;
        if (this.currentURL.includes('forumdisplay')) {
          this.forumCrawl();
        } else if (this.currentURL.includes('showthread')) {
          this.threadCrawl();
        }
      });
      this.searchClient = algoliasearch(config.algolia.appId, config.algolia.readKey);
      const indexName = 'shurscador';
      this.index = this.searchClient.initIndex(indexName); 
      
      const url = chrome.extension.getURL('search.html');
      const html = await this.getHTML(url);
      this.injectHTML(html);
      this.initInstantSearch();
    }

    threadCrawl() {
      let threadId = this.currentURL.split('showthread.php')[1].split('=')[1];
      if (threadId.includes('&')) threadId = threadId.split('&')[0];
      this.threadDom = new ThreadDom(document, threadId);
      this.startThreadCrawling();
    }

    startThreadCrawling() {
      let posts = this.threadDom.postListTable.querySelectorAll('div[align=center]');
      let postsInfo = [];
      for (let post of posts) {
        const info = this.threadDom.getPostInfo(post);
        if (
          info &&
          (info.threadTitle.includes('+18') ||
          info.threadTitle.toLowerCase().includes('+hd') ||
          info.threadTitle.toLowerCase().includes('+prv'))
        ) return;
        if (info && info.postContent.length > 0) postsInfo.push(info);
      }

      this.indexPosts(postsInfo);
    }
    
    forumCrawl() {
      let forumId = this.currentURL.split('forumdisplay.php')[1].split('=')[1];
      if (forumId.includes('&')) forumId = forumId.split('&')[0];
      this.forumDom = new ForumDom(document, forumId);
      if (this.forumDom.isForumToCrawl) this.startForumCrawling();
    }

    startForumCrawling() {
      if (!this.currentURL.includes('&page=')) {
        let pinnedThreads = [];
        for (let pinnedThread of this.forumDom.pinnedThreads.children) {
          if (pinnedThread.querySelector('a')) {
            const pinnedThreadInfo = this.forumDom.getPinnedThreadInfo(pinnedThread);
            pinnedThreads.push(pinnedThreadInfo);
          }
        }
        this.indexPinnedThreads(pinnedThreads);
      }

      let threads = [];
      for (let thread of this.forumDom.threads.children) {
        if (thread.querySelector('a')) {
          const threadInfo = this.forumDom.getThreadInfo(thread);
          threads.push(threadInfo);
        }
      }
      this.indexThreads(threads);
      return;
    }

    async indexPosts(posts) {
      const algoliaObjects = posts.map((post) => {
        return {
          ...post,
          type: 'post',
          lastSeen: new Date(),
          type: 'post',
        }
      });
      var headers = new Headers();
      headers.append('Content-Type', 'application/json');
      const indexResponse = await fetch(`${config.api.baseUrl}/index/post`, {
        method: 'post',
        body: JSON.stringify(algoliaObjects),
        headers,
      });
    }

    async indexPinnedThreads(pinnedThreads) {
      const algoliaObjects = pinnedThreads.map((pinnedThread) => {
        return {
          ...pinnedThread,
          type: 'pinnedThread',
          forumName: mapper.getForumName(parseInt(pinnedThread.forumId, 10)),
          lastSeen: new Date(),
        }
      });
      var headers = new Headers();
      headers.append('Content-Type', 'application/json');
      const indexResponse = await fetch(`${config.api.baseUrl}/index/thread`, {
        method: 'post',
        body: JSON.stringify(algoliaObjects),
        headers,
      });
    }

    async indexThreads(threads) {
      const algoliaObjects = threads.map((thread) => {
        return {
          ...thread,
          type: 'thread',
          forumName: mapper.getForumName(parseInt(thread.forumId, 10)),
          lastSeen: new Date(),
        }
      });
      var headers = new Headers();
      headers.append('Content-Type', 'application/json');
      const indexResponse = await fetch(`${config.api.baseUrl}/index/thread`, {
        method: 'post',
        body: JSON.stringify(algoliaObjects),
        headers,
      });
    }

    searchFunction(helper) {
      if (helper.getState().query === '') {
        if (document.querySelector('.ais-Hits')) {
          document.querySelector('.ais-Hits').remove();
          document.querySelector('.ais-Pagination').remove();
        }
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
      const wrapper = document.createElement('div');
      wrapper.classList.add('page-wrapper');
      wrapper.innerHTML = body;
      document.body.innerHTML = `<div class="page-wrapper">${body.innerHTML}</div>`;
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
            item:
              `
                <div>
                  ✉️
                  <a href="https://www.forocoches.com/foro/forumdisplay.php?f={{forumId}}" target="_blank">{{forumName}}</a>
                  >
                  {{#title}}
                    <a href="https://www.forocoches.com/foro/showthread.php?t={{objectID}}" target="_blank">
                      {{#helpers.highlight}}{ "attribute": "title" }{{/helpers.highlight}}
                    </a>
                  {{/title}}
                  {{#threadTitle}}
                    <a href="https://www.forocoches.com/foro/showthread.php?t={{threadId}}" target="_blank">
                      {{#helpers.highlight}}{ "attribute": "threadTitle" }{{/helpers.highlight}}
                    </a>
                  {{/threadTitle}}
                  >
                  {{#postContent}}
                    <a href="https://www.forocoches.com/foro/showthread.php?t={{threadId}}#post{{objectID}}" target="_blank">
                      {{#helpers.snippet}}{ "attribute": "postContent" }{{/helpers.snippet}}
                    </a>
                  {{/postContent}}
                  <a href="https://www.forocoches.com/foro/member.php?u={{createdById}}" target="_blank">
                    {{#createdBy}}
                      @{{#helpers.highlight}}{ "attribute": "createdBy" }{{/helpers.highlight}}
                    {{/createdBy}}
                    {{^createdBy}}
                      @{{#helpers.highlight}}{ "attribute": "postBy" }{{/helpers.highlight}}
                    {{/createdBy}}
                  </a>
                </div>
              `
          },
          escapeHTML: true,
        }),
      );

      search.addWidget(
        pagination({
          container: '#pagination',
        }),
      );

      search.addWidget(
        configure({
          hitsPerPage: 10,
        }),
      );
      
      search.start();
    }

  }

  new Content();
})();
