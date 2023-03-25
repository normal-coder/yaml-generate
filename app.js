const express = require('express');
const app = express();

const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');

const directory = __dirname + '/compass-projects-information/collections';

app.get('/', (req, res) => {
    const filePath = path.join(__dirname,'app.html');
    res.sendFile(filePath);
});

app.get('/getYamlList', (req, res) => {
    const files = fs.readdirSync(directory).filter(file => file.endsWith('.yml'));
    const data = files.map(file => {
        const content = fs.readFileSync(`${directory}/${file}`, 'utf8');
        const { ident, name, name_cn, slug, items } = yaml.load(content);
        return { filename: file, ident, name_cn };
    });
    res.json(data);
});

app.get('/getYaml/:filename', (req, res) => {
    const { filename } = req.params;
    const file = `${directory}/${filename}`;
    if (!fs.existsSync(file)) {
        res.json({ ident: '', name: '', name_cn: '', slug: '', items: '' });
    } else {
        const content = fs.readFileSync(file, 'utf8');
        const { ident, name, name_cn, slug, items } = yaml.load(content);
        res.json({ ident, name, name_cn, slug, items });
    }
});

app.post('/saveYaml', express.json(), (req, res) => {
    const { filename, yaml: content } = req.body;
    const file = `${directory}/${filename}`;

    let saveType;
    if (!fs.existsSync(file)) {
        saveType = '新增';
    } else {
        saveType = '保存';
    }
    fs.writeFileSync(file, content);
    const content_after = fs.readFileSync(file, 'utf8');
    const { ident, name, name_cn, slug, items } = yaml.load(content_after);
    res.json({ save_type: saveType, ident, name, name_cn, slug, items });
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});