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

exports.seed = function(knex, Promise) {
  return knex('garage_items')
    .del()
    .then(() => {
      return Promise.all([knex('garage_items').insert([garageItems])]);
    })
    .then(() => console.log('Seeding complete!'))
    .catch(error => console.log(`Error seeding data: ${error}`));
};
