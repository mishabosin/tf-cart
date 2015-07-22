var Storage = function () {
  this.items = [];
  this.id = 0;
};

Storage.prototype.add = function (name) {
  var item = {name: name, id: this.id};
  this.items.push(item);
  this.id += 1;
  return item;
};

Storage.prototype.remove = function(id) {
  var item = this.items[id];
  //this.items = this.items.splice(id, 1);
  this.items[id] = null;
  return item;
};

Storage.prototype.update = function(id, item) {
  if (id >= this.id) {
    return null;
  }
  this.items[id] = item;
  return item;
};

Storage.prototype.getItems = function() {
  return this.items.filter(function(item) {
    return item !== null;
  });
};

module.exports = Storage;
