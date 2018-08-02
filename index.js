const express = require('express');
const { json } = require('body-parser');
const formulas = require('./formula.json');
const app = express();

app.use(express.static(__dirname + '/public'));
app.post('/', json({ type: '*/*' }), (req, res) => {
  res.status(200).json(
    formulas
      .filter(_ => req.body.includes(_.name))
      .map(({ name, full_name, desc, homepage, versions, dependencies }) => ({
        name,
        full_name,
        desc,
        homepage,
        versions,
        dependencies,
      }))
      .reduce((acc, curr) => ({ ...acc, [curr.name]: curr }), {})
  );
});

app.listen(3000);
