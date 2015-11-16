// @license magnet:?xt=urn:btih:1f739d935676111cfff4b4693e3816e664797050&dn=gpl-3.0.txt GPL-v3-or-Later

function removeChildren(parent) {
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
}

function handleDragOver(evt) {
	evt.stopPropagation();
	evt.preventDefault();
	if (evt.dataTransfer) {
		evt.dataTransfer.dropEffect = "copy";
	}
	var dragbox = document.getElementById("dragbox");
	if (evt.type === "dragover") {
		dragbox.classList.add("hover");
	} else {
		dragbox.classList.remove("hover");
	}
}

function handleFileSelect(evt) {
	handleDragOver(evt);

	var files = evt.target.files;
	if (!files || files.length === 0) {
		files = evt.dataTransfer.files;
	}

	var div_songlist = document.getElementById("songlist");

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

function uploadedFirstFile() {
	document.getElementById("showhide").style.display = "block";
	document.getElementById("selectallnone").style.display = "block";
	document.getElementById("playsong").style.display = "block";
}

window.onload = function () {
	if (window.File && window.FileReader && window.FileList && window.Blob) {
		document.getElementById("files").addEventListener('change', uploadedFirstFile, false);
		document.getElementById("files").addEventListener('change', handleFileSelect, false);
	}

	document.getElementById("showhide").onclick = function () {
		var songSelector = document.getElementById("song-selector");
		if (songSelector.style.display === "none") {
			songSelector.style.display = "block";
			this.innerHTML = "Hide song list"
		} else {
			songSelector.style.display = "none";
			this.innerHTML = "Show song list"
		}
	}

	// drag and drop files into the song-selector div
	var songSelector = document.getElementById("song-selector");
	songSelector.addEventListener('dragover', handleDragOver, false);
	songSelector.addEventListener('dragleave', handleDragOver, false);
	songSelector.addEventListener('drop', uploadedFirstFile, false);
	songSelector.addEventListener('drop', handleFileSelect, false);

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

		var song;

		if (document.getElementById("check-groupsongs").checked) {
			var bigsongs = [];
			for (var i = 0; i < div_songlist_c.length; i++) {
				if (div_songlist_c[i].children[0].children[0].children[0].checked) {
					var songfile = div_songlist_c[i].songfile;
					var whereIsDot = songfile.name.lastIndexOf(".");
					if (songfile.name[whereIsDot-2] === " ") {
						var realname = songfile.name.slice(0, whereIsDot-2);
					} else {
						var realname = songfile.name.slice(0, whereIsDot);
					}
					if (realname in bigsongs) {
						bigsongs[realname].push(songfile);
					} else {
						bigsongs[realname] = [songfile];
					}
				}
			}

			var songnames = Object.keys(bigsongs);
			var smallsongs = bigsongs[songnames[ songnames.length * Math.random() << 0]];
			song = smallsongs[Math.floor(Math.random()*smallsongs.length)];
		} else {
			var songfiles = [];
			for (var i = 0; i < div_songlist_c.length; i++) {
				if (div_songlist_c[i].children[0].children[0].children[0].checked) {
					songfiles.push(div_songlist_c[i].songfile);
				}
			}

			song = songfiles[Math.floor(Math.random()*songfiles.length)];
		}
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
