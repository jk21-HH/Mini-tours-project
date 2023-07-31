//EXAMPLE!! -> to use it uncomment it

// const fs = require('fs');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// exports.checkID = (req, res, next, val) => {
//   console.log(`Tour id is: ${val}`);

//   if (+req.params.id > tours.length) {
//     // 404 for error

//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid Id',
//     });
//   }

//   next();
// };

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: `Missing information: Name is ${
//         req.body.name ? req.body.name : 'missing'
//       } Price is ${req.body.price ? req.body.price : 'missing'}`,
//     });
//   }

//   next();
// };

// exports.getAllTours = (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     results: tours.length,
//     data: {
//       tours,
//     },
//   });
// };

// exports.getTour = (req, res) => {
//   const id = +req.params.id;

//   const tour = tours.find((el) => el.id === id);

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour,
//     },
//   });
// };

// exports.createTour = (req, res) => {
//   const newId = tours[tours.length - 1].id + 1;
//   const newTour = Object.assign({ id: newId }, req.body);

//   tours.push(newTour);

//   fs.writeFile(
//     `${__dirname}/dev-data/data/tours-simple.json`,
//     JSON.stringify(tours),
//     (err) => {
//       // 201 - for creating

//       res.status(201).json({ status: 'success', data: { tour: newTour } });
//     }
//   );
// };

// exports.editTour = (req, res) => {
//   res.status(200).json({ status: 'success', data: { tour: 'place holder' } });
// };

// exports.deleteTour = (req, res) => {
//   // 204 - for delete

//   res.status(204).json({ status: 'success', data: null });
// };
