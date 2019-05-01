export default class ForumDom {
  constructor(document, forumId) {
    this.forumId = forumId;
    this.body = document.body;
    this.isForumToCrawl = document.body.querySelector('#threadslist') ? true : false;
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
    let createdBy = '', createdById;
    const authorStarsRow = thread.querySelector(`#td_threadtitle_${threadId}`)
      .children[1]
      .querySelectorAll('span');
    
    for (let column of authorStarsRow) {
      if (column.innerText) createdBy = column.innerText;
      const onclick = column.getAttribute('onclick');
      if (onclick) {
        createdById = onclick.split('?u=')[1].split('\',')[0];
      }
    }

    return {
      id: threadId,
      forumId: this.forumId,
      title,
      createdBy,
      createdById,
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
    let createdBy = '', createdById = 0;
    const authorStarsRow = thread.querySelector(`#td_threadtitle_${threadId}`)
      .children[1]
      .querySelectorAll('span');

    for (let column of authorStarsRow) {
      if (column.innerText) {
        createdBy = column.innerText;
        const onclick = column.getAttribute('onclick');
        if (onclick) {
          createdById = onclick.split('?u=')[1].split('\',')[0];
        }
      }
    }

    return {
      id: threadId,
      forumId: this.forumId,
      title,
      createdBy,
      createdById,
    }
  }
};
