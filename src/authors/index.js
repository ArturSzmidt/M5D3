import express, { json } from 'express';
import fs from 'fs';
import uniqid from 'uniqid';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const _filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);
const authorsFilePath = path.join(_dirname, 'authors.json');
const router = express.Router();

//this will be get all authors
router.get('/', async (req, res, next) => {
  try {
    const fileAsBuffer = fs.readFileSync(authorsFilePath);
    const fileAsString = fileAsBuffer.toString();
    const fileAsJSON = JSON.parse(fileAsString);
    res.send(fileAsJSON);
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});
//this will be get single authors
router.get('/:id', async (req, res, next) => {
  try {
    const fileAsBuffer = fs.readFileSync(authorsFilePath);
    const fileAsString = fileAsBuffer.toString();
    const fileAsJSONArray = JSON.parse(fileAsString);
    const author = fileAsJSONArray.find(
      (author) => author.id === req.params.id
    );
    if (!author) {
      res
        .status(404)
        .send({ message: `Author with ${req.params.id} is not found!` });
    }
    res.send(author);
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});
//this will be post
router.post('/', async (req, res, next) => {
  try {
    const { name, surname, email, dateOfBirth } = req.body;
    const author = {
      id: uniqid(),
      name,
      surname,
      email,
      dateOfBirth,
      avatar: `https://ui-avatars.com/api/?name=${name}+${surname}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const fileAsBuffer = fs.readFileSync(authorsFilePath);
    const fileAsString = fileAsBuffer.toString();
    const fileAsJSONArray = JSON.parse(fileAsString);
    fileAsJSONArray.push(author);
    fs.writeFileSync(authorsFilePath, JSON.stringify(fileAsJSONArray));
    res.send(author);
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});
//this will be delete
router.delete('/:id', async (req, res, next) => {
  try {
    const fileAsBuffer = fs.readFileSync(authorsFilePath);
    const fileAsString = fileAsBuffer.toString();
    let fileAsJSONArray = JSON.parse(fileAsString);

    const author = fileAsJSONArray.find(
      (author) => author.id === req.params.id
    );
    if (!author) {
      res
        .status(404)
        .send({ message: `Author with ${req.params.id} is not found!` });
    }
    fileAsJSONArray = fileAsJSONArray.filter(
      (author) => author.id !== req.params.id
    );
    fs.writeFileSync(authorsFilePath, JSON.stringify(fileAsJSONArray));
    res.status(204).send();
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});
//this will be update
router.put('/:id', async (req, res, next) => {
  try {
    const fileAsBuffer = fs.readFileSync(authorsFilePath);
    const fileAsString = fileAsBuffer.toString();
    const fileAsJSONArray = JSON.parse(fileAsString);
    const authorIndex = fileAsJSONArray.findIndex(
      (author) => author.id === req.params.id
    );
    if (!authorIndex == -1) {
      res
        .status(404)
        .send({ message: `Author with ${req.params.id} is not found!` });
    }
    const previousAuthorData = fileAsJSONArray[authorIndex];
    const changeAuthor = {
      ...previousAuthorData,
      ...req.body,
      updatedAt: new Date(),
      id: req.params.id,
    };
    fileAsJSONArray[authorIndex] = changeAuthor;
    fs.writeFileSync(authorsFilePath, JSON.stringify(fileAsJSONArray));
    res.send(changeAuthor);
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});

export default router;
