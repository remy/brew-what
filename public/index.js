const button = document.querySelector('button');
const text = document.querySelector('textarea');
const result = document.querySelector('pre');

text.onkeydown = event => {
  if ((event.metaKey || event.ctrlKey) && event.keyCode === 13) {
    button.onclick();
  }
};

text.oninput = () => {
  localStorage.setItem('brew-what-cache', text.value);
};

button.onclick = () => {
  const list = text.value.split('\n').map(_ => _.trim());
  fetch('/', {
    method: 'post',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(list),
  })
    .then(res => res.json())
    .then(res => {
      const html = list
        .map(key => {
          const brew = res[key] || {
            versions: { stable: '?' },
            desc: 'NOT FOUND',
            homepage: '#?',
            className: 'not-found',
          };
          return `<a href="${
            brew.homepage
          }" target="_blank" class="brew ${brew.className ||
            ''}"><span class="name"><span class="key">${key}</span>@${
            brew.versions.stable
          }</span>: <span class="desc">${brew.desc}</span></span>`;
        })
        .join('\n');

      result.innerHTML = html;
      result.hidden = false;
      text.hidden = true;
    });
};

try {
  const cache = localStorage.getItem('brew-what-cache');
  if (cache) {
    text.value = cache.trim();
  }
} catch (e) {}
