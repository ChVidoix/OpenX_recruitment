/**
 * Karol Widuch
 * Recruitment task for OpenX intern. 
 * The program is suposed to fetch data from given URLs about some users and posts, connect corresponding users and posts,
 * count posts writtem by users and return info about it, check unique titles and for every user find the one which lives
 * nearest to them.
 *
 * @typedef {Object} Post           - An object representing single post to operate on in the program
 * @property {Number} id            - Post identifier
 * @property {String} title         - Post title
 * @property {Number} userId        - Post owner's id
 * 
 * @typedef {Post} PostRaw          - An object representing single raw post fetched
 * @property {String} body          - Post body
 * 
 * @typedef {Object} Geo            - An object representing user's homeplace geographical position
 * @property {String} lat           - User's latitude
 * @property {String} lng           - User's longitude
 * 
 * @typedef {Object} Address        - An object representing user's address data
 * @property {String} city          - User's home city
 * @property {Geo} geo              - Geographical position
 * @property {String} street        - User's living street
 * @property {String} suite         - User's suite
 * @property {String} zipcode       - User's home zipcode
 * 
 * @typedef {Object} Company        - An object remresenting user's company
 * @property {String} bs            - User's company short description
 * @property {String} catchPhrase   - User's company catch phrase
 * @property {String} name          - User's company name
 * 
 * @typedef {Object} User           - An object representing single user to operate on in program
 * @property {Number} id            - User's identifier
 * @property {String} username      - User's username
 * @property {Geo} geo              - Geographical position
 * 
 * @typedef {User} UserRaw          - An object representing single raw user fetched
 * @property {Address} address      - User's address data
 * @property {Company} company      - User's company data
 * @property {String} email         - User's email
 * @property {String} name          - User's name
 * @property {String} phone         - User's phone
 * @property {String} website       - User's website
 * 
 * @typedef {Array<User>} Users         - An array with users
 * @typedef {Array<Post>} Posts         - An array with posts
 *
 * @typedef {Array<UserRaw>} UsersRaw   - An array with users
 * @typedef {Array<PostRaw>} PostsRaw   - An array with posts 
 * 
 * @typedef {User} MatchedUserWithPosts - An object containing info about single user and their posts
 * @property {Array<Post>} posts        - User's posts
 * 
 * @typedef {Array<MatchedUserWithPosts>} MatchedUsersWithPosts - An array with marged users with their posts
 */

const fetch = require('node-fetch')

const URL_USERS = 'https://jsonplaceholder.typicode.com/users'
const URL_POSTS = 'https://jsonplaceholder.typicode.com/posts'

/**
 * Asynchronous function fetches data from a given url.
 * @param {string} url - Given url
 * @returns {UsersRaw|PostsRaw} - Response in json
 */
const fetchData = async url => {
    const response = await fetch(url)
    return response.json()
}

/**
 * Function merging users with their posts. Takes raw data and returns essential information about users and posts.
 * @param {UsersRaw} users - An array of raw users data
 * @param {PostsRaw} posts - An array of raw users' posts data
 * @returns {MatchedUsersWithPosts} - Returns array of matched users and posts
 */
const matchUsersWithPosts = (users, posts) => {
    const matched = {}

    for (const post of posts) {
        if (!(post.userId in matched)) {
            matched[post.userId] = []
        }
        matched[post.userId].push({
            id: post.id,
            userId: post.userId,
            title: post.title
        })
    }

    return users.map(user => {
        return {
            id: user.id,
            username: user.username,
            geo: {
                lat: user.address.geo.lat,
                lng: user.address.geo.lng
            },
            posts: matched[user.id] || []
        }
    })
}

/**
 * Function printing information about users and amount of posts they have written.
 * @param {MatchedUsersWithPosts} matched - An array of matched users with their posts
 */
const countPosts = matched => {
    for (const user of matched) {
        console.log(`${user.username} napisał(a) ${user.posts.length} postów`)
    }
}

/**
 * Function checks uniqueness of posts' titles and prints in console repeated titles.
 * @param {Posts} posts - An array containing posts
 */
const checkUniquePosts = posts => {
    const repeatedTitles = []
    const postTitles = posts.map(post => post.title)

    postTitles.forEach((title, index) => {
        if ((postTitles.indexOf(title) !== index) && !(repeatedTitles.includes(title))) {
            repeatedTitles.push(title)
        }
    })
    return repeatedTitles
}

/**
 * Function calculating distance between dwo given points expressed with latitude and longitude using haversine formula.
 * @param {Number} lat1 - First user's latitude
 * @param {Number} lat2 - First user's longitude
 * @param {Number} lng1 - Second user's latitude
 * @param {Number} lng2 - Second user's longitude
 * @returns {Number} - Result distance between given two points
 */
const calculateHaversine = (lat1, lat2, lng1, lng2) => {
    const R = 6371000
    const phi1 = lat1 * Math.PI / 180
    const phi2 = lat2 * Math.PI / 180
    const deltaPhi = (lat2 - lat1) * Math.PI / 180
    const deltaLambda = (lng2 - lng1) * Math.PI / 180

    const a = Math.pow(Math.sin(deltaPhi / 2), 2) + Math.cos(phi1) * Math.cos(phi2) * Math.pow(Math.sin(deltaLambda / 2), 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return Math.round(R * c)
}

/**
 * Function given an array of users looks for the closest neighbour for every user in array.
 * @param {Users} users - An array of users out of which function will find the closest neighbour 
 * @returns {Array<Object<String, Object<String, (User|Number)>>>} - Returns an array of objects containing user's username as a key and object containing information about closest user as a value
 */
const findClosestUser = users => {
    const distances = {}
    const usersCount = users.length

    users.forEach(user => {
        distances[user.username] = { user: null, distance: null }
    })

    for (let i = 0; i < usersCount - 1; ++i) {
        const lat1 = users[i].geo.lat
        const lng1 = users[i].geo.lng
        const username1 = users[i].username

        for (let j = i + 1; j < usersCount; ++j) {
            const lat2 = users[j].geo.lat
            const lng2 = users[j].geo.lng
            const username2 = users[j].username
            const calculatedDistance = calculateHaversine(lat1, lat2, lng1, lng2)

            if (!distances[username1].distance) {
                distances[username1] = {
                    user: users[j],
                    distance: calculatedDistance
                }
            }
            if (!distances[username2].distance) {
                distances[username2] = {
                    user: users[i],
                    distance: calculatedDistance
                }
            }
            if (calculatedDistance < distances[username1].distance) {
                distances[username1] = {
                    user: users[j],
                    distance: calculatedDistance
                }
            }
            if (calculatedDistance < distances[username2].distance) {
                distances[username2] = {
                    user: users[i],
                    distance: calculatedDistance
                }
            }
        }
    }
    return distances
}

/**
 * Main program responsible for coordination and funcion calling
 */
const main = async () => {
    try {
        const posts = await fetchData(URL_POSTS)
        const users = await fetchData(URL_USERS)

        const matched = matchUsersWithPosts(users, posts)

        countPosts(matched)

        const repeatedTitles = checkUniquePosts(posts)
        if (repeatedTitles.length === 0) {
            (console.log("Brak powtarzających się tytułów"))
        } else {
            console.log("Tytuły postów, które nie się powtarzają:")
            repeatedTitles.forEach(postTitle => console.log(postTitle))
        }
        const closestDistances = findClosestUser(matched)
        for (const person1 in closestDistances) {
            console.log(`Najbliżej ${person1} żyje ${closestDistances[person1].user.username}, odległość: ${closestDistances[person1].distance} metrów`)
        }
    } catch (error) {
        console.log(`Error occured: ${error}`)
    }
}

main()

module.exports._test = {
    matchUsersWithPosts: matchUsersWithPosts,
    countPosts: countPosts,
    checkUniquePosts: checkUniquePosts,
    findClosestUser: findClosestUser,
};