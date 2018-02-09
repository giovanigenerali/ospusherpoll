const form = document.getElementById('vote-form');
const {PUSHER_KEY, PUSHER_CLUSTER, PUSHER_LOGTOCONSOLE} = require('./vars');

// Form submit event
form.addEventListener('submit', (event) => {
	event.preventDefault();
	
	Materialize.Toast.removeAll();

	const choice = document.querySelector('input[name=os]:checked');

	if (!choice) {
		Materialize.toast(`<div class="red">Choose your favourite OS!</div>`, 2000, 'red');
		return false;
	}

	const data = {os: choice.value};

	fetch('/poll', {
		method: 'POST',
		body: JSON.stringify(data),
		headers: new Headers({
			'Content-Type': 'application/json'
		})
	})
	.then(res => res.json())
	.then((data) => {
		// reset choice
		choice.checked = false;
		Materialize.toast(`<div>You voted for <strong class="yellow-text">${choice.value}</strong>, thank you!</div>`, 2000, 'green');
	})
	.catch(err => console.log(err));
});

fetch('/poll')
.then(res => res.json())
.then(data => {
	const votes = data.votes;
	const totalVotes = votes.length;
	let chartTitle = `Total votes %totalVotes`;

	// Count vote points - acc/curent
	const voteCounts = votes.reduce((acc, vote) => ((acc[vote.os] = (acc[vote.os] || 0) + parseInt(vote.points)), acc), {});

	// CanvasJS
	let dataPoints = [
		{label: 'Windows', y: voteCounts.Windows},
		{label: 'MacOS', y: voteCounts.MacOS},
		{label: 'Linux', y: voteCounts.Linux},
		{label: 'Other', y: voteCounts.Other}
	];

	const chartContainer = document.getElementById('chartContainer');

	if (chartContainer) {
		const chart = new CanvasJS.Chart('chartContainer', {
			animationEnabled: true,
			theme: 'theme1',
			title: {
				fontFamily: "'Roboto', sans-serif",
				text: chartTitle.replace('%totalVotes', totalVotes),
			},
			toolTip: {
				fontFamily: "'Roboto', sans-serif",
				fontStyle: "normal",
			},
			axisX:{
				labelFontFamily: "'Roboto', sans-serif",
				labelFontWeight: "bold",
				labelFontColor: "#9e9e9e",
			},
			axisY: {
				labelFontFamily: "'Roboto', sans-serif",
				labelFontWeight: "bold",
				labelFontColor: "#9e9e9e",
			},
			data: [
				{
					tyle: 'column',
					dataPoints: dataPoints
				}
			]
		});
		chart.render();

		// Enable pusher logging - don't include this in production
		Pusher.logToConsole = PUSHER_LOGTOCONSOLE;

		const pusher = new Pusher(PUSHER_KEY, {
			cluster: PUSHER_CLUSTER,
			encrypted: true
		});

		const channel = pusher.subscribe('os-poll');
		
		channel
		.bind('os-vote', (data) => {
			dataPoints = dataPoints.map(x => {
				if (x.label == data.os) {
					x.y += data.points;
					return x;
				} 
				else {
					return x;
				}
			});
			chart.render();
		})
		.bind('os-totalvotes', (data) => {
			chart.options.title.text = chartTitle.replace('%totalVotes', data.totalVotes);
			chart.render();
		});

	}
})
.catch(err => console.log(err));