const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Vote = require('../models/Vote');

const Pusher = require('pusher');

const env_vars = require('../scripts/vars');

const pusher = new Pusher({
	appId: process.env.PUSHER_APP_ID || env_vars.developemnt.PUSHER_APP_ID,
	key: process.env.PUSHER_KEY || env_vars.developemnt.PUSHER_KEY,
	secret: process.env.PUSHER_SECRET || env_vars.developemnt.PUSHER_SECRET,
	cluster: process.env.PUSHER_CLUSTER || env_vars.developemnt.PUSHER_CLUSTER,
	encrypted: true
});

router.get('/', (req, res) => {
	Vote.find()
	.then(votes => {
		res.json({success: true, votes: votes})
	})
	.catch(err => console.log('vote:get',err));
});

router.post('/', (req, res) => {

	const newVote = {
    os: req.body.os,
    points: 1
	}

	new Vote(newVote).save()
	.then(vote => {

		pusher.trigger('os-poll', 'os-vote', {
			points: parseInt(vote.points),
			os: vote.os
		});

		Vote.count({})
		.then((total) => {

			pusher.trigger('os-poll', 'os-totalvotes', {
				totalVotes: total
			});

		})
		.catch(err => console.log('vote:count',err));

	})
	.catch(err => console.log('vote:save',err));

	res.json({success:true});

});

module.exports = router;