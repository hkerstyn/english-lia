let ant = new Container('Ant', [100, 200] );
ant.setRoot('MyDiv');
let bee = new Container('Bee', [50, 70]);
bee.addNextTo('right', ant);
let cicada = new Container('Cicada', [30, 30]);
cicada.addNextTo('down', bee);
cicada.setTab('Bugs');
let dragonfly = new Container('Dragonfly', [100, 70]);
dragonfly.setTab('Bugs');

for (container of [ant, bee, cicada, dragonfly]) {
  container.setClass('lul-light');
}

console.log(ant);


set('Ant', genButton({
  text: 'Tab',
  onclick: function () {
    dragonfly.tabTo(); 
  }
}));
