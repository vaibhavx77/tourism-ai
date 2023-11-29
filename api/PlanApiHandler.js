const express = require('express');
const bodyParser = require('body-parser');
const { travelPlanner } = require('./utils.js'); // Replace with the actual path

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
console.log(new Date())

class PlanApiHandler {
    post(req, res) {
        // Parse the request body
        const args = req.body;

        console.log(args);

        // Check if place_ids and schedule are defined for an update
        const update = args.place_ids && args.schedule;
        const message = update
            ? `Update with place_ids: ${args.place_ids.join(',')}, and schedule: ${args.schedule.join(',')}`
            : `Make a new plan from ${args.departure_date || 'N/A'} to ${args.return_date || 'N/A'} in ${args.city || 'N/A'} (${args.start_time || 'N/A'}~${args.back_time || 'N/A'})`;

        // Check if departure_date and return_date are defined
        const dd = args.departure_date ? args.departure_date.split('-').map(e => parseInt(e)) : null;
        const rd = args.return_date ? args.return_date.split('-').map(e => parseInt(e)) : null;

        // If departure_date and return_date are defined, proceed with the rest of the code
        if (dd && rd) {
            // Calculate the number of days
            const n_days = (new Date(rd[0], rd[1] - 1, rd[2]) - new Date(dd[0], dd[1] - 1, dd[2])) / (1000 * 60 * 60 * 24) + 1;

            // Rest of your code...
            const { places, schedule } = travelPlanner(
                            n_days,
                            args.price_level,
                            args.outdoor,
                            args.compactness,
                            args.start_time,
                            args.back_time,
                            args.place_ids,
                            args.schedule
                        );
                
                        

            // Create the final response
            const finalRet = {
                status: 'Success',
                message,
                places,
                schedule,
                // Include n_days in the response if needed
                n_days,
            };

            // Send the response
            res.json(finalRet);
        } else {
            // Handle the case when departure_date or return_date is not defined
            console.error('Invalid date format or missing date values.');
            res.status(400).json({ status: 'Error', message: 'Invalid date format or missing date values.' });
            return;
        }
    }
}

// Export the PlanApiHandler class
module.exports = PlanApiHandler;



// class PlanApiHandler {
//     post(req, res) {
//         const args = req.body;

//         console.log(args);

//         const update = args.place_ids && args.schedule;
//         const message = update
//             ? `Update with place_ids: ${args.place_ids.join(',')}, and schedule: ${args.schedule.join(',')}`
//             : `Make a new plan from ${args.departure_date} to ${args.return_date} in ${args.city} (${args.start_time}~${args.back_time})`;

//         const dd = args.departure_date.split('-').map(e => parseInt(e));
//         const rd = args.return_date.split('-').map(e => parseInt(e));
//         const n_days = (new Date(rd[0], rd[1] - 1, rd[2]) - new Date(dd[0], dd[1] - 1, dd[2])) / (1000 * 60 * 60 * 24) + 1;

//         const { places, schedule } = travelPlanner(
//             n_days,
//             args.price_level,
//             args.outdoor,
//             args.compactness,
//             args.start_time,
//             args.back_time,
//             args.place_ids,
//             args.schedule
//         );

//         const finalRet = {
//             status: 'Success',
//             message,
//             places,
//             schedule,
//         };

//         res.json(finalRet);
//     }
// }

const apiRouter = express.Router();
const planApiHandler = new PlanApiHandler();

apiRouter.post('/plan', (req, res) => planApiHandler.post(req, res));

app.use('/api', apiRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
