const garageItems = [
  {
    name: 'Bicycle',
    reason: 'For riding, duh',
    cleanliness: 'Dusty'
  },
  {
    name: 'Sewing Machine',
    reason: 'Make all the bow ties!',
    cleanliness: 'Sparkling'
  },
  {
    name: 'Old Compost Bin',
    reason: "It's a bucket",
    cleanliness: 'Rancid'
  }
];

const createGarageItem = (knex, item) => {
  return knex('garage_items').insert(item);
};

exports.seed = function(knex, Promise) {
  return knex('garage_items')
    .del()
    .then(() => {
      let garagePromises = [];

      garageItems.forEach(item => {
        garagePromises.push(createGarageItem(knex, item));
      });

      return Promise.all(garagePromises);
    })
    .then(() => console.log('Seeding complete!'))
    .catch(error => console.log(`Error seeding data: ${error}`));
};
