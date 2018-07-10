const Twig = require('twig');
const fs = require('fs');
const path = require('path');
const util = require('util');
const less = require('less');
const dirTree = require('directory-tree');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const twigRender = util.promisify(Twig.renderFile);

function Overview({ folder = '/', extensions, exclude, fileName = 'index.html' } = {}) {
  let path_to_folder = path.join(__dirname, folder);
  let path_to_style = path.join(__dirname, '/style/style.less');
  let path_to_index = path.join(__dirname, './template/index.twig');
  let path_to_list_el = path.join(__dirname, './template/list-el.twig');
  let opts = { extensions, exclude };

  async function render() {
    let data = await Promise.all([
      getStyles(),
      getList(dirTree(path_to_folder, opts).children),
    ]);
    let html = await twigRender(path_to_index, {
        less: data[0].css,
        list: data[1],
      }
    );
    generateOutputFile(html);
  }

  async function getStyles() {
    let less_raw = await readFile(path_to_style, 'utf8');
    let css = await less.render(less_raw);
    return css;
  }

  function generateOutputFile(html) {
    writeFile(fileName, html, 'utf8');
  }

  async function getList(arr) {
    arr.sort(sortFileAndFolders);
    arr = await Promise.all(arr.map(async (item) => {
      return await getListEl(item);
    }));
    return arr.join('');
  }

  async function getListEl(el) {
    let list = "";
    if (el.children) {
      list = await getList(el.children);
    }
    let html = await twigRender(path_to_list_el, {
        folder: el.type === 'directory',
        name: el.name,
        children: list,
        link: el.path,
      }
    );
    return html;
  }

  function sortFileAndFolders(a, b) {
    if (a.type === 'directory' && b.type === 'directory') {
      return 0;
    } else if (a.type === 'directory') {
      return -1;
    } else if (b.type === 'directory') {
      return 1;
    } else {
      return 0;
    }
  }

  render();
}

// Overview({
//   exclude: /node_modules/
// });

exports.directoryOverview = Overview;

// TODO добавить обработчики ошибок
// TODO добавить тесты
// TODO вынести тестирование генерации от сюда
