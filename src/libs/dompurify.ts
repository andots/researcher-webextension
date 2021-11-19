import DOMPurify from 'dompurify';
import { htmlEscape } from 'escape-goat';

const myDOMPurify = DOMPurify;

myDOMPurify.setConfig({
  WHOLE_DOCUMENT: false, // ! no html, head, body
  USE_PROFILES: { html: true },
  FORBID_TAGS: ['style'],
  FORBID_ATTR: ['style', 'id', 'class'], // ! no style, id, class attributes
  ALLOW_DATA_ATTR: false, // ! no data attributes
});

myDOMPurify.addHook('afterSanitizeAttributes', (node) => {
  // set all elements owning target to target=_blank
  if ('target' in node) {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  }

  if (
    !node.hasAttribute('target') &&
    (node.hasAttribute('xlink:href') || node.hasAttribute('href'))
  ) {
    // set non-HTML/MathML links to xlink:show=new
    node.setAttribute('xlink:show', 'new');
  }

  // ! remove all html tags in <pre> and <code> from innerHTML for HilightJS
  if (node.tagName === 'PRE' || node.tagName === 'CODE') {
    if (node.textContent) {
      // ! use textContent as innerHTML and make sure it's escaped
      node.innerHTML = htmlEscape(node.textContent);
    }
  }

  // ! remove empty node without image tag
  if (!node.hasChildNodes() && !node.textContent && node.tagName !== 'IMG') {
    node.remove();
  }

  // ! remove node if textContent only has \s+
  if (node.textContent) {
    const regex = new RegExp(/^\s+$/);
    if (regex.test(node.textContent)) {
      node.remove();
    }
  }
});

export default myDOMPurify;
