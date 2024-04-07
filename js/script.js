import Model from './modules/model.js';
import View from './modules/view.js';
import Controller from './modules/controller.js';
import Sound from './modules/sound.js';

const root = document.getElementById('root');
const options = {
  width: 340,
  height: 420,
  rows: 20,
  colums: 10,
};

const sound = new Sound(root);
const model = new Model(sound);
const view = new View(root, options);
const controller = new Controller(model, view, sound);


window.model = model;
window.view = view;
window.controller = controller;
window.sound = sound;