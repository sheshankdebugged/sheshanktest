OKCupidjs
=========
Automate your OKCupid Activity. This is an API Wrapper for OkCupid App, allowing you to automate processes and collect data for further analysis.

We're on Slack!
===============
Talk about the project on our slack: 
https://publicslack.com/slacks/okcupidjs/invites/new


Installation
===========
`npm install --save okcupidjs`


Usage
=====

All methods are asynchronous, and will return a standard `(err, res, body)` params to your callback. The body will already be json parsed into a json object for easy handling. The following demonstrates how to require and instantiate OKCupidjs.

```javascript
var OKCupid = require('okcupidjs')

var okc = new OKCupid()

okc.login("username", "password", function(err, res, body) {
  console.log("done!");
});
```

The library may be converted to a promise-style API by using a promise library like [bluebird.js](http://bluebirdjs.com/docs/features.html#promisification-on-steroids). This is an example using bluebird:

```javascript
var OKCupid = require('okcupidjs');
var Promise = require('bluebird');

var okc = Promise.promisifyAll(new OKCupid());

okc.loginAsync("username", "password").then(function(done) {
  console.log("done!");
});
```

Methods
=======

Working endpoints as of 9/21/18

|Title|Method|Works?|Comment|
|-----|------|:----:|-------|
[Login](#login)					|`.login(username, password, callback)` 	|✅|
[Get Quickmatch](#get-quickmatch)		|`.getQuickmatch(callback)`			|✅|	
[Visit User](#visit-user)			|`.visitUser(username, callback)` 		|❌| 	needs the okc_api=1 and returns nothing
[Like](#like)					|`.like(user_id, callback)` 			|✅|	
[Unlike](#unlike)				|`.unlike(user_id, callback)` 			|✅|	
[Get User's Profile](#get-users-profile)	|`.getUserProfile(username, callback)` 		|❌|	Always returns html, newline if okc_api
[Get User's Questions](#get-users-questions)	|`.getUserQuestions(username, options, callback)` 	|✅|
[Get Visitors](#get-visitors)			|`.getVisitors(callback)` 			|❌| 	get JSON OKC developer/recruiting message
[Send Message](#send-message)			|`.sendMessage(user_id, message_body, callback)`|✅| 	
[Get Recent Messages](#get-recent-messages)	|`.getRecentMessages(callback)`			|❌| 	route changed
[Search (Browse Matches)](#search-browse-matches)	|`.search(options, callback) `			|✅|	
[Get Message Thread](#edit-profile)		|`.getMessageThread(thread_id, callback)` 	|✅|	adjusted to use oauth routes
[Edit Profile](#edit-profile)			|`.editProfile(edit_category, options, callback)`|✅|	adjusted to use oauth routes
[Get Likes](#get-likes)				|`.getLikes(options, callback)`			|✅|

---
### Login

`.login(username, password, callback)`

Call this first to authenticate before calling other methods.

Takes a username and password, the same ones you use to login on the okc website.

Upon success, response will automatically store a cookie for subsequent requests.

---
### Get Quickmatch

`.getQuickmatch(callback)`

This is the method you want to call first.
It gets you a new user in the area. Json body will contain target_userid and username for you to call `.rate`, `.visitUser`, `.getUserProfile`.

*Username is obtained via `body.sn`*

*Target_userid is obtained via `body.tuid`*

---
### Visit User

`.visitUser(username, callback)`

Takes a username. This visit method will emulate you actually visiting the user via browser.

*Will register on the user's visitors list,* so they will know you visited them.

---
### Like

`.like(user_id, callback)`

Takes a username. Will cause you to like the user associated with that user ID.

---
### Unlike

`.unlike(user_id, callback)`

Takes a user ID. Will cause you to unlike the user associated with that user ID. 

---
### Get User's Profile
`.getUserProfile(username, callback)`

Returns a json of the user profile. Contains all the information as you would see if you visited the user's profile via browser. This will not register your name under the user's "visitor" list.

---
### Get User's Questions
`.getUserQuestions(username, options, callback)`

Returns a json of user question/answer data.

The results come back with a page hash. To get the next page results, this method can be called again with an additional `after` field set in the options object. The value should be set to the value stored in `body.paging.after`. This process can be iterated to produce all search results.

The same process can also be applied in reverse with `before`. 

```
okc.getUserQuestions(username, 1, cb) // First 10 questions
okc.getUserQuestions(username, 11, cb) // Next 10 questions
// Etc...
```

*Total number of questions for a user is obtained via `body.pagination.raw.total_num_results`*

---
### Get Visitors
`.getVisitors(callback)`

Returns a list of your "stalkers" who have visited you.

---
### Send Message
`.sendMessage(user_id, message_body, callback)`

Send a message to a user. 

---
### Get Recent Messages
`.getRecentMessages(callback)`

Body parameter contains metadata about the inbox and a collection of the first 30 message objects in the inbox.

The data structure with important members shown is:

```javascript
{
	messages: [ ... ], // collection of inbox message objects
	num_threads: ..., // number of threads in the inbox
	numunread: ..., // number of undread threads
	pct_full: ..., // percentage full 
}
```

An inbox message object will contain metadata about the message and a snippet of the message body. The full body can be accessed by using `getMessageThread`. The following structure shows some of the important members in a message object:

```javascript
{
	is_new: ..., // 0 or 1
	person: ..., // username of the other person
	personid: ..., // user id of the other person
	snippet: ..., // short preview of the message body
	thread_id: ..., // thread ID
	timestamp: ..., // time stamp
	status: ..., // string status of message, will be "repliedMessage" if message has been replied to
}
```

---
### Get Message Thread
`getMessageThread(thread_id, callback)`

Get the message thread (all sent and received messages) with a thread ID. Body parameter contains metadata about the thread and a collection of message objects.

The data structure with important members shown is:

```javascript
{
	buddyname: ..., // username of the other person 
	num_msg: ..., // number of messages in the thread
	messages: [ ... ], // collection of thread message objects
}
```

A thread message object contains metadata about the message and the complete message body.

The data structure with important members shown is:

```javascript
{
	timestamp: ..., 
	receiver_name: ..., 
	sender_name: ..., 
	msgid: ..., // a message ID
	rawbody: ... // complete body of the message
}
```

Usage Note: The thread ID can be collected from an inbox message object. Get the most recent messages with `getRecentMessages`.

---
### Search (Browse Matches)

`.search(options, callback)`

Perform a search as if visiting "Browse Matches" tab on the website. Search takes a options for determining filters, order, etc.

```javascript
{
	// Primary filter
	"order_by": "SPECIAL_BLEND", // "LOGIN" | "MATCH_AND_DISTANCE" | "ENEMY" | "MATCH" 
	"i_want": "women", // "men" {
	"they_want": "men", // "women" | "everyone"
	"minimum_age": 18,
	"maximum_age": 40,
	"radius": 25, // miles from location
	"last_login": 86400, // seconds since last login

	// Looks filter
	// Height: each inch is 254
	// e.g. 5'4  is 5 * 12 * 254  + 4 * 254 = 16256
	"maximum_height": null,
	"minimum_height": null, 

	// A-list features
	"minimum_attractiveness" : null, // 4000 | 6000 | 8000 | 10000
	"maximum_attractiveness" : null, // 4000 | 6000 | 8000 | 10000
	"bodytype": [], "thin" | "fit" | "average" | "jacked" | "overweight" | "a_little_extra" | "full_figured" | "curvy"
		
	// Background filter
	"languages": 0,
	"speaks_my_language": true,
	"ethnicity": [], "asian" | "black" | "native_american" | ...
	"religion": ["agnosticism", "atheism"], "buddhism" | "catholicism" | "christianity" | "sikh" | ...

	// Availabilty filter
	"availability": "single", // "not_single"
	"monogamy": "yes", // "no"
	"looking_for": ["short_term_dating"], // "new_friends" | "long_term_dating" | "casual_sex"

	// Personality filter
	"personality_filters": {
		"self_confidence" : ..., // "more" | "less"
		"compassion" : ..., // "more" | "less"
		"independence" : ..., // "more" | "less"
		"introversion" : ..., // "more" | "less"
		"adventuresome" : ..., // "more" | "less"
		"artsiness" : ..., // "more" | "less"
		"romantic" : ..., // "more" | "less"
		"sex_experience" : ..., // "more" | "less"
		"old_fashionedness" : ..., // "more" | "less"
		"trust_in_others" : ..., // "more" | "less"
		"purity" : ... // "more" | "less"
	},

	// Vices filter
	"smoking": ["no", "sometimes"] // "when_drinking" | "trying_to_quit" | "yes"
	"drinking": ["socially", "rarely", "very_often"] // "not_at_all" | "often" | desperately"
	"drugs": ["sometimes"], // "never" | "often"
		
	// Questions filter	
	"questions": [403], // question id collection, 403 is "Do you enjoy discussing politics?" 
	"answers": [2], // 2 for "yes" to question 403
	// maps by index to answer in "answers" field

	// More filter
	"interest_ids": [], // interests id
	"education": ["post_grad"], // "two_year_college" | "college_university" | "high_school"
	"children": ["wants_kids", "doesnt_have"] // "might_want" | "doesnt_want" | "has_one_or_more" 
	"cats": ["has"], 
	"dogs": [], "has"

	// Additional metadata
	"limit": 18, // max number of results
	"fields": "userinfo,thumbs,percentages,likes,last_contacts,online" // additional data to be returned
}

```

The body returned (with no fields set) will have the following structure: 

```javascript
{
	"total_matches": ..., // some number 
	"data": [...], // results collection
	"paging" : {
		"cursors" : {
			"before" : ..., // before page hash
			"current" : ..., // current page hash
			"after" : ... // after page hash
		}
	}
}
```

The data collection contains all the search results. The objects take the structure:

```javascript
{
	"inactive": false,
	"username": ..., // username 
	"userid": ...,  // user id
	"staff": false,
	"isAdmin": false
},
```

The results come back with a page hash. To get the next page results, this method can be called again with an additional `after` field set in the options object. The value should be set to the value stored in `body.paging.after`. This process can iterated to produce all search results.

The same process can also be applied in reverse with `before`. 

---
### Edit Profile

`.editProfile(edit_category, options, callback)`

Edit the desired category.

The categories available are the following:
* essays

There are 10 essays that you can edit:
* 0: My self-summary
* 1: What I’m doing with my life
* 2: I’m really good at 
* 3: The first things people usually notice about me
* 4: Favorite books, movies, shows, music, and food
* 5: Six things I could never do without
* 6: I spend a lot of time thinking about
* 7: On a typical Friday night I am
* 8: The most private thing I’m willing to admit
* 9: You should message me if

For example, if you want to edit the 4th essay, your query needs to be the following:

```javascript
var query = {
	'essays': {
		'4': 'Matrix is my favorite movie'
	}
}
```

---
### Get Likes

`.getLikes(options, callback)`

Perform a request for Likes, as seen on the Likes page.

The `options` variable is used to construct the query string for the request, for example:

```javascript
var options = {
	fields: "likes,thumbs.limit(1){225x225},location,userinfo,online,percentages,last_contacts"
}
```

It is possible to distinguish a "match" from a "like" by looking at the returned `section`
property for each user.

The results of this request are paginated in the same way as the `search` [method](#search-browse-matches).
To learn how to access data on additional pages, read [SEARCH.md](SEARCH.md).

Code Samples
============
Here is a sample request to login, go to the quickmatch/double-take page, and subsequently LIKE the user.
```
var OKCupid = require('okcupidjs')
var okc = new OKCupid()

okc.login('okc_username', 'okc_password', function(err, res, body) {
    okc.getQuickmatch(function(err, res, body) {
        okc.like(body.tuid);
    }
})    
```
If you then go onto the okc web page, and go to `Likes -> Who you like`, you will see that you have liked a new person.
I hope this helps.

Search
-------
Another use case is searching for users. The search API is rich and one may query on many different attributes. Perhaps you are interseted in a single, straight woman who is between the ages 31 and 37. This women has cats and never does drugs. They are also more adventurous and less artistic. This criteria can be made into a query object that can get passed to the search method on an okc object.
```
var OKCupid = require('okcupidjs')
var okc = new OKCupid()

okc.login('okc_username', 'okc_password', function(err, res, body) {
  var query = {
    "i_want": "women",
    "minimum_age": 31,
    "maximum_age": 37,
    "cats": ["has"], 
    "personality_filters": {
      "adventuresome" : "more",
      "artsiness" : "less"
    },
    "drugs": ["never"]
  }

  okc.search(query, function(err, res, body) {
    if (err) {
      console.log("Failed to get search results.");
    } 
    else {
      // use the body object to extract the search results
      var results = body.data;

      console.log('Users:\n')
      results.forEach(function(user) {
        console.log(user.username + '\n');
      });
    }
  });
})    
```

Search results are limited to about 30 results per request. To scrape more data from search, one has to sequentially create requests to retrieve search result pages. See [the search pagination guide](SEARCH.md) for details and an example.

Collaboration
=============
Feel free to send suggestions, ask questinos, or report issues via the issues board.
Pull requests and feature enhancements are very welcome.


Credits And Special Thanks
-------

### Special Thanks To

* **Mackenzie Clark** _([@xmclark](https://github.com/xmclark))_ for major contributions in user messaging flow, user search, and bug fixes.
* **Joshua Beeler** _([@joshuabeeler](https://github.com/joshuabeeler))_ for contributions in getting user questions.
* **Pierrick Turelier** _([@PierrickGT](https://github.com/PierrickGT))_ for contributions in editing user profile.
* **Tamara Jordan** _([@tamj0rd2](https://github.com/tamj0rd2))_ for get matches endpoint.


Copyright &copy; 2014 [Hung Tran](http://hungtran.co)
For reference, I wrote a small piece on OKCupid, online dating, and data privacy here:
[http://hungtran.co/online-dating-and-personal-data-discovering-okcupids-api/](http://hungtran.co/online-dating-and-personal-data-discovering-okcupids-api/)

Released under the MIT License, which can be found in the repository in `LICENSE.txt`.
