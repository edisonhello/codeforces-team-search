

const fs = require("fs")
const axios = require("axios")
const cheerio = require("cheerio")

argv = process.argv

team_info = {}

let ST = parseInt(argv[2]), ED = parseInt(argv[3])

function query(i) {
	if (i == ED + 1) {
		let data = JSON.stringify(team_info, null, 4)
		data = "<pre>" + data + "</pre>"
		fs.writeFileSync(`${argv[4]}.html`, data)
	} else {
		axios.get(`http://codeforces.com/team/${i}`).then((res) => {
			$ = cheerio.load(res.data)
			let teamname = $('h3').text()
			let member = []
			$(".members tbody ul").children().each(function(i, e) {
				let name = $(e).children("div").text().split('\n')[3].split(' ')[8]
				member.push(name)
			})
			team_info[i] = [teamname, member]
			console.log(i, team_info[i])
			query(i + 1)
		}).catch((err) => {
			query(i)
		})
	}
}

query(ST)
