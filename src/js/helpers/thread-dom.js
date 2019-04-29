export default class ThreadDom {
  constructor(document, threadId) {
    this.threadId = threadId;
    this.body = document.body;
  }

  cleanNodes(node) {
    for (var n = 0; n < node.childNodes.length; n ++) {
      const child = node.childNodes[n];
      if (
        (child.nodeType === 8) || 
        (child.nodeType === 3 && !/\S/.test(child.nodeValue))
      ) {
        node.removeChild(child);
        n --;
      } else if (child.nodeType === 1) {
        this.cleanNodes(child);
      } else {
        return node;
      }
    }
  }

  textNodesUnder(el) {
    let n, a = [], walk = document.createTreeWalker(el, NodeFilter.SHOW_ALL, null, false);
    const newLine = '\r\n';
    while (n = walk.nextNode()) {
      if (
        (n.nodeName !== 'BR') &&
        (n.textContent !== ('↵' || '↵↵'))
      ) {
        a.push(n);
      }
    }
    return a;
  }

  get postListTable() {
    return this.body.querySelector('#posts');
  }

  getPostInfo(post) {
    const table = post.querySelector('table');
    if (!table) return null;
    const postAnchor = table.getAttribute('id');
    const postId = postAnchor.split('post')[1];
    const postBody = table.querySelector(`#post_message_${postId}`);
    const postCount = table.querySelector(`#postcount${postId}`);
    const userBody = table.querySelector(`#postmenu_${postId}`);

    const postContent = postBody;
    for (let child of postContent.children) {
      child.remove();
    }

    const postBy = userBody.querySelector('a').innerText;
    const postById = userBody.querySelector('a').getAttribute('href').split('?u=')[1];

    return {
      id: postId,
      anchor: postAnchor,
      postContent: postContent.innerText,
      postBy,
      postById,
      postCount: postCount.innerText,
    }
  }
}