export default class Dom {
  constructor(document, forumId) {
    this.forumId = forumId;
    this.body = document.body;
  }

  get threadListTable() {
    return this.body.querySelector('#threadslist');
  }

  get pinnedThreads() {
    const threadList = this.threadListTable;
    return threadList.querySelector(`#collapseobj_st_${this.forumId}`);
  }

  get threads() {
    const threadList = this.threadListTable;
    return threadList.querySelector(`#threadbits_forum_${this.forumId}`);
  }

  getPinnedThreadInfo(thread) {
    let _anchor;
    for (let anchor of thread.querySelectorAll('a')) {
      if (
        (anchor.href !== '#') &&
        (anchor.href.includes('showthread.php')) &&
        (!anchor.href.includes('page=')) &&
        (anchor.innerText !== '1') &&
        (!anchor.href.includes('#post'))
      ) {
        _anchor = anchor;
      }
    }

    const threadId = _anchor.href.split('showthread.php')[1].split('=')[1];
    const title = _anchor.innerText;
    let createdBy = '';
    const authorStarsRow = thread.querySelector(`#td_threadtitle_${threadId}`)
      .children[1]
      .querySelectorAll('span');
    
    for (let column of authorStarsRow) {
      if (column.innerText) createdBy = column.innerText;
    }

    return {
      id: threadId,
      forumId: this.forumId,
      title,
      link: _anchor.href,
      createdBy,
    }
  }

  getThreadInfo(thread) {
    let _anchor;
    for (let anchor of thread.querySelectorAll('a')) {
      if (
        (anchor.href !== '#') &&
        (anchor.href.includes('showthread.php')) &&
        (!anchor.href.includes('page=')) &&
        (anchor.innerText !== '1') &&
        (!anchor.href.includes('#post'))
      ) {
        _anchor = anchor;
      }
    }
    const threadId = _anchor.href.split('showthread.php')[1].split('=')[1];
    const title = _anchor.innerText;
    let createdBy = '';
    const authorStarsRow = thread.querySelector(`#td_threadtitle_${threadId}`)
      .children[1]
      .querySelectorAll('span');
    
    for (let column of authorStarsRow) {
      if (column.innerText) createdBy = column.innerText;
    }

    return {
      id: threadId,
      forumId: this.forumId,
      title,
      link: _anchor.href,
      createdBy,
    }
  }
};
