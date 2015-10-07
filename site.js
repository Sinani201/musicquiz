// @license magnet:?xt=urn:btih:1f739d935676111cfff4b4693e3816e664797050&dn=gpl-3.0.txt GPL-v3-or-Later

function removeChildren(parent) {
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
}

function handleFileSelect(evt) {
	var files = evt.target.files;

	var div_songlist = document.getElementById("songlist");

	removeChildren(div_songlist);
	for (var i = 0; i < files.length; i++) {
		var tr = document.createElement("tr");
		tr.songfile = files[i];

		var td_check = document.createElement("td");
		
		var label = document.createElement("label");
		var check = document.createElement("input");

		check.type = "checkbox";
		check.checked = true;

		label.appendChild(check);
		label.appendChild(document.createTextNode(files[i].name));

		td_check.appendChild(label);
		tr.appendChild(td_check);
		div_songlist.appendChild(tr);
	}
}

function initSongSnippet(songfile, callback) {
	var reader = new FileReader();
	reader.onload = function (event) {
		the_url = event.target.result;
		var player = document.getElementById("player");
		player.src = the_url;
		player.play();
	}
	reader.readAsDataURL(songfile);
}

function replaySongSnippet() {
	var player = document.getElementById("player");
	player.currentTime = player.startedTime;
	player.play();
}

window.onload = function () {
	if (window.File && window.FileReader && window.FileList && window.Blob) {
		document.getElementById("files").addEventListener('change', handleFileSelect, false);

		document.getElementById("files").addEventListener('change', function () {
			document.getElementById("helptext").style.display = "none";
			document.getElementById("showhide").style.display = "block";
			document.getElementById("selectallnone").style.display = "block";
			document.getElementById("playsong").style.display = "block";
		}, false);
	}

	document.getElementById("showhide").onclick = function () {
		songSelector = document.getElementById("song-selector");
		if (songSelector.style.display === "none") {
			songSelector.style.display = "block";
			this.innerHTML = "Hide song list"
		} else {
			songSelector.style.display = "none";
			this.innerHTML = "Show song list"
		}
	}

	// check every box
	document.getElementById("selectall").onclick = function () {
		var div_songlist_c = document.getElementById("songlist").children;
		for (var i = 0; i < div_songlist_c.length; i++) {
			div_songlist_c[i].children[0].children[0].children[0].checked = true;
		}
	}

	// uncheck every box
	document.getElementById("selectnone").onclick = function () {
		var div_songlist_c = document.getElementById("songlist").children;
		for (var i = 0; i < div_songlist_c.length; i++) {
			div_songlist_c[i].children[0].children[0].children[0].checked = false;
		}
	}

	document.getElementById("player").addEventListener("durationchange", function () {
		this.currentTime = Math.floor(Math.random() * (this.duration - 15));
		this.startedTime = this.currentTime;
	}, false);

	document.getElementById("player").addEventListener("timeupdate", function () {
		if (this.currentTime > this.startedTime + 15) {
			this.pause();
		}
	}, false);

	document.getElementById("playsong").onclick = function () {
		var div_songlist_c = document.getElementById("songlist").children;
		var songfiles = [];
		for (var i = 0; i < div_songlist_c.length; i++) {
			if (div_songlist_c[i].children[0].children[0].children[0].checked) {
				songfiles.push(div_songlist_c[i].songfile);
			}
		}

		var song = songfiles[Math.floor(Math.random()*songfiles.length)];
		initSongSnippet(song);

		this.style.display = "none";
		document.getElementById("reveal").style.display = "inline";

		document.getElementById("replay").style.display = "inline";

		var div_songname = document.getElementById("songname");
		div_songname.style.visibility = "hidden";
		removeChildren(div_songname);
		div_songname.appendChild(document.createTextNode(song.name));
	};

	document.getElementById("reveal").onclick = function () {
		document.getElementById("songname").style.visibility = "visible";
		var button_playsong = document.getElementById("playsong");
		removeChildren(button_playsong);
		button_playsong.appendChild(document.createTextNode("Play another"));
		button_playsong.style.display = "inline";
		this.style.display = "none";
	}

	document.getElementById("replay").onclick = replaySongSnippet;
};
// @license-end
