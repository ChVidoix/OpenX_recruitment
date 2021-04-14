const { _test } = require('../task2');

const assert = require('chai').assert;
const _assert = require('assert');
const sinon = require('sinon');

describe('Checking matchUsersWithPosts() ...', () => {
    const users = [
        {
            id: 1,
            name: 'User1',
            username: "Username1",
            address: {
                geo: {
                    lat: "123.123",
                    lng: "123.123"
                }
            }
        },
        {
            id: 2,
            name: 'User2',
            username: "Username2",
            address: {
                geo: {
                    lat: "123.123",
                    lng: "123.123"
                }
            }
        },
        {
            id: 3,
            name: 'User3',
            username: "Username3",
            address: {
                geo: {
                    lat: "123.123",
                    lng: "123.123"
                }
            }
        }
    ];
    const posts = [
        { id: 1, userId: 1, body: 'post1', title: "title1" },
        { id: 2, userId: 1, body: 'post2', title: "title2" },
        { id: 3, userId: 2, body: 'post3', title: "title3" },
        { id: 4, userId: 2, body: 'post4', title: "title4" }
    ];

    describe('Function is supposed to match users with posts they have written.', () => {
        it('Returnes array containing user id, username, geo position object with lat and lng and posts they have written.', () => {
            assert.deepEqual(_test.matchUsersWithPosts(users, posts), [
                {
                    id: 1,
                    username: 'Username1',
                    geo: { lat: "123.123", lng: "123.123" },
                    posts: [
                        { id: 1, userId: 1, title: "title1" },
                        { id: 2, userId: 1, title: "title2" }
                    ]
                },
                {
                    id: 2,
                    username: 'Username2',
                    geo: { lat: "123.123", lng: "123.123" },
                    posts: [
                        { id: 3, userId: 2, title: "title3" },
                        { id: 4, userId: 2, title: "title4" }
                    ]
                },
                {
                    id: 3,
                    username: 'Username3',
                    geo: { lat: "123.123", lng: "123.123" },
                    posts: []
                }
            ]);
        });
    });

    describe('Returned type should be an array', () => {
        it('should return an array of objects', () => {
            assert.isArray(_test.matchUsersWithPosts(users, posts));
        });
    });
});

describe('Checking checkUniquePosts() ...', () => {
    const samplePosts = [
        { id: 1, title: 'title_1' },
        { id: 1, title: 'title_1' },
        { id: 2, title: 'title_2' },
        { id: 2, title: 'title_2' },
        { id: 2, title: 'title_2' },
        { id: 3, title: 'title_3' },
        { id: 4, title: 'title_4' },
        { id: 5, title: 'title_5' }
    ];

    describe('Checking if function finds repeated titles', () => {
        it('Returned array contains strings describing repeated titles', () => {
            assert.deepEqual(_test.checkUniquePosts(samplePosts), ['title_1', 'title_2']);
        });
    });

    describe('Checking if retured type is empty array', () => {
        it('Returned type is an empty array', () => {
            const posts = [];
            assert.isEmpty(_test.checkUniquePosts(posts));
        });
    })

    describe('Checking if returned type is an array', () => {
        it('Returned type is an array', () => {
            assert.isArray(_test.checkUniquePosts(samplePosts), 'not an array');
        });
    });
});

describe('Checking findClosestUser() ...', () => {
    const users = [
        {
            id: 1,
            username: "username1",
            city: 'Krakow',
            geo: {
                lat: '50.0646501',
                lng: '19.9449799'
            }
        },
        {
            id: 2,
            username: "username2",
            city: 'Warsaw',
            geo: {
                lat: '52.229676',
                lng: '21.012229'
            }
        },
        {
            id: 3,
            username: "username3",
            city: 'Wroclaw',
            geo: {
                lat: '51.1078852',
                lng: '17.0385376'
            }
        }
    ];

    describe('This function is supposed to find user who lives the closest to every user in given table.', function () {
        it('Returns an object containing username as key and object containing information about user and distance between them as value.', function () {
            assert.deepEqual(_test.findClosestUser(users), {
                'username1': {
                    user: {
                        id: 3,
                        username: "username3",
                        city: 'Wroclaw',
                        geo: {
                            lat: '51.1078852',
                            lng: '17.0385376'
                        }
                    },
                    distance: 235688
                },
                'username2': {
                    user: {
                        id: 1,
                        username: "username1",
                        city: 'Krakow',
                        geo: {
                            lat: '50.0646501',
                            lng: '19.9449799'
                        }
                    },
                    distance: 251980
                },
                'username3': {
                    user: {
                        id: 1,
                        username: "username1",
                        city: 'Krakow',
                        geo: {
                            lat: '50.0646501',
                            lng: '19.9449799'
                        }
                    },
                    distance: 235688
                }
            });
        });
    });

    describe('Checking if returned type is not an array', () => {
        it('Returned type is not an array', () => {
            assert.isNotArray(_test.findClosestUser(users), 'not an array');
        });
    });
});

describe('Checking countPosts() ...', () => {
  const users = [
    {
      id: 1,
      username: 'Username1',
      posts: [
        { id: 1, userId: 1, body: 'post1' },
        { id: 2, userId: 1, body: 'post2' },
        { id: 3, userId: 1, body: 'post3' },
        { id: 4, userId: 1, body: 'post4' },
        { id: 5, userId: 1, body: 'post5' }
      ]
    }
  ];

  describe('This function is supposed to print in console information about users and amount of posts they have written.', () => {
    it("Prints username and amount of their posts", () => {
      let spy = sinon.spy(console, 'log');
      _test.countPosts(users);
      const expectedResult = `Username1 napisał(a) 5 postów`;

      _assert(spy.calledWith(expectedResult));
      spy.restore();
    });
  });
});
