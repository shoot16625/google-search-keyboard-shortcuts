let focusedIndex = -1;

// WANT: 折りたたみ内のリンク（関連する質問）も除外
function getLinks() {
	const links = Array.from(document.querySelectorAll("#rso a")).filter((link) =>
		link.querySelector("h3"),
	);
	return links;
}

function focusLink(index) {
	const links = getLinks();
	links.forEach((link) => {
		link.removeAttribute("tabindex");
		const h3 = link.querySelector("h3");
		if (h3) {
			h3.style.textDecoration = "";
			h3.style.textDecorationColor = "";
		}
	});

	if (links[index]) {
		links[index].setAttribute("tabindex", "0");
		links[index].focus();
		const h3 = links[index].querySelector("h3");
		if (h3) {
			h3.style.textDecoration = "underline";
			h3.style.textDecorationColor = "red";
		}
		links[index].scrollIntoView({ behavior: "smooth", block: "center" });
		focusedIndex = index;
	}
}

document.addEventListener("keydown", (e) => {
	if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
		if (e.key === "Escape") {
			e.target.blur();
		}
		return;
	}

	const links = getLinks();
	switch (e.key) {
		case "j":
			// down
			if (focusedIndex < links.length - 1) focusLink(focusedIndex + 1);
			break;
		case "k":
			// up
			if (focusedIndex > 0) focusLink(focusedIndex - 1);
			break;
		case "h":
			document.querySelector("#pnprev")?.click();
			break;
		case "l":
			document.querySelector("#pnnext")?.click();
			break;
	}
});
