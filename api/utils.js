const fs = require('fs');
const path = require('path');

// Helper functions for computations
function getEuclideanDistance(coordinateA, coordinateB) {
    const differenceX = coordinateA[0] - coordinateB[0];
    const differenceY = coordinateA[1] - coordinateB[1];
    return Math.sqrt(differenceX * differenceX + differenceY * differenceY);
}

function stateCount(state) {
    let count = -1;
    while (state) {
        count += state % 2;
        state = Math.floor(state / 2);
    }
    return count;
}

// Spots selection functions
function getTypeListByCompactness(compactness, startTime, backTime) {
    const typeList = [];
    let restaurantAndHotelCnt = 0;

    if (startTime && backTime && startTime.length >= 2 && backTime.length >= 2) {
        if (parseInt(startTime.slice(0, 2)) < 11) {
            if (compactness > 0.4) typeList.push('A');
        }
        if (parseInt(startTime.slice(0, 2)) < 13) {
            typeList.push('R');
            for (let i = 0; i < compactness * 3 + 1; i++) {
                typeList.push('A');
            }
            restaurantAndHotelCnt += 1;
        }
        if (parseInt(backTime.slice(0, 2)) > 18) {
            typeList.push('R');
            if (compactness > 0.5) typeList.push('A');
            restaurantAndHotelCnt += 1;
        }
        if (parseInt(backTime.slice(0, 2)) > 23) {
            typeList.push('H');
            restaurantAndHotelCnt += 1;
        }
    }

    return [typeList, typeList.length - restaurantAndHotelCnt];
}


// Main travel planning function
function travelScheduler(numDays, startTime, backTime, compactness, candRate, typeList, numAttractions, attractions, restaurants, hotels) {
    let schedule = [];
    for (let day = 0; day < numDays; day++) {
        let dayStart = "0000", dayEnd = "2400";
        if (day === 0) dayStart = startTime;
        if (day === numDays - 1) dayEnd = backTime;
        const [dayTypeList, types] = getTypeListByCompactness(compactness, dayStart, dayEnd);
        const spots = attractions.slice(day * numAttractions, (day + 1) * numAttractions)
            .concat(restaurants.slice(day * candRate * 2, (day + 1) * candRate * 2))
            .concat([hotels[0]]);
        schedule = schedule.concat(shortestPathsRecommendation(spots, dayTypeList));
    }
    const places = attractions.concat(restaurants).concat(hotels);
    return { places, schedule };
}

// Spots selection functions
function aggregateRating(spot, places = null) {
    // Reference Google users rating
    let aggregateRating = Math.exp(spot.rating / 2);
    // Reference app user input
    if (places !== null && places.includes(spot)) {
        aggregateRating += 1000;
    }
    // May add other criteria by collecting past usage information
    return aggregateRating;
}

function spotSelection(spots, numItems, places = null) {
    // Randomized selection with sampling higher rating with higher chance
    let randomizedSpots = spots.slice();
    for (let spotIndex = 0; spotIndex < randomizedSpots.length; spotIndex++) {
        randomizedSpots[spotIndex].customizedRating = aggregateRating(randomizedSpots[spotIndex], places) + Math.random();
    }
    randomizedSpots.sort((a, b) => b.customizedRating - a.customizedRating);
    const selectedSpots = randomizedSpots.slice(0, numItems);
    return selectedSpots.sort((a, b) => a.geometry.location.lat - b.geometry.location.lat);
}

function getRestaurantsByPriceLevel(restaurants, priceLevel, numItems, places = null) {
    // Filter by indicated price level
    if (priceLevel === 0) priceLevel = null;
    const satisfiedRestaurants = restaurants.filter(r => r.price_level === priceLevel);
    return spotSelection(satisfiedRestaurants, numItems, places);
}

function getAttractionsByOutdoor(attractions, outdoor, numItems, places = null) {
    // Split into indoor and outdoor attractions by indicated ratio
    const indoorAttractionsTypes = ['place_of_worship', 'museum', 'premise', 'zoo', 'movie_theater', 'bakery'];
    const indoorAttractions = [];
    const outdoorAttractions = [];
    const numOutdoor = Math.floor(outdoor * numItems);
    const numIndoor = numItems - numOutdoor;
    for (const attraction of attractions) {
        const isIndoor = indoorAttractionsTypes.some(type => attraction.types.includes(type));
        if (isIndoor) {
            indoorAttractions.push(attraction);
        } else {
            outdoorAttractions.push(attraction);
        }
    }
    const indoorSelection = spotSelection(indoorAttractions, numIndoor, places);
    const outdoorSelection = spotSelection(outdoorAttractions, numOutdoor, places);
    const totalSelection = indoorSelection.concat(outdoorSelection);
    return totalSelection.sort((a, b) => a.geometry.location.lat - b.geometry.location.lat);
}

// Minimal cost arrangement functions
function costCriteria(spotA, spotB) {
    // Consider geographical distance
    const { lat: ax, lng: ay } = spotA.geometry.location;
    const { lat: bx, lng: by } = spotB.geometry.location;
    const geographicalDistance = getEuclideanDistance([ax, ay], [bx, by]);
    // May consider other criteria by collecting past usage information
    return geographicalDistance;
}

function shortestPathsRecommendation(spots, typeRequirement) {
    const numSpots = spots.length;
    const numVisiting = typeRequirement.length;
    const numStates = 2 ** numSpots;
    const dpStateSingle = Array.from({ length: numSpots }, () => [1e18, -1]);
    const dpStates = Array.from({ length: numStates }, () => dpStateSingle.slice());

    for (let spotId = 0; spotId < numSpots; spotId++) {
        if (spots[spotId].id[0] === typeRequirement[0]) {
            dpStates[2 ** spotId][spotId] = [0, 0];
        }
    }

    let bestFinalState = [1e18, 0, 0];

    for (let visitOrder = 1; visitOrder < numVisiting; visitOrder++) {
        for (let state = 0; state < numStates; state++) {
            if (stateCount(state) !== visitOrder) continue;
            for (let spotId = 0; spotId < numSpots; spotId++) {
                const spot = spots[spotId];
                if (spot.id[0] !== typeRequirement[visitOrder] || !(2 ** spotId & state)) continue;

                const pastState = state - 2 ** spotId;
                let bestPlan = [1e18, -1];

                for (let sourceId = 0; sourceId < numSpots; sourceId++) {
                    if (!(2 ** sourceId & pastState)) continue;
                    const [pastCost, pastEndpoint] = dpStates[pastState][sourceId];
                    const curCost = costCriteria(spots[sourceId], spots[spotId]);

                    if (pastCost + curCost < bestPlan[0]) {
                        bestPlan = [pastCost + curCost, sourceId];
                    }
                }

                dpStates[state][spotId] = bestPlan;

                if (visitOrder === numVisiting - 1 && bestPlan[0] < bestFinalState[0]) {
                    bestFinalState = [bestPlan[0], state, spotId];
                }
            }
        }
    }

    const routes = [];
    let finalState = [bestFinalState[1], bestFinalState[2]];

    while (finalState[0]) {
        const spotId = spots[finalState[1]].id;
        routes.unshift(spotId);
        const nextState = [finalState[0] - 2 ** finalState[1], dpStates[finalState[0]][finalState[1]][1]];
        finalState = nextState;
    }

    return routes;
}

// Main planner function
function travelPlanner(numDays, priceLevel, outdoor, compactness, startTime, backTime, placeIds = null) {
    // Read parsed data from file
    const dataPath = path.join(__dirname, './data');
    const objects = {
        'A': JSON.parse(fs.readFileSync(path.join(dataPath, 'Attraction.json'), 'utf-8')),
        'H': JSON.parse(fs.readFileSync(path.join(dataPath, 'Homestay.json'), 'utf-8')),
        'R': JSON.parse(fs.readFileSync(path.join(dataPath, 'Restaurant.json'), 'utf-8')),
    };

    if (placeIds === null) {
        const candRate = 2;
        const [typeList, numAttractions] = getTypeListByCompactness(compactness, "0000", "2400");
        const attractions = getAttractionsByOutdoor(objects['A'], outdoor, numDays * numAttractions * candRate);
        const restaurants = getRestaurantsByPriceLevel(objects['R'], priceLevel, numDays * candRate * 2);
        const hotels = spotSelection(objects['H'], candRate);
        return travelScheduler(numDays, startTime, backTime, compactness, candRate, typeList, numAttractions, attractions, restaurants, hotels);
    } else {
        const places = placeIds.map(placeId => objects[placeId[0]][parseInt(placeId.slice(1))]);
        const candRate = 1;
        const [typeList, numAttractions] = getTypeListByCompactness(compactness, "0000", "2400");
        const attractions = getAttractionsByOutdoor(objects['A'], outdoor, numDays * numAttractions * candRate, places);
        const restaurants = getRestaurantsByPriceLevel(objects['R'], priceLevel, numDays * candRate * 2, places);
        const hotels = spotSelection(objects['H'], candRate, places);
        return travelScheduler(numDays, startTime, backTime, compactness, candRate, typeList, numAttractions, attractions, restaurants, hotels);
    }
}

// Example usage
// const result = travelPlanner(3, 2, 0.7, 0.8, "0900", "2100");
// console.log(result);

module.exports = { travelPlanner };
